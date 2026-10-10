import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function aiAssistantPlugin(): Plugin {
  return {
    name: 'ai-assistant-api',
    configureServer(server) {
      server.middlewares.use('/api/assistant', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { message, history, model: requestedModel, enableSearch } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }));
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            // Model selection: gemini-3.5-flash (general with search), gemini-3.1-flash-lite (fast), gemini-3.1-pro-preview (complex)
            let chosenModel = 'gemini-3.5-flash';
            if (requestedModel === 'gemini-3.1-flash-lite') {
              chosenModel = 'gemini-3.1-flash-lite';
            } else if (requestedModel === 'gemini-3.1-pro-preview') {
              chosenModel = 'gemini-3.1-pro-preview';
            }

            const isSearchApplicable = chosenModel === 'gemini-3.5-flash' && enableSearch !== false;

            const systemPrompt = `You are the Nancy Logistics Senior Dispatch & Fleet Advisor for "Nancy Logistics", India's premier B2B freight transportation and supply chain carrier.
Company: Nancy Logistics & Supply Chain Solutions Pvt. Ltd.
Brand positioning: "Reliable logistics. Smarter transportation. On-time delivery."
Fleet classes:
1. Mini Truck (0.8 - 1.2 MT) – City point-to-point & retail distribution
2. Pickup Truck (1.5 - 2.5 MT) – Suburban, hardware & building supplies
3. 14 Ft ICV (3.5 - 4.5 MT) – Fast interstate FMCG, pharmaceuticals, garments
4. 17 Ft Truck (5.0 - 7.0 MT) – Industrial spares, plastics, raw materials
5. 20 Ft Truck (7.5 - 10.0 MT) – High-volume line-haul & multi-facility transfers
6. 32 Ft Multi-Axle (14.0 - 18.5 MT) – Heavy line-haul, appliances & bulk manufacturing
7. Container Truck (18.0 - 25.0 MT) – High-security weather-sealed ISO cargo
8. Heavy Trailer (25.0 - 40.0 MT) – Over-Dimensional Cargo (ODC), structural steel & machinery

Services: Full Truck Load (FTL), Part Truck Load (PTL), Freight Management, Goods Transportation, Express Delivery, Warehouse & Distribution, Supply Chain Solutions, Dedicated Fleet.

Guidelines:
1. Help users analyze payload tonnage and select the exact appropriate vehicle class.
2. Provide accurate, up-to-date Indian transportation guidance (highway corridors, FASTag, NHAI guidelines, GST E-Way Bill documentation).
3. If search grounding is enabled, utilize live web information for weather conditions, traffic disruptions, fuel trends, and regional industrial news.
4. STRICT: Never invent exact rates, guaranteed prices, or binding delivery arrival times.
5. Direct users seeking formal quotations to the "Get a Quote" form.
6. Maintain a helpful, highly professional B2B corporate tone.`;

            const contents = [
              ...((history || []).map((h: { sender: string; text: string }) => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              }))),
              { role: 'user', parts: [{ text: message }] }
            ];

            const config: Record<string, unknown> = {
              systemInstruction: systemPrompt,
              temperature: 0.3,
            };

            if (isSearchApplicable) {
              config.tools = [{ googleSearch: {} }];
            }

            const response = await ai.models.generateContent({
              model: chosenModel,
              contents,
              config,
            });

            const replyText = response.text || 'I am ready to assist with your transportation requirement.';

            // Extract Google Search Grounding sources if available
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const sources = groundingChunks?.map((chunk: { web?: { title?: string; uri?: string } }) => ({
              title: chunk.web?.title || 'Web Reference',
              uri: chunk.web?.uri || '',
            })).filter((s: { uri: string }) => s.uri) || [];

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              reply: replyText,
              sources,
              modelUsed: chosenModel,
            }));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: message }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      aiAssistantPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/',
          name: 'Nancy Logistics | B2B Transportation',
          short_name: 'NancyFreight',
          description: 'Nancy Logistics delivers reliable B2B transportation, freight, and supply chain solutions across India.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api/],
          clientsClaim: true,
          skipWaiting: true,
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              // Google Fonts Stylesheets
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Google Fonts Webfonts
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Static Images and Icons
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            {
              // App Navigation & Pages (NetworkFirst for fresh data, offline cache fallback for poor network)
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

