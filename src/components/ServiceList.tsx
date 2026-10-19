import React, { useState, useMemo } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { formatUgx, formatDate } from '../storage';
import { 
  Wrench, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  Coins, 
  Filter, 
  Bike, 
  ChevronRight 
} from 'lucide-react';

interface ServiceListProps {
  motorcycles: Motorcycle[];
  services: ServiceRecord[];
  onSelectMotorcycle: (motorcycleId: string) => void;
  onOpenAddService: (motorcycleId?: string) => void;
  onEditService: (service: ServiceRecord) => void;
  onDeleteServicePrompt: (service: ServiceRecord) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  motorcycles,
  services,
  onSelectMotorcycle,
  onOpenAddService,
  onEditService,
  onDeleteServicePrompt,
}) => {
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'cost-desc' | 'cost-asc'>('date-desc');

  const motorcycleMap = useMemo(() => {
    const map = new Map<string, Motorcycle>();
    motorcycles.forEach((m) => map.set(m.id, m));
    return map;
  }, [motorcycles]);

  // Filtered & sorted services
  const processedServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesBike =
          selectedMotorcycleId === 'all' || s.motorcycleId === selectedMotorcycleId;
        const bike = motorcycleMap.get(s.motorcycleId);
        const bikeSearch = bike
          ? `${bike.regNumber} ${bike.make} ${bike.model}`.toLowerCase()
          : '';

        const matchesSearch =
          s.workPerformed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
          bikeSearch.includes(searchTerm.toLowerCase());

        return matchesBike && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'cost-desc') {
          return b.costUgx - a.costUgx;
        }
        if (sortBy === 'cost-asc') {
          return a.costUgx - b.costUgx;
        }
        return 0;
      });
  }, [services, selectedMotorcycleId, searchTerm, sortBy, motorcycleMap]);

  // Sum of filtered services
  const filteredTotalCost = processedServices.reduce((sum, s) => sum + s.costUgx, 0);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Service Records</h1>
            <p className="text-sm text-slate-600 mt-1">
              Full log of maintenance visits, servicing costs and mechanical work.
            </p>
          </div>

          <button
            onClick={() => onOpenAddService()}
            disabled={motorcycles.length === 0}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 rounded-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Service Visit</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search work, parts, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
            />
          </div>

          {/* Motorcycle Select */}
          <div>
            <select
              value={selectedMotorcycleId}
              onChange={(e) => setSelectedMotorcycleId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
            >
              <option value="all">All Motorcycles ({services.length} records)</option>
              {motorcycles.map((m) => {
                const count = services.filter((s) => s.motorcycleId === m.id).length;
                return (
                  <option key={m.id} value={m.id}>
                    {m.regNumber} — {m.make} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
            >
              <option value="date-desc">Date (Newest first)</option>
              <option value="date-asc">Date (Oldest first)</option>
              <option value="cost-desc">Cost (Highest first)</option>
              <option value="cost-asc">Cost (Lowest first)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <span>
            Showing <strong>{processedServices.length}</strong> of <strong>{services.length}</strong> service entries
          </span>
          <span className="bg-slate-100 px-3 py-1 rounded border border-slate-200 text-slate-900 font-semibold">
            Filtered Subtotal: <strong className="text-emerald-800">{formatUgx(filteredTotalCost)}</strong>
          </span>
        </div>
      </div>

      {/* Services List / Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {processedServices.length === 0 ? (
          <div className="p-10 text-center">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No service records found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedMotorcycleId !== 'all'
                ? 'Try clearing your search term or selecting a different motorcycle.'
                : 'Start logging motorcycle maintenance to track costs and repairs.'}
            </p>
            {motorcycles.length > 0 && (
              <button
                onClick={() => onOpenAddService()}
                className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Record Service</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {processedServices.map((service) => {
              const bike = motorcycleMap.get(service.motorcycleId);

              return (
                <div
                  key={service.id}
                  className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-base font-bold text-slate-900">
                          {service.workPerformed}
                        </span>

                        {bike && (
                          <button
                            onClick={() => onSelectMotorcycle(bike.id)}
                            className="text-xs px-2 py-0.5 rounded bg-yellow-100 border border-yellow-300 text-yellow-950 font-mono font-bold hover:bg-yellow-200 transition-colors"
                            title="View bike details"
                          >
                            {bike.regNumber}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center space-x-1 font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(service.date)}</span>
                        </span>
                        {bike && (
                          <span>
                            {bike.make} {bike.model}
                          </span>
                        )}
                      </div>

                      {service.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-200 max-w-xl">
                          <span className="font-semibold text-slate-700">Notes: </span>
                          {service.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-4 pl-12 md:pl-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cost (UGX)
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {formatUgx(service.costUgx)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEditService(service)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                        title="Edit entry"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteServicePrompt(service)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
