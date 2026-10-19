import React, { useState, useMemo } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { formatUgx, formatDate } from '../storage';
import { 
  Bike, 
  Plus, 
  Search, 
  Wrench, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Calendar,
  Coins,
  FileText
} from 'lucide-react';

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
  services: ServiceRecord[];
  onSelectMotorcycle: (motorcycleId: string) => void;
  onOpenAddMotorcycle: () => void;
  onOpenEditMotorcycle: (motorcycle: Motorcycle) => void;
  onDeleteMotorcyclePrompt: (motorcycle: Motorcycle) => void;
  onOpenAddService: (motorcycleId: string) => void;
}

export const MotorcycleList: React.FC<MotorcycleListProps> = ({
  motorcycles,
  services,
  onSelectMotorcycle,
  onOpenAddMotorcycle,
  onOpenEditMotorcycle,
  onDeleteMotorcyclePrompt,
  onOpenAddService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'reg' | 'recent' | 'cost' | 'services'>('recent');

  // Available unique makes for filter
  const uniqueMakes = useMemo(() => {
    const set = new Set(motorcycles.map((m) => m.make));
    return Array.from(set).sort();
  }, [motorcycles]);

  // Filtered and sorted motorcycles
  const processedMotorcycles = useMemo(() => {
    return motorcycles
      .filter((bike) => {
        const matchesSearch =
          bike.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (bike.notes && bike.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesMake = selectedMake === 'all' || bike.make.toLowerCase() === selectedMake.toLowerCase();

        return matchesSearch && matchesMake;
      })
      .sort((a, b) => {
        if (sortBy === 'reg') {
          return a.regNumber.localeCompare(b.regNumber);
        }
        if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'cost') {
          const costA = services
            .filter((s) => s.motorcycleId === a.id)
            .reduce((sum, s) => sum + s.costUgx, 0);
          const costB = services
            .filter((s) => s.motorcycleId === b.id)
            .reduce((sum, s) => sum + s.costUgx, 0);
          return costB - costA;
        }
        if (sortBy === 'services') {
          const countA = services.filter((s) => s.motorcycleId === a.id).length;
          const countB = services.filter((s) => s.motorcycleId === b.id).length;
          return countB - countA;
        }
        return 0;
      });
  }, [motorcycles, services, searchTerm, selectedMake, sortBy]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Motorcycles</h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage registered motorcycles, inspect service histories and record maintenance.
            </p>
          </div>

          <button
            onClick={onOpenAddMotorcycle}
            className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register Motorcycle</span>
          </button>
        </div>

        {/* Filter and Search Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search plate, make, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
            />
          </div>

          {/* Make Filter */}
          <div>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
            >
              <option value="all">All Makes ({motorcycles.length})</option>
              {uniqueMakes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
            >
              <option value="recent">Sort by: Recently Added</option>
              <option value="reg">Sort by: Registration Plate (A-Z)</option>
              <option value="cost">Sort by: Highest Expenditure</option>
              <option value="services">Sort by: Most Services</option>
            </select>
          </div>
        </div>
      </div>

      {/* Motorcycle Cards Grid */}
      {processedMotorcycles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <Bike className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || selectedMake !== 'all' ? 'No matching motorcycles' : 'No motorcycles registered yet'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedMake !== 'all'
              ? 'Try adjusting your search terms or filters.'
              : 'Register your first motorcycle with its plate number, make, and model to begin recording services.'}
          </p>
          <button
            onClick={onOpenAddMotorcycle}
            className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Motorcycle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedMotorcycles.map((bike) => {
            const bikeServices = services.filter((s) => s.motorcycleId === bike.id);
            const totalCost = bikeServices.reduce((sum, s) => sum + s.costUgx, 0);

            // Latest service
            const sorted = [...bikeServices].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            const latestService = sorted[0];

            return (
              <div
                key={bike.id}
                className="bg-white border border-slate-200 rounded-lg shadow-xs hover:border-slate-400 transition-colors flex flex-col justify-between overflow-hidden"
              >
                {/* Top Card Section */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Ugandan Style License Plate Badge */}
                      <div className="inline-block px-3 py-1 bg-yellow-100 border-2 border-yellow-400 text-yellow-950 font-mono font-black text-sm tracking-widest rounded uppercase">
                        {bike.regNumber}
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 mt-2">
                        {bike.make} {bike.model}
                      </h2>
                    </div>

                    {bike.year && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200">
                        Year {bike.year}
                      </span>
                    )}
                  </div>

                  {bike.notes && (
                    <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 flex items-start space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{bike.notes}</span>
                    </div>
                  )}

                  {/* Expenditure & Service Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Total Expenditure
                      </span>
                      <span className="text-base font-extrabold text-emerald-800 block mt-0.5">
                        {formatUgx(totalCost)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Service Visits
                      </span>
                      <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                        {bikeServices.length}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          {bikeServices.length === 1 ? 'record' : 'records'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {latestService && (
                    <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Last serviced: {formatDate(latestService.date)}</span>
                      </span>
                      <span className="font-medium text-slate-700">
                        {latestService.workPerformed}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onOpenEditMotorcycle(bike)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors text-xs font-medium flex items-center space-x-1"
                      title="Edit motorcycle details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteMotorcyclePrompt(bike)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors text-xs font-medium flex items-center space-x-1"
                      title="Delete motorcycle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenAddService(bike.id)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors flex items-center space-x-1"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>+ Service</span>
                    </button>

                    <button
                      onClick={() => onSelectMotorcycle(bike.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center space-x-1"
                    >
                      <span>History</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
