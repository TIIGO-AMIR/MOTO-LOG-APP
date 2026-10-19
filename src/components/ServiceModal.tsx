import React, { useState, useEffect } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { formatUgx } from '../storage';
import { X, Wrench, AlertCircle, Coins } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  motorcycles: Motorcycle[];
  preselectedMotorcycleId?: string;
  serviceToEdit?: ServiceRecord | null;
  onClose: () => void;
  onSave: (service: Omit<ServiceRecord, 'id' | 'createdAt'>, id?: string) => void;
}

const COMMON_SERVICES = [
  'Oil change',
  'Brake adjustment',
  'Chain replacement',
  'Spark plug replacement',
  'Rear tire tube patch/replacement',
  'Carburetor cleaning & tuning',
  'Clutch cable replacement',
  'Fork oil & seal overhaul',
  'Battery replacement',
];

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  motorcycles,
  preselectedMotorcycleId,
  serviceToEdit,
  onClose,
  onSave,
}) => {
  const [motorcycleId, setMotorcycleId] = useState('');
  const [date, setDate] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [costInput, setCostInput] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (serviceToEdit) {
      setMotorcycleId(serviceToEdit.motorcycleId);
      setDate(serviceToEdit.date);
      setWorkPerformed(serviceToEdit.workPerformed);
      setCostInput(serviceToEdit.costUgx.toString());
      setNotes(serviceToEdit.notes || '');
    } else {
      setMotorcycleId(
        preselectedMotorcycleId || (motorcycles.length > 0 ? motorcycles[0].id : '')
      );
      // Default to today in YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setWorkPerformed('');
      setCostInput('');
      setNotes('');
    }
    setErrors({});
  }, [serviceToEdit, preselectedMotorcycleId, motorcycles, isOpen]);

  if (!isOpen) return null;

  const parsedCost = parseFloat(costInput);
  const isValidNumber = !isNaN(parsedCost);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!motorcycleId) {
      newErrors.motorcycleId = 'Please select a motorcycle.';
    }
    if (!date) {
      newErrors.date = 'Service date is required.';
    }
    if (!workPerformed.trim()) {
      newErrors.workPerformed = 'Work performed description is required.';
    }
    if (costInput.trim() === '') {
      newErrors.cost = 'Service cost in UGX is required.';
    } else if (isNaN(parsedCost)) {
      newErrors.cost = 'Please enter a valid numeric cost amount.';
    } else if (parsedCost < 0) {
      newErrors.cost = 'Cost cannot be negative. Please enter a valid non-negative cost in UGX.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        motorcycleId,
        date,
        workPerformed: workPerformed.trim(),
        costUgx: Math.round(parsedCost),
        notes: notes.trim(),
      },
      serviceToEdit ? serviceToEdit.id : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden my-8">
        {/* Header - Solid emerald green */}
        <div className="bg-emerald-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-emerald-700 flex items-center justify-center text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {serviceToEdit ? 'Edit Service Record' : 'Record Service Visit'}
              </h2>
              <p className="text-xs text-emerald-100">
                Log maintenance work performed and expenditure in UGX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded hover:bg-emerald-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Motorcycle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Select Motorcycle <span className="text-red-600">*</span>
            </label>
            {motorcycles.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-800 text-xs">
                No registered motorcycles found. Please register a motorcycle first.
              </div>
            ) : (
              <select
                value={motorcycleId}
                onChange={(e) => {
                  setMotorcycleId(e.target.value);
                  if (errors.motorcycleId) setErrors({ ...errors, motorcycleId: '' });
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 ${
                  errors.motorcycleId
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-emerald-700 focus:ring-emerald-200'
                }`}
              >
                <option value="">-- Choose Motorcycle --</option>
                {motorcycles.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.regNumber} — {m.make} {m.model} {m.year ? `(${m.year})` : ''}
                  </option>
                ))}
              </select>
            )}
            {errors.motorcycleId && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.motorcycleId}</span>
              </p>
            )}
          </div>

          {/* Service Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Service Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors({ ...errors, date: '' });
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-slate-900 focus:outline-none focus:ring-2 ${
                errors.date
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-emerald-700 focus:ring-emerald-200'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.date}</span>
              </p>
            )}
          </div>

          {/* Work Performed */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Work Performed <span className="text-red-600">*</span>
              </label>
              <span className="text-xs text-slate-400">Quick select:</span>
            </div>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_SERVICES.slice(0, 5).map((serviceName) => (
                <button
                  key={serviceName}
                  type="button"
                  onClick={() => {
                    setWorkPerformed(serviceName);
                    if (errors.workPerformed) setErrors({ ...errors, workPerformed: '' });
                  }}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    workPerformed.toLowerCase() === serviceName.toLowerCase()
                      ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {serviceName}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="e.g. Oil change, Brake adjustment, Chain replacement"
              value={workPerformed}
              onChange={(e) => {
                setWorkPerformed(e.target.value);
                if (errors.workPerformed) setErrors({ ...errors, workPerformed: '' });
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.workPerformed
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-emerald-700 focus:ring-emerald-200'
              }`}
            />
            {errors.workPerformed && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.workPerformed}</span>
              </p>
            )}
          </div>

          {/* Cost in UGX */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Cost in Ugandan Shillings (UGX) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                UGX
              </div>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="e.g. 25000"
                value={costInput}
                onChange={(e) => {
                  setCostInput(e.target.value);
                  if (errors.cost) setErrors({ ...errors, cost: '' });
                }}
                className={`w-full pl-12 pr-4 py-2.5 bg-white border rounded-md text-slate-900 font-semibold text-base focus:outline-none focus:ring-2 ${
                  errors.cost
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-emerald-700 focus:ring-emerald-200'
                }`}
              />
            </div>
            {/* Live formatting preview */}
            {isValidNumber && parsedCost >= 0 && costInput !== '' && (
              <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <Coins className="w-3.5 h-3.5" />
                <span>Calculated amount: <strong>{formatUgx(parsedCost)}</strong></span>
              </div>
            )}
            {errors.cost && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.cost}</span>
              </p>
            )}
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Mechanic / Parts Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Parts brand used, garage name, next service recommendation"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-emerald-700 focus:ring-emerald-200 text-sm"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={motorcycles.length === 0}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-700 rounded-md hover:bg-emerald-800 disabled:bg-slate-300 transition-colors"
            >
              {serviceToEdit ? 'Save Changes' : 'Save Service Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
