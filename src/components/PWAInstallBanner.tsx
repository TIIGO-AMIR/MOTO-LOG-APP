import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, Check } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('pwa_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('pwa_banner_dismissed', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  // If already running in standalone mode (already installed), hide completely
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Phone Install Banner - Plain solid colors, zero gradients */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">
                  Install Motorcycle Service Log on Your Phone
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                  PWA Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Add to your phone's home screen for one-tap instant launch, full-screen view, and offline maintenance logging.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
            {isInstallable && (
              <button
                onClick={install}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Install on Phone</span>
              </button>
            )}

            {isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center space-x-1.5"
              >
                <Share className="w-4 h-4 text-emerald-400" />
                <span>Install on iPhone</span>
              </button>
            )}

            {!isInstallable && !isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
              title="Dismiss banner"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guide Modal for iPhone & Manual Browser Install */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden">
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Install to Home Screen</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-slate-800 text-sm">
              <p className="text-xs text-slate-600">
                Install this app directly onto your phone without using the App Store or Play Store:
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Open in Safari or Chrome</span>
                    <span className="text-xs text-slate-600">
                      Tap the <strong>Share</strong> button (on iPhone/Safari) or the <strong>three dots menu ⋮</strong> (on Android/Chrome).
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Select "Add to Home Screen"</span>
                    <span className="text-xs text-slate-600">
                      Scroll down and tap <strong>Add to Home Screen</strong> or <strong>Install App</strong>.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Open from Home Screen</span>
                    <span className="text-xs text-slate-600">
                      The Motorcycle Service Log app icon will now appear on your phone screen with full offline access!
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full mt-2 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
