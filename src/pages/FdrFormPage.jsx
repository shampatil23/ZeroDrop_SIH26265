import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Building2,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  FileCheck,
  ArrowLeft,
  X,
  Coins,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { fdrService, auditService } from '../services/dataService';
import { banks, formatINR } from '../data/demoData';
import { animatePageEntrance } from '../animations/gsapConfig';
import toast from 'react-hot-toast';

export default function FdrFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, refresh } = useData();
  const pageRef = useRef(null);

  const institutions = data?.institutions || [];
  const existingFdrs = data?.fdrRecords || [];
  const isEditing = Boolean(id);

  // Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      institutionId: '',
      institutionName: '',
      institutionType: 'Engineering',
      state: '',
      contactPerson: '',
      fdrNumber: '',
      bank: banks[0],
      branch: '',
      principalAmount: '',
      interestRate: '7.1',
      issueDate: '2026-04-15',
      maturityDate: '2027-04-15',
      parentFdr: '',
    },
  });

  const watchedInstId = watch('institutionId');
  const watchedFdrNumber = watch('fdrNumber');
  const watchedIssueDate = watch('issueDate');
  const watchedMaturityDate = watch('maturityDate');
  const watchedAmount = watch('principalAmount');

  // Pre-fill when editing
  useEffect(() => {
    animatePageEntrance(pageRef);
    if (isEditing && id) {
      const existing = existingFdrs.find((f) => f.id === id);
      if (existing) {
        setValue('institutionId', existing.institutionId);
        setValue('institutionName', existing.institutionName);
        setValue('bank', existing.bank);
        setValue('branch', existing.branch);
        setValue('principalAmount', existing.principalAmount);
        setValue('interestRate', existing.interestRate || '7.0');
        setValue('issueDate', existing.issueDate);
        setValue('maturityDate', existing.maturityDate);
        setValue('fdrNumber', existing.id);
        setValue('parentFdr', existing.parentFdr || '');

        const inst = institutions.find((i) => i.id === existing.institutionId);
        if (inst) {
          setValue('institutionType', inst.type);
          setValue('state', inst.state);
          setValue('contactPerson', inst.contact);
        }
        setSelectedFile({ name: `${existing.id}_certificate.pdf`, size: '1.4 MB' });
      }
    }
  }, [isEditing, id, existingFdrs, institutions, setValue]);

  // Sync institution selection
  const handleInstitutionChange = (e) => {
    const instId = e.target.value;
    setValue('institutionId', instId);
    const inst = institutions.find((i) => i.id === instId);
    if (inst) {
      setValue('institutionName', inst.name);
      setValue('institutionType', inst.type);
      setValue('state', inst.state);
      setValue('contactPerson', inst.contact);
    }
  };

  // Check duplicate FDR number
  useEffect(() => {
    if (!watchedFdrNumber) {
      setDuplicateWarning('');
      return;
    }
    const isDup = existingFdrs.some(
      (f) => f.id.toLowerCase() === watchedFdrNumber.trim().toLowerCase() && f.id !== id
    );
    if (isDup) {
      setDuplicateWarning(`Warning: FDR Reference '${watchedFdrNumber}' already exists in registry!`);
    } else {
      setDuplicateWarning('');
    }
  }, [watchedFdrNumber, existingFdrs, id]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  const onSubmit = (formData) => {
    // Validate date order
    if (new Date(formData.maturityDate) <= new Date(formData.issueDate)) {
      toast.error('Maturity date must be after Issue date.');
      return;
    }

    const payload = {
      id: formData.fdrNumber.trim().toUpperCase(),
      institutionId: formData.institutionId,
      institutionName: formData.institutionName,
      bank: formData.bank,
      branch: formData.branch,
      principalAmount: Number(formData.principalAmount),
      interestRate: Number(formData.interestRate),
      issueDate: formData.issueDate,
      maturityDate: formData.maturityDate,
      status: 'Active',
      verificationStatus: 'Pending',
      renewalStatus: 'Healthy',
      parentFdr: formData.parentFdr || null,
      documentId: selectedFile ? `DOC-${Math.floor(100 + Math.random() * 900)}` : 'DOC-NEW',
    };

    if (isEditing) {
      fdrService.update(id, payload);
      toast.success('FDR Record updated successfully');
    } else {
      fdrService.create(payload);
      toast.success('FDR Record created and submitted for verification');
    }

    refresh();
    navigate('/fdr-repository');
  };

  return (
    <div ref={pageRef} className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button & Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/fdr-repository')}
          className="p-2 rounded-xl border border-border bg-white text-text-secondary hover:text-text-main transition-colors"
          aria-label="Back to Repository"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-text-main">
            {isEditing ? `Edit FDR Instrument: ${id}` : 'Register New FDR Security Deposit'}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Digitize institutional security deposits, bank lien letters, and supporting FDR certificates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section A: Institution Information */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Building2 className="text-emerald-primary" size={18} />
            <h3 className="text-sm font-semibold text-text-main">Section A: Institution Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Select Institution <span className="text-red-critical">*</span>
              </label>
              <select
                {...register('institutionId', { required: 'Please select an institution' })}
                onChange={handleInstitutionChange}
                className="select-field text-xs"
              >
                <option value="">-- Choose Institution --</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.id})
                  </option>
                ))}
              </select>
              {errors.institutionId && (
                <span className="text-[11px] text-red-critical mt-1 block">
                  {errors.institutionId.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Institution Type</label>
              <input
                type="text"
                {...register('institutionType')}
                readOnly
                className="input-field text-xs bg-bg-secondary cursor-not-allowed"
                placeholder="Auto-populated"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">State / Jurisdiction</label>
              <input
                type="text"
                {...register('state')}
                readOnly
                className="input-field text-xs bg-bg-secondary cursor-not-allowed"
                placeholder="Auto-populated"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Authorized Contact Person</label>
              <input
                type="text"
                {...register('contactPerson')}
                readOnly
                className="input-field text-xs bg-bg-secondary cursor-not-allowed"
                placeholder="Auto-populated"
              />
            </div>
          </div>
        </div>

        {/* Section B: Financial Instrument */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Coins className="text-emerald-primary" size={18} />
            <h3 className="text-sm font-semibold text-text-main">Section B: Financial Instrument</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                FDR Reference Number <span className="text-red-critical">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. FDR-2026-099"
                {...register('fdrNumber', { required: 'FDR reference number is required' })}
                className="input-field text-xs uppercase"
              />
              {duplicateWarning && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-700 mt-1">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>{duplicateWarning}</span>
                </div>
              )}
              {errors.fdrNumber && (
                <span className="text-[11px] text-red-critical mt-1 block">
                  {errors.fdrNumber.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Issuing Scheduled Commercial Bank <span className="text-red-critical">*</span>
              </label>
              <select {...register('bank', { required: true })} className="select-field text-xs">
                {banks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Branch Name & Address <span className="text-red-critical">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Shivaji Nagar Branch, Pune"
                {...register('branch', { required: 'Branch name is required' })}
                className="input-field text-xs"
              />
              {errors.branch && (
                <span className="text-[11px] text-red-critical mt-1 block">
                  {errors.branch.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Principal Deposit Amount (INR) <span className="text-red-critical">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-secondary">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  {...register('principalAmount', {
                    required: 'Principal deposit amount is required',
                    min: { value: 100000, message: 'Minimum deposit is ₹1,00,000' },
                  })}
                  className="input-field pl-7 text-xs tabular-nums"
                />
              </div>
              {watchedAmount && (
                <span className="text-[11px] text-emerald-primary mt-1 block font-medium">
                  {formatINR(Number(watchedAmount))}
                </span>
              )}
              {errors.principalAmount && (
                <span className="text-[11px] text-red-critical mt-1 block">
                  {errors.principalAmount.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.05"
                placeholder="e.g. 7.10"
                {...register('interestRate')}
                className="input-field text-xs tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Linked Parent FDR (If Renewal / Replacement)
              </label>
              <input
                type="text"
                placeholder="e.g. FDR-2025-010 (leave blank if new)"
                {...register('parentFdr')}
                className="input-field text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Date of Issue <span className="text-red-critical">*</span>
              </label>
              <input
                type="date"
                {...register('issueDate', { required: 'Issue date is required' })}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Date of Maturity <span className="text-red-critical">*</span>
              </label>
              <input
                type="date"
                {...register('maturityDate', { required: 'Maturity date is required' })}
                className="input-field text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section C: Document Upload */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Upload className="text-emerald-primary" size={18} />
            <h3 className="text-sm font-semibold text-text-main">Section C: Document Upload</h3>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              isDragOver
                ? 'border-emerald-primary bg-emerald-50/40'
                : 'border-border hover:border-emerald-primary/40 bg-bg-secondary/30'
            }`}
          >
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-pale text-emerald-primary flex items-center justify-center">
                    <FileCheck size={18} />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-text-main block">{selectedFile.name}</span>
                    <span className="text-[11px] text-text-secondary">{selectedFile.size} • Ready for OCR extraction</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-md text-text-secondary hover:text-red-critical hover:bg-red-50"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <Upload size={32} className="mx-auto text-text-secondary/50 mb-2" />
                <p className="text-xs font-medium text-text-main">
                  Drag and drop the official FDR Certificate or Bank Lien Letter
                </p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
                <label className="mt-3 inline-block">
                  <span className="btn-secondary text-xs cursor-pointer">Browse File</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Section D: Regulatory Compliance & Review */}
        <div className="card space-y-3 bg-emerald-50/20 border-emerald-primary/30">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-emerald-primary" size={18} />
            <h4 className="text-xs font-semibold text-text-main">Section D: Regulatory Review & Verification Notice</h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            By submitting this instrument, you declare that the deposit has been placed in an authorized Scheduled Commercial
            Bank with joint lien marked in favor of the Chairman, AICTE, New Delhi. This prototype simulates optical character
            recognition (OCR) and duplicate detection for demonstration.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/fdr-repository')}
            className="btn-secondary text-xs px-4 py-2.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-xs px-6 py-2.5"
          >
            {isSubmitting ? 'Submitting...' : isEditing ? 'Save Changes' : 'Submit for Verification'}
          </button>
        </div>
      </form>
    </div>
  );
}
