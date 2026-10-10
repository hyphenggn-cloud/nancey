import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Download,
  Sparkles,
  Receipt,
  FileCheck,
  X,
  CreditCard,
  UserCheck,
  Plus,
  Scale
} from 'lucide-react';
import {
  DocumentType,
  ShipmentDocument,
  SAMPLE_POD_SVG,
  SAMPLE_INVOICE_SVG,
  SAMPLE_EWAY_SVG
} from '../data/shipmentsData';

interface UploadDocumentSectionProps {
  shipmentTrackingId: string;
  consigneeName?: string;
  documents: ShipmentDocument[];
  onDocumentsChange: (documents: ShipmentDocument[]) => void;
  onPodAttached?: () => void;
}

export const UploadDocumentSection: React.FC<UploadDocumentSectionProps> = ({
  shipmentTrackingId,
  consigneeName = '',
  documents,
  onDocumentsChange,
  onPodAttached,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload Form States
  const [docType, setDocType] = useState<DocumentType>('POD');
  const [documentTitle, setDocumentTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [invoiceAmountINR, setInvoiceAmountINR] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Selected file states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Lightbox preview state
  const [activePreviewDoc, setActivePreviewDoc] = useState<ShipmentDocument | null>(null);

  // Handle file selection from disk
  const handleFileSelect = (file: File) => {
    setErrorMsg('');
    setSuccessMsg('');
    setSelectedFile(file);

    if (!documentTitle.trim()) {
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.onerror = () => {
      setErrorMsg('Could not read file. Please choose an image or PDF document.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // 1-Click Generator: Verified POD
  const handleGenerateDigitalPod = () => {
    setErrorMsg('');
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newDoc: ShipmentDocument = {
      id: `doc-pod-${Date.now()}`,
      name: `Verified Proof of Delivery (POD) - ${shipmentTrackingId}`,
      type: 'POD',
      fileName: `POD-${shipmentTrackingId}-Signed.svg`,
      fileSize: '48 KB',
      fileUrl: SAMPLE_POD_SVG,
      uploadedAt: dateFormatted,
      uploadedBy: 'Dispatch Owner',
      verified: true,
      referenceNumber: `POD-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      receiverName: receiverName.trim() || consigneeName || 'Warehouse Receiving Supervisor',
      receiverPhone: receiverPhone.trim() || '+91 98765 43210',
      notes: notes.trim() || 'Received in sound condition with intact seals. Dock verified.',
      mimeType: 'image/svg+xml',
    };

    onDocumentsChange([newDoc, ...documents.filter((d) => d.id !== newDoc.id)]);
    setSuccessMsg(`Official Verified POD generated and attached to ${shipmentTrackingId}!`);
    if (onPodAttached) onPodAttached();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // 1-Click Generator: Commercial Invoice
  const handleGenerateInvoice = () => {
    setErrorMsg('');
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const generatedInvNo = `NL-INV-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newDoc: ShipmentDocument = {
      id: `doc-inv-${Date.now()}`,
      name: `Commercial Tax Invoice (${generatedInvNo})`,
      type: 'Invoice',
      fileName: `${generatedInvNo}.svg`,
      fileSize: '52 KB',
      fileUrl: SAMPLE_INVOICE_SVG,
      uploadedAt: dateFormatted,
      uploadedBy: 'Accounts & Dispatch',
      verified: true,
      referenceNumber: generatedInvNo,
      invoiceAmountINR: invoiceAmountINR.trim() || '₹76,440',
      notes: notes.trim() || 'Full truckload line-haul freight charges including 5% GST.',
      mimeType: 'image/svg+xml',
    };

    onDocumentsChange([newDoc, ...documents.filter((d) => d.id !== newDoc.id)]);
    setSuccessMsg(`Commercial Tax Invoice ${generatedInvNo} attached!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // 1-Click Generator: E-Way Bill
  const handleGenerateEwayBill = () => {
    setErrorMsg('');
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newDoc: ShipmentDocument = {
      id: `doc-ewb-${Date.now()}`,
      name: `GST E-Way Bill Transit Permit`,
      type: 'E-Way Bill',
      fileName: `EWB-Outshipper-${shipmentTrackingId}.svg`,
      fileSize: '76 KB',
      fileUrl: SAMPLE_EWAY_SVG,
      uploadedAt: dateFormatted,
      uploadedBy: 'GST Tax Portal',
      verified: true,
      referenceNumber: `2910-4829-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: 'GST transport electronic transit permit valid across inter-state corridors.',
      mimeType: 'image/svg+xml',
    };

    onDocumentsChange([newDoc, ...documents.filter((d) => d.id !== newDoc.id)]);
    setSuccessMsg(`GST E-Way Bill permit attached!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Attach Document with captured metadata
  const handleAttachDocument = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedFile || !previewUrl) {
      setErrorMsg('Please select or upload a document file.');
      return;
    }

    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const sizeKB = Math.round(selectedFile.size / 1024);
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    const newDoc: ShipmentDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: documentTitle.trim() || `${docType} - ${shipmentTrackingId}`,
      type: docType,
      fileName: selectedFile.name,
      fileSize: sizeStr,
      fileUrl: previewUrl,
      uploadedAt: dateFormatted,
      uploadedBy: 'Dispatch Owner',
      verified: true,
      referenceNumber: referenceNumber.trim() || undefined,
      invoiceAmountINR: docType === 'Invoice' ? invoiceAmountINR.trim() || undefined : undefined,
      receiverName: docType === 'POD' ? receiverName.trim() || consigneeName || undefined : undefined,
      receiverPhone: docType === 'POD' ? receiverPhone.trim() || undefined : undefined,
      notes: notes.trim() || undefined,
      mimeType: selectedFile.type,
    };

    onDocumentsChange([newDoc, ...documents.filter((d) => d.id !== newDoc.id)]);

    if (docType === 'POD' && onPodAttached) {
      onPodAttached();
    }

    setSuccessMsg(`Successfully attached ${docType} "${newDoc.name}" with metadata!`);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDocumentTitle('');
    setReferenceNumber('');
    setInvoiceAmountINR('');
    setReceiverName('');
    setReceiverPhone('');
    setNotes('');

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRemoveDoc = (id: string) => {
    onDocumentsChange(documents.filter((d) => d.id !== id));
    setSuccessMsg('Document removed.');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-5 space-y-5">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Attached Documents, Invoices &amp; Proof of Delivery (POD)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 font-mono text-orange-400">
                {documents.length}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Attach stamped PODs, commercial tax invoices, E-Way bills, and store their metadata for this shipment.
            </p>
          </div>
        </div>

        {/* Quick POD Status Indicator */}
        <div className="flex items-center gap-2">
          {documents.some((d) => d.type === 'POD') ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>POD Attached &amp; Verified</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
              <span>Pending POD</span>
            </span>
          )}
        </div>
      </div>

      {/* Status Notifications */}
      {errorMsg && (
        <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1-Click Generator Toolbar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="font-medium text-[11px]">Instant Digital Document Templates:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateDigitalPod}
            className="px-2.5 py-1 bg-emerald-800/80 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Generate verified digital POD for this shipment"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>Generate Verified POD</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateInvoice}
            className="px-2.5 py-1 bg-blue-800/80 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Generate official commercial freight tax invoice"
          >
            <Receipt className="w-3 h-3 text-blue-300" />
            <span>Generate Freight Invoice</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateEwayBill}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Generate electronic GST E-Way Bill"
          >
            <FileText className="w-3 h-3 text-cyan-300" />
            <span>Attach E-Way Bill</span>
          </button>
        </div>
      </div>

      {/* Upload Document Form with Metadata Capture */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            Attach Custom File &amp; Capture Metadata
          </span>
          <span className="text-[11px] text-slate-400">
            Target: <code className="text-orange-400 font-mono font-bold">{shipmentTrackingId}</code>
          </span>
        </div>

        {/* Document Type Pills */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Select Document Category:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'POD' as DocumentType, label: 'Proof of Delivery (POD)', icon: ShieldCheck },
              { type: 'Invoice' as DocumentType, label: 'Commercial Invoice', icon: Receipt },
              { type: 'E-Way Bill' as DocumentType, label: 'GST E-Way Bill', icon: FileText },
              { type: 'Consignment Note' as DocumentType, label: 'Lorry Receipt (LR / Bilty)', icon: FileCheck },
              { type: 'Inspection Report' as DocumentType, label: 'Weight / Inspection Slip', icon: Scale },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = docType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setDocType(item.type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Metadata Inputs Based on Selected Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Document Title / Name *</label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder={
                docType === 'POD'
                  ? 'e.g. Stamped Delivery Slip'
                  : docType === 'Invoice'
                  ? 'e.g. FTL Line-Haul Tax Invoice'
                  : 'e.g. Consignment Permit'
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {docType === 'Invoice'
                ? 'Invoice Number'
                : docType === 'POD'
                ? 'POD Reference / Serial #'
                : 'Permit / Document #'
              }
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder={
                docType === 'Invoice'
                  ? 'e.g. NL-INV-2026-904'
                  : docType === 'POD'
                  ? 'e.g. POD-REC-8921'
                  : 'e.g. EWB-2910-4829-1092'
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Conditional Input 1: Invoice Amount or Receiver Details */}
          {docType === 'Invoice' ? (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Invoice Amount (INR)</span>
              </label>
              <input
                type="text"
                value={invoiceAmountINR}
                onChange={(e) => setInvoiceAmountINR(e.target.value)}
                placeholder="e.g. ₹76,440"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          ) : docType === 'POD' ? (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Receiver Person / Supervisor</span>
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder={consigneeName || 'e.g. Rajesh Kumar (Warehouse Sup)'}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Authorized Authority</label>
              <input
                type="text"
                placeholder="e.g. NHAI / GST E-Way System"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          )}
        </div>

        {/* Additional Remarks / Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {docType === 'POD' && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Receiver Phone</label>
              <input
                type="text"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="e.g. +91 98721 00445"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div className={docType === 'POD' ? 'sm:col-span-2' : 'sm:col-span-3'}>
            <label className="block text-slate-400 mb-1 font-semibold">Notes / Inspection Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Delivered in good condition without seal tampering. Verified on dock."
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-orange-500 bg-orange-950/20'
              : selectedFile
              ? 'border-emerald-500 bg-emerald-950/15'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          {selectedFile ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {previewUrl && previewUrl.startsWith('data:image/') ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <FileCheck className="w-6 h-6" />
                </div>
              )}
              <div className="text-left text-xs">
                <div className="font-bold text-white">{selectedFile.name}</div>
                <div className="text-slate-400 text-[11px]">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready to attach
                </div>
                <span className="text-[11px] text-orange-400 hover:underline">
                  Click to select a different file
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Upload className="w-6 h-6 text-slate-400" />
              <div className="text-xs text-slate-200">
                Drag and drop file here, or <span className="text-orange-400 font-semibold">Browse</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Supports POD photos, scanned delivery slips, tax invoices, and PDFs (PNG, JPG, PDF)
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Attach with Metadata */}
        <div className="flex justify-end gap-2 pt-1">
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={handleAttachDocument}
            disabled={!selectedFile}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attach {docType} with Metadata</span>
          </button>
        </div>
      </div>

      {/* List of Currently Attached Documents with Metadata Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Attached Consignment Records ({documents.length})</span>
          {documents.length > 0 && <span>Click preview to inspect high-res scan</span>}
        </div>

        {documents.length === 0 ? (
          <div className="p-5 text-center bg-slate-950/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
            <FileText className="w-7 h-7 mx-auto mb-1.5 text-slate-600" />
            <p>No documents or Proof of Delivery attached to this shipment yet.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Upload a scanned invoice/POD file above or click "Generate Verified POD" to attach.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors text-xs"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                      doc.type === 'POD'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : doc.type === 'Invoice'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    }`}
                  >
                    {doc.type === 'POD' ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : doc.type === 'Invoice' ? (
                      <Receipt className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-white truncate">{doc.name}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          doc.type === 'POD'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                            : doc.type === 'Invoice'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800/80'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {doc.type}
                      </span>

                      {doc.referenceNumber && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                          #{doc.referenceNumber}
                        </span>
                      )}

                      {doc.invoiceAmountINR && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                          {doc.invoiceAmountINR}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{doc.fileName}</span>
                      {doc.fileSize && <span>· {doc.fileSize}</span>}
                      <span>· {doc.uploadedAt}</span>
                      {doc.receiverName && (
                        <span className="text-emerald-400">· Recv: {doc.receiverName}</span>
                      )}
                    </div>

                    {doc.notes && (
                      <p className="text-[11px] text-slate-300 italic pt-0.5">
                        "{doc.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActivePreviewDoc(doc)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Preview scan"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <a
                    href={doc.fileUrl}
                    download={doc.fileName || `${doc.type}-${shipmentTrackingId}`}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-sm">{activePreviewDoc.name}</h4>
                <p className="text-[11px] text-slate-400">
                  {activePreviewDoc.type} · {activePreviewDoc.fileName}
                  {activePreviewDoc.referenceNumber && ` · Ref: ${activePreviewDoc.referenceNumber}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activePreviewDoc.fileUrl}
                  download={activePreviewDoc.fileName}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActivePreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center flex-1 bg-slate-950/40 min-h-[350px]">
              {activePreviewDoc.fileUrl.startsWith('data:image/') ||
              activePreviewDoc.fileUrl.endsWith('.png') ||
              activePreviewDoc.fileUrl.endsWith('.jpg') ||
              activePreviewDoc.fileUrl.endsWith('.svg') ? (
                <img
                  src={activePreviewDoc.fileUrl}
                  alt={activePreviewDoc.name}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg border border-slate-800 shadow-lg bg-white"
                />
              ) : (
                <iframe
                  src={activePreviewDoc.fileUrl}
                  title={activePreviewDoc.name}
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
