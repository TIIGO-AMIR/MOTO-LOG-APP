import React, { useState, useEffect } from 'react';
import { Motorcycle } from '../types';
import { X, Bike, AlertCircle } from 'lucide-react';

interface MotorcycleModalProps {
  isOpen: boolean;
  motorcycleToEdit?: Motorcycle | null;
  onClose: () => void;
  onSave: (motorcycle: Omit<Motorcycle, 'id' | 'createdAt'>, id?: string) => void;
}

const POPULAR_MAKES = ['Bajaj', 'TVS', 'Yamaha', 'Honda', 'Suzuki', 'Haojue', 'Hero'];

export const MotorcycleModal: React.FC<MotorcycleModalProps> = ({
  isOpen,
  motorcycleToEdit,
  onClose,
  onSave,
}) => {
  const [regNumber, setRegNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (motorcycleToEdit) {
      setRegNumber(motorcycleToEdit.regNumber);
      setMake(motorcycleToEdit.make);
      setModel(motorcycleToEdit.model);
      setYear(motorcycleToEdit.year ? motorcycleToEdit.year.toString() : '');
      setNotes(motorcycleToEdit.notes || '');
    } else {
      setRegNumber('');
      setMake('');
      setModel('');
      setYear('');
      setNotes('');
    }
    setErrors({});
  }, [motorcycleToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!regNumber.trim()) {
      newErrors.regNumber = 'Registration / plate number is required (e.g. UBD 452K).';
    }
    if (!make.trim()) {
      newErrors.make = 'Make is required (e.g. Bajaj, TVS, Yamaha).';
    }
    if (!model.trim()) {
      newErrors.model = 'Model is required (e.g. Boxer 100, Star HLX 125).';
    }
    if (year.trim()) {
      const yearNum = parseInt(year, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1970 || yearNum > currentYear + 1) {
        newErrors.year = `Year must be a valid number between 1970 and ${currentYear + 1}.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        regNumber: regNumber.trim().toUpperCase(),
        make: make.trim(),
        model: model.trim(),
        year: year.trim() ? parseInt(year, 10) : null,
        notes: notes.trim(),
      },
      motorcycleToEdit ? motorcycleToEdit.id : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden my-8">
        {/* Header - Plain solid slate */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-100">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {motorcycleToEdit ? 'Edit Motorcycle' : 'Register New Motorcycle'}
              </h2>
              <p className="text-xs text-slate-400">
                {motorcycleToEdit
                  ? `Update details for ${motorcycleToEdit.regNumber}`
                  : 'Enter registration and vehicle specifications'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Registration Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Registration Number (Plate) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. UBD 452K"
              value={regNumber}
              onChange={(e) => {
                setRegNumber(e.target.value);
                if (errors.regNumber) setErrors({ ...errors, regNumber: '' });
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-md font-mono text-base tracking-wider uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.regNumber
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-slate-800 focus:ring-slate-200'
              }`}
            />
            {errors.regNumber && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.regNumber}</span>
              </p>
            )}
          </div>

          {/* Make */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Make (Manufacturer) <span className="text-red-600">*</span>
              </label>
              <span className="text-xs text-slate-400">Popular:</span>
            </div>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_MAKES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMake(m);
                    if (errors.make) setErrors({ ...errors, make: '' });
                  }}
                  className={`text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                    make.toLowerCase() === m.toLowerCase()
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="e.g. Bajaj, TVS, Yamaha, Honda"
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                if (errors.make) setErrors({ ...errors, make: '' });
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.make
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-slate-800 focus:ring-slate-200'
              }`}
            />
            {errors.make && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.make}</span>
              </p>
            )}
          </div>

          {/* Model and Year side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Model <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Boxer BM 100, HLX 125"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  if (errors.model) setErrors({ ...errors, model: '' });
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.model
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-slate-800 focus:ring-slate-200'
                }`}
              />
              {errors.model && (
                <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.model}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Year of Manufacture <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 2022"
                min="1970"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  if (errors.year) setErrors({ ...errors, year: '' });
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.year
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-slate-800 focus:ring-slate-200'
                }`}
              />
              {errors.year && (
                <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.year}</span>
                </p>
              )}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Owner / Fleet Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Rider name, base stage location, special equipment"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-slate-800 focus:ring-slate-200 text-sm"
            />
          </div>

          {/* Footer buttons - Solid plain color buttons */}
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
              className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              {motorcycleToEdit ? 'Save Changes' : 'Register Motorcycle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
