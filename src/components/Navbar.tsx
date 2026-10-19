import React from 'react';
import { ActiveScreen } from '../types';
import { Bike, LayoutDashboard, Wrench, PieChart, Plus } from 'lucide-react';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  motorcycleCount: number;
  serviceCount: number;
  onOpenAddMotorcycle: () => void;
  onOpenAddService: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  motorcycleCount,
  serviceCount,
  onOpenAddMotorcycle,
  onOpenAddService,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      {/* Top Main Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded bg-emerald-600 flex items-center justify-center text-white">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center space-x-2">
                <span>Motorcycle Service Log</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Vehicle maintenance & expenditure tracking (UGX)
              </p>
            </div>
          </div>

          {/* Action Buttons (Desktop & Tablet) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenAddMotorcycle}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Motorcycle</span>
            </button>
            <button
              onClick={onOpenAddService}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Record Service</span>
            </button>
          </div>
        </div>

        {/* Desktop Screen Nav Tabs */}
        <div className="hidden md:flex space-x-1 border-t border-slate-800 pt-1 pb-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors flex items-center space-x-2 border-b-2 ${
              activeScreen === 'dashboard'
                ? 'border-emerald-500 text-white bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('motorcycles')}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors flex items-center space-x-2 border-b-2 ${
              activeScreen === 'motorcycles'
                ? 'border-emerald-500 text-white bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Motorcycles</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
              {motorcycleCount}
            </span>
          </button>

          <button
            onClick={() => onNavigate('services')}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors flex items-center space-x-2 border-b-2 ${
              activeScreen === 'services'
                ? 'border-emerald-500 text-white bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Service Records</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
              {serviceCount}
            </span>
          </button>

          <button
            onClick={() => onNavigate('expenditure')}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors flex items-center space-x-2 border-b-2 ${
              activeScreen === 'expenditure'
                ? 'border-emerald-500 text-white bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Expenditure Summary</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for authentic mobile feel */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40 py-1.5 px-2 flex justify-around items-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center py-1 px-3 rounded text-xs font-medium transition-colors ${
            activeScreen === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('motorcycles')}
          className={`flex flex-col items-center py-1 px-3 rounded text-xs font-medium transition-colors ${
            activeScreen === 'motorcycles' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <Bike className="w-5 h-5 mb-0.5" />
            {motorcycleCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[10px] bg-slate-700 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {motorcycleCount}
              </span>
            )}
          </div>
          <span>Bikes</span>
        </button>

        <button
          onClick={() => onNavigate('services')}
          className={`flex flex-col items-center py-1 px-3 rounded text-xs font-medium transition-colors ${
            activeScreen === 'services' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <Wrench className="w-5 h-5 mb-0.5" />
            {serviceCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[10px] bg-slate-700 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {serviceCount}
              </span>
            )}
          </div>
          <span>Services</span>
        </button>

        <button
          onClick={() => onNavigate('expenditure')}
          className={`flex flex-col items-center py-1 px-3 rounded text-xs font-medium transition-colors ${
            activeScreen === 'expenditure' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <PieChart className="w-5 h-5 mb-0.5" />
          <span>Expenditure</span>
        </button>
      </div>
    </header>
  );
};
