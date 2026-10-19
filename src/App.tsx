/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Motorcycle, ServiceRecord, ActiveScreen } from './types';
import {
  loadMotorcycles,
  saveMotorcycles,
  loadServices,
  saveServices,
  resetToSeedData,
  clearAllData,
} from './storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MotorcycleList } from './components/MotorcycleList';
import { MotorcycleDetail } from './components/MotorcycleDetail';
import { ServiceList } from './components/ServiceList';
import { ExpenditureSummary } from './components/ExpenditureSummary';
import { MotorcycleModal } from './components/MotorcycleModal';
import { ServiceModal } from './components/ServiceModal';
import { ConfirmModal } from './components/ConfirmModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  // Main Data States
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(() => loadMotorcycles());
  const [services, setServices] = useState<ServiceRecord[]>(() => loadServices());

  // Screen & Navigation
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<string | null>(null);

  // Modals
  const [isMotorcycleModalOpen, setIsMotorcycleModalOpen] = useState(false);
  const [motorcycleToEdit, setMotorcycleToEdit] = useState<Motorcycle | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [preselectedMotorcycleId, setPreselectedMotorcycleId] = useState<string | undefined>(undefined);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceRecord | null>(null);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    saveMotorcycles(motorcycles);
  }, [motorcycles]);

  useEffect(() => {
    saveServices(services);
  }, [services]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Handlers for Motorcycle
  const handleOpenAddMotorcycle = () => {
    setMotorcycleToEdit(null);
    setIsMotorcycleModalOpen(true);
  };

  const handleOpenEditMotorcycle = (motorcycle: Motorcycle) => {
    setMotorcycleToEdit(motorcycle);
    setIsMotorcycleModalOpen(true);
  };

  const handleSaveMotorcycle = (
    data: Omit<Motorcycle, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id) {
      // Edit
      setMotorcycles((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...data } : m))
      );
      showToast(`Motorcycle ${data.regNumber} updated successfully.`);
    } else {
      // Add
      const newBike: Motorcycle = {
        ...data,
        id: `bike-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setMotorcycles((prev) => [newBike, ...prev]);
      showToast(`Motorcycle ${data.regNumber} registered successfully.`);
    }
    setIsMotorcycleModalOpen(false);
  };

  const handleDeleteMotorcyclePrompt = (motorcycle: Motorcycle) => {
    const linkedServicesCount = services.filter((s) => s.motorcycleId === motorcycle.id).length;
    const warningMessage = linkedServicesCount > 0
      ? `Are you sure you want to delete motorcycle ${motorcycle.regNumber} (${motorcycle.make} ${motorcycle.model})?\n\nWarning: This will also permanently delete its ${linkedServicesCount} recorded service visits and recalculate all expenditure totals.`
      : `Are you sure you want to delete motorcycle ${motorcycle.regNumber} (${motorcycle.make} ${motorcycle.model})?`;

    setConfirmModal({
      isOpen: true,
      title: `Delete Motorcycle ${motorcycle.regNumber}`,
      message: warningMessage,
      confirmLabel: 'Delete Motorcycle',
      onConfirm: () => {
        setMotorcycles((prev) => prev.filter((m) => m.id !== motorcycle.id));
        setServices((prev) => prev.filter((s) => s.motorcycleId !== motorcycle.id));
        if (selectedMotorcycleId === motorcycle.id) {
          setSelectedMotorcycleId(null);
        }
        setConfirmModal(null);
        showToast(`Motorcycle ${motorcycle.regNumber} and linked records deleted.`);
      },
    });
  };

  // Handlers for Service
  const handleOpenAddService = (motorcycleId?: string) => {
    if (motorcycles.length === 0) {
      showToast('Please register at least one motorcycle first.', 'info');
      setIsMotorcycleModalOpen(true);
      return;
    }
    setServiceToEdit(null);
    setPreselectedMotorcycleId(motorcycleId);
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceRecord) => {
    setServiceToEdit(service);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (
    data: Omit<ServiceRecord, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id) {
      // Edit
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
      showToast('Service record updated successfully.');
    } else {
      // Add
      const newService: ServiceRecord = {
        ...data,
        id: `srv-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setServices((prev) => [newService, ...prev]);
      showToast('Service visit recorded successfully.');
    }
    setIsServiceModalOpen(false);
  };

  const handleDeleteServicePrompt = (service: ServiceRecord) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Service Entry',
      message: `Are you sure you want to delete this service record: "${service.workPerformed}" (${service.costUgx.toLocaleString()} UGX)?\n\nThis will permanently remove the record and update your total expenditure.`,
      confirmLabel: 'Delete Entry',
      onConfirm: () => {
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        setConfirmModal(null);
        showToast('Service record deleted.');
      },
    });
  };

  // Navigation handlers
  const handleNavigate = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    setSelectedMotorcycleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMotorcycle = (motorcycleId: string) => {
    setSelectedMotorcycleId(motorcycleId);
    setActiveScreen('motorcycles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to seed data
  const handleResetSeedData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Sample Data',
      message: 'This will reset your motorcycles and services to the default example data from the application documentation (including the 80,000 UGX example). Any custom records will be replaced.',
      confirmLabel: 'Reset Data',
      onConfirm: () => {
        const { motorcycles: seedBikes, services: seedSrvs } = resetToSeedData();
        setMotorcycles(seedBikes);
        setServices(seedSrvs);
        setSelectedMotorcycleId(null);
        setConfirmModal(null);
        showToast('Reset to documentation sample data.');
      },
    });
  };

  // Clear all data
  const handleClearAllData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Records',
      message: 'Are you sure you want to clear all motorcycles and service records from this device? This action cannot be undone.',
      confirmLabel: 'Clear All',
      onConfirm: () => {
        const { motorcycles: emptyBikes, services: emptySrvs } = clearAllData();
        setMotorcycles(emptyBikes);
        setServices(emptySrvs);
        setSelectedMotorcycleId(null);
        setConfirmModal(null);
        showToast('All data cleared.', 'info');
      },
    });
  };

  const activeMotorcycle = selectedMotorcycleId
    ? motorcycles.find((m) => m.id === selectedMotorcycleId)
    : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        motorcycleCount={motorcycles.length}
        serviceCount={services.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <PWAInstallBanner />

        {activeScreen === 'dashboard' && (
          <Dashboard
            motorcycles={motorcycles}
            services={services}
            onNavigate={handleNavigate}
            onSelectMotorcycle={handleSelectMotorcycle}
            onOpenAddMotorcycle={handleOpenAddMotorcycle}
            onOpenAddService={handleOpenAddService}
            onEditService={handleOpenEditService}
            onDeleteServicePrompt={handleDeleteServicePrompt}
          />
        )}

        {activeScreen === 'motorcycles' && (
          <>
            {activeMotorcycle ? (
              <MotorcycleDetail
                motorcycle={activeMotorcycle}
                services={services}
                onBack={() => setSelectedMotorcycleId(null)}
                onOpenEditMotorcycle={handleOpenEditMotorcycle}
                onDeleteMotorcyclePrompt={handleDeleteMotorcyclePrompt}
                onOpenAddService={handleOpenAddService}
                onEditService={handleOpenEditService}
                onDeleteServicePrompt={handleDeleteServicePrompt}
              />
            ) : (
              <MotorcycleList
                motorcycles={motorcycles}
                services={services}
                onSelectMotorcycle={handleSelectMotorcycle}
                onOpenAddMotorcycle={handleOpenAddMotorcycle}
                onOpenEditMotorcycle={handleOpenEditMotorcycle}
                onDeleteMotorcyclePrompt={handleDeleteMotorcyclePrompt}
                onOpenAddService={handleOpenAddService}
              />
            )}
          </>
        )}

        {activeScreen === 'services' && (
          <ServiceList
            motorcycles={motorcycles}
            services={services}
            onSelectMotorcycle={handleSelectMotorcycle}
            onOpenAddService={handleOpenAddService}
            onEditService={handleOpenEditService}
            onDeleteServicePrompt={handleDeleteServicePrompt}
          />
        )}

        {activeScreen === 'expenditure' && (
          <ExpenditureSummary
            motorcycles={motorcycles}
            services={services}
            onSelectMotorcycle={handleSelectMotorcycle}
            onResetSeedData={handleResetSeedData}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Modals */}
      <MotorcycleModal
        isOpen={isMotorcycleModalOpen}
        motorcycleToEdit={motorcycleToEdit}
        onClose={() => setIsMotorcycleModalOpen(false)}
        onSave={handleSaveMotorcycle}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        motorcycles={motorcycles}
        preselectedMotorcycleId={preselectedMotorcycleId}
        serviceToEdit={serviceToEdit}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleSaveService}
      />

      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-16 md:bottom-6 right-4 z-50 max-w-sm w-full bg-slate-900 border border-slate-800 text-white p-3.5 rounded-lg shadow-xl flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-2.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
