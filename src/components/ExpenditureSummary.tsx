import React, { useState, useMemo } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { formatUgx, formatDate } from '../storage';
import { 
  PieChart, 
  Coins, 
  Bike, 
  Download, 
  RotateCcw, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface ExpenditureSummaryProps {
  motorcycles: Motorcycle[];
  services: ServiceRecord[];
  onSelectMotorcycle: (motorcycleId: string) => void;
  onResetSeedData: () => void;
  onClearAllData: () => void;
}

export const ExpenditureSummary: React.FC<ExpenditureSummaryProps> = ({
  motorcycles,
  services,
  onSelectMotorcycle,
  onResetSeedData,
  onClearAllData,
}) => {
  const [selectedMotorcycleFilter, setSelectedMotorcycleFilter] = useState<string>('all');

  // Overall total
  const totalExpenditure = useMemo(() => {
    return services.reduce((sum, s) => sum + (s.costUgx || 0), 0);
  }, [services]);

  // Breakdown by motorcycle
  const motorcycleBreakdown = useMemo(() => {
    return motorcycles.map((bike) => {
      const bikeServices = services.filter((s) => s.motorcycleId === bike.id);
      const bikeTotal = bikeServices.reduce((sum, s) => sum + (s.costUgx || 0), 0);
      const percentage = totalExpenditure > 0 ? (bikeTotal / totalExpenditure) * 100 : 0;

      return {
        motorcycle: bike,
        serviceCount: bikeServices.length,
        totalCost: bikeTotal,
        percentage,
      };
    }).sort((a, b) => b.totalCost - a.totalCost);
  }, [motorcycles, services, totalExpenditure]);

  // Breakdown by work performed (grouped)
  const workTypeBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; totalCost: number }>();

    services.forEach((s) => {
      const key = s.workPerformed.trim() || 'Unspecified Work';
      const existing = map.get(key) || { count: 0, totalCost: 0 };
      map.set(key, {
        count: existing.count + 1,
        totalCost: existing.totalCost + (s.costUgx || 0),
      });
    });

    return Array.from(map.entries())
      .map(([work, data]) => ({
        work,
        count: data.count,
        totalCost: data.totalCost,
        percentage: totalExpenditure > 0 ? (data.totalCost / totalExpenditure) * 100 : 0,
      }))
      .sort((a, b) => b.totalCost - a.totalCost);
  }, [services, totalExpenditure]);

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Service ID', 'Date', 'Registration Number', 'Make', 'Model', 'Work Performed', 'Cost (UGX)', 'Notes'];
    const rows = services.map((s) => {
      const bike = motorcycles.find((m) => m.id === s.motorcycleId);
      return [
        s.id,
        s.date,
        bike ? `"${bike.regNumber}"` : '""',
        bike ? `"${bike.make}"` : '""',
        bike ? `"${bike.model}"` : '""',
        `"${s.workPerformed.replace(/"/g, '""')}"`,
        s.costUgx,
        `"${(s.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `motorcycle_service_expenditure_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered view if user chooses a specific motorcycle
  const filteredBike = selectedMotorcycleFilter !== 'all' 
    ? motorcycles.find(m => m.id === selectedMotorcycleFilter)
    : null;

  const filteredBikeServices = filteredBike 
    ? services.filter(s => s.motorcycleId === filteredBike.id)
    : [];

  const filteredBikeTotal = filteredBikeServices.reduce((sum, s) => sum + s.costUgx, 0);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Expenditure Summary</h1>
            <p className="text-sm text-slate-600 mt-1">
              Calculated expenditure from saved service entries across your fleet.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Overall Expenditure */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Servicing Expenditure
            </span>
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatUgx(totalExpenditure)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sum of all {services.length} recorded service entries
            </p>
          </div>
        </div>

        {/* Average Cost per Motorcycle */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average per Motorcycle
            </span>
            <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatUgx(motorcycles.length > 0 ? totalExpenditure / motorcycles.length : 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across {motorcycles.length} registered motorcycles
            </p>
          </div>
        </div>

        {/* Highest Single Category */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Maintenance Cost
            </span>
            <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900 truncate">
              {workTypeBreakdown.length > 0 ? workTypeBreakdown[0].work : 'None'}
            </div>
            <p className="text-xs text-emerald-800 font-bold mt-1">
              {workTypeBreakdown.length > 0 ? formatUgx(workTypeBreakdown[0].totalCost) : 'UGX 0'}
            </p>
          </div>
        </div>
      </div>

      {/* Individual Motorcycle Filter Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter Expenditure by Individual Motorcycle
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a bike to view its specific servicing total as required by specification.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <select
              value={selectedMotorcycleFilter}
              onChange={(e) => setSelectedMotorcycleFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800 font-medium"
            >
              <option value="all">-- All Motorcycles (Fleet View) --</option>
              {motorcycles.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.regNumber} — {m.make} {m.model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredBike && (
          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-yellow-100 border border-yellow-300 text-yellow-950 font-mono font-bold text-xs rounded">
                  {filteredBike.regNumber}
                </span>
                <span className="font-bold text-slate-900">
                  {filteredBike.make} {filteredBike.model}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {filteredBikeServices.length} service records recorded
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Motorcycle Specific Total
                </span>
                <span className="text-xl font-extrabold text-emerald-800">
                  {formatUgx(filteredBikeTotal)}
                </span>
              </div>

              <button
                onClick={() => onSelectMotorcycle(filteredBike.id)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center space-x-1"
              >
                <span>View History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown by Motorcycle Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bike className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Expenditure Breakdown by Motorcycle
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {motorcycles.length} vehicles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Registration / Plate</th>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4 text-center">Services</th>
                <th className="py-3 px-4">Share of Fleet</th>
                <th className="py-3 px-4 text-right">Total Expenditure</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {motorcycleBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No motorcycles registered.
                  </td>
                </tr>
              ) : (
                motorcycleBreakdown.map(({ motorcycle, serviceCount, totalCost, percentage }) => (
                  <tr key={motorcycle.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className="px-2 py-0.5 bg-yellow-100 border border-yellow-300 text-yellow-950 rounded text-xs">
                        {motorcycle.regNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {motorcycle.make} {motorcycle.model}
                      </div>
                      {motorcycle.year && (
                        <div className="text-xs text-slate-500">Year {motorcycle.year}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      {serviceCount}
                    </td>
                    <td className="py-3.5 px-4 w-44">
                      <div className="flex items-center space-x-2">
                        {/* Solid color progress bar - NO GRADIENTS */}
                        <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-700"
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-600 w-10 text-right">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                      {formatUgx(totalCost)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectMotorcycle(motorcycle.id)}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200 transition-colors inline-flex items-center space-x-0.5"
                      >
                        <span>History</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {motorcycleBreakdown.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td colSpan={2} className="py-3 px-4">
                    Total Fleet Servicing Expenditure
                  </td>
                  <td className="py-3 px-4 text-center">
                    {services.length}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    100.0%
                  </td>
                  <td className="py-3 px-4 text-right text-base text-emerald-900">
                    {formatUgx(totalExpenditure)}
                  </td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Breakdown by Work Type / Service Category */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Expenditure by Maintenance Category
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {workTypeBreakdown.length} categories
          </span>
        </div>

        <div className="p-5">
          {workTypeBreakdown.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-6">
              No service records to analyze.
            </p>
          ) : (
            <div className="space-y-4">
              {workTypeBreakdown.map((item) => (
                <div key={item.work} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-slate-900 flex items-center space-x-2">
                      <span>{item.work}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.count} {item.count === 1 ? 'time' : 'times'}
                      </span>
                    </span>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900">
                        {formatUgx(item.totalCost)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono ml-2">
                        ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Solid color bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800"
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Storage and Data Controls Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Data Management & Verification
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          All data is persistently stored on your device using local storage. You can restore the documented sample records or clear all records for testing.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={onResetSeedData}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Reset to Example Data (UGX 80,000)</span>
          </button>

          <button
            onClick={onClearAllData}
            className="px-3.5 py-2 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
