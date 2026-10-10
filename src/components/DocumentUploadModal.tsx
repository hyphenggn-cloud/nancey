import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Trash2,
  Download,
  Sparkles,
  ShieldCheck,
  FileCheck,
  FileType,
  Image as ImageIcon
} from 'lucide-react';
import { DocumentType, ShipmentDocument, SAMPLE_POD_SVG, SAMPLE_EWAY_SVG } from '../data/shipmentsData';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'shipment' | 'trip';
  targetId: string;
  targetTitle?: string;
  existingDocuments?: ShipmentDocument[];
  onDocumentUploaded: (document: ShipmentDocument) => void;
  onDocumentDeleted: (docId: string) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
  existingDocuments = [],
  onDocumentUploaded,
  onDocumentDeleted,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<DocumentType>('POD');
  const [customName, setCustomName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeViewingDoc, setActiveViewingDoc] = useState<ShipmentDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileSelection = (file: File) => {
    setErrorMsg('');
    setSuccessMsg('');
    setSelectedFile(file);

    if (!customName.trim()) {
      setCustomName(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process file. Please try a different format.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedFile || !previewUrl) {
      setErrorMsg('Please select or drop a file to upload.');
      return;
    }

    setUploading(true);
    try {
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ', ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const sizeKB = Math.round(selectedFile.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      const newDoc: ShipmentDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: customName.trim() || `${docType} - ${targetId}`,
        type: docType,
        fileName: selectedFile.name,
        fileSize: sizeStr,
        fileUrl: previewUrl,
        uploadedAt: dateFormatted,
        uploadedBy: 'Dispatch Owner',
        verified: true,
      };

      onDocumentUploaded(newDoc);
      setSuccessMsg(`${docType} successfully uploaded and attached to ${targetId}!`);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCustomName('');

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateDigitalPod = () => {
    setErrorMsg('');
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const digitalPodSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="600" height="380" rx="12" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="50" y="60" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">OUTSHIPPER - OFFICIAL PROOF OF DELIVERY</text><text x="50" y="85" font-family="sans-serif" font-size="12" fill="%2364748b">Digital Consignment Handover &amp; Receiver Acknowledgment</text><line x1="50" y1="100" x2="590" y2="100" stroke="%23e2e8f0" stroke-width="2"/><text x="50" y="135" font-family="sans-serif" font-size="14" fill="%23334155">Consignment ID: <tspan font-weight="bold" font-family="monospace" fill="%23ea580c">${targetId}</tspan></text><text x="350" y="135" font-family="sans-serif" font-size="14" fill="%23334155">Handover Time: <tspan font-weight="bold">${dateFormatted}</tspan></text><text x="50" y="170" font-family="sans-serif" font-size="14" fill="%23334155">Shipment Title: <tspan font-weight="bold">${targetTitle || 'Commercial Goods'}</tspan></text><text x="50" y="205" font-family="sans-serif" font-size="14" fill="%23334155">Status: <tspan font-weight="bold" fill="%2316a34a">DELIVERED IN SOUND ORDER</tspan></text><rect x="50" y="240" width="280" height="120" rx="8" fill="%23f1f5f9" stroke="%2394a3b8"/><text x="65" y="270" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23334155">Consignee Receiving Stamp:</text><text x="65" y="300" font-family="sans-serif" font-size="16" font-style="italic" fill="%230284c7">Goods Verified &amp; Accepted %E2%9C%93</text><text x="65" y="335" font-family="sans-serif" font-size="11" fill="%2364748b">Verified by Warehouse Dock Super</text><circle cx="500" cy="300" r="50" fill="%23dcfce7" stroke="%2316a34a" stroke-width="3"/><text x="500" y="295" font-family="sans-serif" font-size="15" font-weight="bold" fill="%2315803d" text-anchor="middle">VERIFIED</text><text x="500" y="318" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2315803d" text-anchor="middle">OFFICIAL POD</text></svg>`;

    const newDoc: ShipmentDocument = {
      id: `doc-digital-pod-${Date.now()}`,
      name: `Digital Verified POD (${targetId})`,
      type: 'POD',
      fileName: `POD-${targetId}-Digital.svg`,
      fileSize: '48 KB',
      fileUrl: digitalPodSvg,
      uploadedAt: dateFormatted,
      uploadedBy: 'Dispatch System (Auto-Generated)',
      verified: true,
    };

    onDocumentUploaded(newDoc);
    setSuccessMsg(`Official Digital Verified POD generated and attached for ${targetId}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleGenerateDigitalEway = () => {
    setErrorMsg('');
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newDoc: ShipmentDocument = {
      id: `doc-digital-ewb-${Date.now()}`,
      name: `GST E-Way Bill Transit Permit (${targetId})`,
      type: 'E-Way Bill',
      fileName: `EWB-Outshipper-${targetId}.svg`,
      fileSize: '76 KB',
      fileUrl: SAMPLE_EWAY_SVG,
      uploadedAt: `${dateFormatted}, 10:00 AM`,
      uploadedBy: 'GST Tax Portal Integration',
      verified: true,
    };

    onDocumentUploaded(newDoc);
    setSuccessMsg(`GST E-Way Bill permit attached for ${targetId}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-display text-base text-white">
                  Document & POD Vault
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800">
                  {targetId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {targetType === 'shipment' ? 'Consignment' : 'Trip'} Document Repository: Upload Proof of Delivery (POD), E-Way Bills & Invoices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick 1-Click Generator Toolbar */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300 font-medium">Quick Document Templates:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGenerateDigitalPod}
                className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Generate Verified POD</span>
              </button>
              <button
                type="button"
                onClick={handleGenerateDigitalEway}
                className="px-3 py-1.5 bg-blue-700/80 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Attach E-Way Bill</span>
              </button>
            </div>
          </div>

          {/* File Upload Form */}
          <form onSubmit={handleUploadSubmit} className="space-y-4 bg-slate-800/40 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Upload New Document / Proof
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="POD">Proof of Delivery (POD / Signed Challan)</option>
                  <option value="E-Way Bill">GST E-Way Bill Transit Permit</option>
                  <option value="Consignment Note">Consignment Note (Lorry Receipt / LR)</option>
                  <option value="Invoice">Commercial Tax Invoice</option>
                  <option value="Inspection Report">Weighbridge / Inspection Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Custom Label / Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Signed Delivery Slip - Mumbai Dock"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-orange-500 bg-orange-950/20'
                  : selectedFile
                  ? 'border-emerald-500/80 bg-emerald-950/10'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-white">{selectedFile.name}</div>
                  <div className="text-xs text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB · Ready to save
                  </div>
                  <span className="text-[11px] text-orange-400 hover:underline">
                    Click to choose a different file
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Drag and drop file here, or <span className="text-orange-400">Browse</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Supports POD photos, scanned delivery slips, and PDFs (PNG, JPG, SVG, PDF)
                  </div>
                </div>
              )}
            </div>

            {/* Submit Upload Button */}
            <div className="flex justify-end gap-3 pt-2">
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Clear File
                </button>
              )}
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>Attach to {targetId}</span>
              </button>
            </div>
          </form>

          {/* Existing Attached Documents List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>Attached Files</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 font-mono text-slate-400">
                  {existingDocuments.length}
                </span>
              </h4>
            </div>

            {existingDocuments.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl text-slate-500 text-xs">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>No documents or Proof of Delivery uploaded yet for {targetId}.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Upload a photo of signed delivery receipt or click "Generate Verified POD" above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {existingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.type === 'POD'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : doc.type === 'E-Way Bill'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        }`}
                      >
                        {doc.type === 'POD' ? (
                          <ShieldCheck className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-white truncate">
                            {doc.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              doc.type === 'POD'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {doc.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          <span>{doc.fileName}</span>
                          {doc.fileSize && <span> · {doc.fileSize}</span>}
                          <span> · {doc.uploadedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveViewingDoc(doc)}
                        className="px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-600 text-slate-200 hover:text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>

                      <a
                        href={doc.fileUrl}
                        download={doc.fileName || `${doc.type}-${targetId}`}
                        className="p-1.5 bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove "${doc.name}" from ${targetId}?`)) {
                            onDocumentDeleted(doc.id);
                          }
                        }}
                        className="p-1.5 bg-slate-700/80 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {existingDocuments.length} document{existingDocuments.length !== 1 ? 's' : ''} stored
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* In-Modal Full Document Viewer Lightbox */}
      {activeViewingDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">{activeViewingDoc.name}</h4>
                <p className="text-[11px] text-slate-400">
                  {activeViewingDoc.type} · {activeViewingDoc.fileName} · {activeViewingDoc.uploadedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeViewingDoc.fileUrl}
                  download={activeViewingDoc.fileName}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setActiveViewingDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center flex-1 bg-slate-900/40 min-h-[360px]">
              {activeViewingDoc.fileUrl.startsWith('data:image/') ||
              activeViewingDoc.fileUrl.endsWith('.png') ||
              activeViewingDoc.fileUrl.endsWith('.jpg') ||
              activeViewingDoc.fileUrl.endsWith('.svg') ? (
                <img
                  src={activeViewingDoc.fileUrl}
                  alt={activeViewingDoc.name}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg border border-slate-800 shadow-lg bg-white"
                />
              ) : (
                <iframe
                  src={activeViewingDoc.fileUrl}
                  title={activeViewingDoc.name}
                  className="w-full h-[70vh] rounded-lg border border-slate-800 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
