import React, { useState, useMemo } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { formatUgx, formatDate } from '../storage';
import { 
  ArrowLeft, 
  Bike, 
  Wrench, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Search, 
  ArrowUpDown, 
  Coins,
  FileText,
  AlertCircle
} from 'lucide-react';

interface MotorcycleDetailProps {
  motorcycle: Motorcycle;
  services: ServiceRecord[];
  onBack: () => void;
  onOpenEditMotorcycle: (motorcycle: Motorcycle) => void;
  onDeleteMotorcyclePrompt: (motorcycle: Motorcycle) => void;
  onOpenAddService: (motorcycleId: string) => void;
  onEditService: (service: ServiceRecord) => void;
  onDeleteServicePrompt: (service: ServiceRecord) => void;
}

export const MotorcycleDetail: React.FC<MotorcycleDetailProps> = ({
  motorcycle,
  services,
  onBack,
  onOpenEditMotorcycle,
  onDeleteMotorcyclePrompt,
  onOpenAddService,
  onEditService,
  onDeleteServicePrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter services for this motorcycle only
  const bikeServices = useMemo(() => {
    return services.filter((s) => s.motorcycleId === motorcycle.id);
  }, [services, motorcycle.id]);

  // Total expenditure for this motorcycle
  const totalCost = useMemo(() => {
    return bikeServices.reduce((sum, s) => sum + (s.costUgx || 0), 0);
  }, [bikeServices]);

  // Filter and sort services
  const processedServices = useMemo(() => {
    return bikeServices
      .filter((s) => {
        const matchesWork = s.workPerformed.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNotes = s.notes ? s.notes.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const matchesDate = s.date.includes(searchTerm);
        return matchesWork || matchesNotes || matchesDate;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [bikeServices, searchTerm, sortOrder]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Back button & Action Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Motorcycles</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenEditMotorcycle(motorcycle)}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Motorcycle</span>
          </button>
          <button
            onClick={() => onDeleteMotorcyclePrompt(motorcycle)}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Motorcycle Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-400 text-yellow-950 font-mono font-black text-base tracking-wider rounded uppercase">
                  {motorcycle.regNumber}
                </span>
                {motorcycle.year && (
                  <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded">
                    Model Year {motorcycle.year}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                {motorcycle.make} {motorcycle.model}
              </h1>
              {motorcycle.notes && (
                <p className="text-sm text-slate-600 mt-1 max-w-xl">
                  {motorcycle.notes}
                </p>
              )}
            </div>
          </div>

          {/* Expenditure Stat Highlight */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-w-[170px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Servicing Cost
              </span>
              <span className="text-xl font-extrabold text-emerald-800 block mt-1">
                {formatUgx(totalCost)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Calculated for this bike
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-w-[120px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Service Logs
              </span>
              <span className="text-xl font-extrabold text-slate-900 block mt-1">
                {bikeServices.length}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Total visits
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service History Header & Search/Filter */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-slate-700" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Service History ({bikeServices.length})
              </h2>
              <p className="text-xs text-slate-500">
                Chronological record of maintenance, repairs, and expenditures
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAddService(motorcycle.id)}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Service Visit</span>
          </button>
        </div>

        {/* Filter and sorting controls */}
        {bikeServices.length > 0 && (
          <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter work or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
              />
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded flex items-center justify-center space-x-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        )}

        {/* List of Service Records */}
        <div className="divide-y divide-slate-100">
          {processedServices.length === 0 ? (
            <div className="p-10 text-center">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                {bikeServices.length === 0
                  ? 'No service records linked to this motorcycle yet'
                  : 'No records match your search filter'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {bikeServices.length === 0
                  ? 'Log your first maintenance visit, parts replacement or tune-up for this bike.'
                  : 'Clear the search filter to display all recorded service entries.'}
              </p>
              {bikeServices.length === 0 && (
                <button
                  onClick={() => onOpenAddService(motorcycle.id)}
                  className="mt-4 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record First Service</span>
                </button>
              )}
            </div>
          ) : (
            processedServices.map((service, index) => (
              <div
                key={service.id}
                className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="text-base font-bold text-slate-900">
                        {service.workPerformed}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center space-x-1 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(service.date)}</span>
                      </span>
                    </div>

                    {service.notes && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 border border-slate-200 p-2 rounded">
                        <span className="font-semibold text-slate-700">Notes: </span>
                        {service.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-4 pl-11 md:pl-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cost (UGX)
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatUgx(service.costUgx)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditService(service)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                      title="Edit service entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteServicePrompt(service)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete service entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
