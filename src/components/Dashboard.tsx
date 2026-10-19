import React from 'react';
import { Motorcycle, ServiceRecord, ActiveScreen } from '../types';
import { formatUgx, formatDate } from '../storage';
import { 
  Bike, 
  Wrench, 
  Coins, 
  ArrowRight, 
  Plus, 
  Calendar, 
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface DashboardProps {
  motorcycles: Motorcycle[];
  services: ServiceRecord[];
  onNavigate: (screen: ActiveScreen) => void;
  onSelectMotorcycle: (motorcycleId: string) => void;
  onOpenAddMotorcycle: () => void;
  onOpenAddService: (motorcycleId?: string) => void;
  onEditService: (service: ServiceRecord) => void;
  onDeleteServicePrompt: (service: ServiceRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  motorcycles,
  services,
  onNavigate,
  onSelectMotorcycle,
  onOpenAddMotorcycle,
  onOpenAddService,
}) => {
  // Calculations
  const totalExpenditure = services.reduce((sum, s) => sum + (s.costUgx || 0), 0);
  const totalServices = services.length;
  const totalMotorcycles = motorcycles.length;
  const averageServiceCost = totalServices > 0 ? Math.round(totalExpenditure / totalServices) : 0;

  // Sorted recent services (newest date first)
  const sortedServices = [...services].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recentServices = sortedServices.slice(0, 5);

  const getMotorcycle = (id: string) => motorcycles.find((m) => m.id === id);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Page Title & Quick Action bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time maintenance records and servicing expenditure summary.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAddMotorcycle}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-slate-700" />
              <span>Register Motorcycle</span>
            </button>
            <button
              onClick={() => onOpenAddService()}
              disabled={motorcycles.length === 0}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 rounded-md transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Record Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards - Solid plain colors, high contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Expenditure */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Expenditure
            </span>
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatUgx(totalExpenditure)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sum of all recorded service costs
            </p>
          </div>
        </div>

        {/* Card 2: Registered Motorcycles */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Motorcycles
            </span>
            <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {totalMotorcycles}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active vehicles in your registry
            </p>
          </div>
        </div>

        {/* Card 3: Total Service Visits */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Services Logged
            </span>
            <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {totalServices}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Maintenance visits recorded
            </p>
          </div>
        </div>

        {/* Card 4: Average Cost */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Service Cost
            </span>
            <div className="w-8 h-8 rounded bg-purple-100 text-purple-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatUgx(averageServiceCost)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Average per maintenance visit
            </p>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Services & Registered Motorcycles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide): Recent Service Records */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Recent Service Records</h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
            >
              <span>View all ({totalServices})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentServices.length === 0 ? (
              <div className="p-8 text-center">
                <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No service records saved yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Record your first motorcycle maintenance visit to see it here.
                </p>
                {motorcycles.length > 0 && (
                  <button
                    onClick={() => onOpenAddService()}
                    className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded"
                  >
                    + Record Service Visit
                  </button>
                )}
              </div>
            ) : (
              recentServices.map((service) => {
                const bike = getMotorcycle(service.motorcycleId);
                return (
                  <div
                    key={service.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-bold text-slate-900 text-sm">
                            {service.workPerformed}
                          </span>
                          {bike && (
                            <button
                              onClick={() => onSelectMotorcycle(bike.id)}
                              className="text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800 hover:bg-slate-200"
                              title="Click to view bike history"
                            >
                              {bike.regNumber}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center space-x-1">
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
                          <p className="text-xs text-slate-600 mt-1 italic">
                            "{service.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 pl-12 sm:pl-0">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-900">
                          {formatUgx(service.costUgx)}
                        </div>
                      </div>
                      {bike && (
                        <button
                          onClick={() => onSelectMotorcycle(bike.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
                          title="Open bike details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1 col wide): Registered Motorcycles Overview */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <Bike className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Registered Fleet</h2>
            </div>
            <button
              onClick={() => onNavigate('motorcycles')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
            >
              <span>Manage ({totalMotorcycles})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 space-y-3">
            {motorcycles.length === 0 ? (
              <div className="p-6 text-center">
                <Bike className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No motorcycles registered.</p>
                <button
                  onClick={onOpenAddMotorcycle}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
                >
                  + Add First Motorcycle
                </button>
              </div>
            ) : (
              motorcycles.map((bike) => {
                const bikeServices = services.filter((s) => s.motorcycleId === bike.id);
                const bikeTotalCost = bikeServices.reduce((sum, s) => sum + s.costUgx, 0);

                return (
                  <div
                    key={bike.id}
                    onClick={() => onSelectMotorcycle(bike.id)}
                    className="p-3 border border-slate-200 rounded-md hover:border-slate-400 cursor-pointer transition-colors bg-white hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-yellow-100 border border-yellow-300 text-yellow-900 font-mono font-bold text-xs rounded">
                          {bike.regNumber}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {bike.make} {bike.model}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {bike.year || ''}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {bikeServices.length} {bikeServices.length === 1 ? 'service' : 'services'}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatUgx(bikeTotalCost)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {motorcycles.length > 0 && (
              <button
                onClick={onOpenAddMotorcycle}
                className="w-full mt-2 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Another Motorcycle</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('motorcycles')}
          className="p-4 bg-white border border-slate-200 hover:border-slate-400 rounded-lg text-left transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-slate-700">
              Motorcycles Directory
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              View plates, models, specs, and edit details
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('services')}
          className="p-4 bg-white border border-slate-200 hover:border-slate-400 rounded-lg text-left transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-slate-700">
              Complete Service History
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review full chronological maintenance log
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('expenditure')}
          className="p-4 bg-white border border-slate-200 hover:border-slate-400 rounded-lg text-left transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-slate-700">
              Expenditure Summary
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Total expenditure calculations and bike breakdown
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>
      </div>
    </div>
  );
};
