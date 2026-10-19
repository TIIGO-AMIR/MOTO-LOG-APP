import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Download, 
  Smartphone, 
  Share, 
  X, 
  QrCode, 
  ExternalLink,
  Check,
  ArrowDown
} from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isMobile, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already installed as a standalone PWA on phone, don't show install banners
  if (isInstalled) {
    return null;
  }

  const liveUrl = 'https://tiigo-amir.github.io/MOTO-LOG-APP/';
  // Public QR code URL for easy camera scanning
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(liveUrl)}&color=0f172a`;

  return (
    <>
      {/* Primary Install Banner */}
      {!isDismissed && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-lg p-4 sm:p-5 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <h2 className="text-base font-bold text-white">
                    Direct Phone Installation
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                    Installable App
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                  {isMobile ? (
                    <span>
                      Install <strong>Motorcycle Service Log</strong> directly onto your phone screen for instant one-tap launch, full-screen display, and offline support.
                    </span>
                  ) : (
                    <span>
                      Viewing on a computer? Open this link on your phone or scan the QR code to install the app directly on your phone with one tap.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 self-start md:self-center shrink-0 flex-wrap">
              {/* If browser supports native beforeinstallprompt (Android Chrome / Edge / etc.) */}
              {isInstallable && (
                <button
                  onClick={install}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors flex items-center space-x-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Install on Phone</span>
                </button>
              )}

              {/* iOS Safari */}
              {isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="px-4 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Share className="w-4 h-4 text-emerald-400" />
                  <span>Install on iPhone</span>
                </button>
              )}

              {/* Generic Mobile or Desktop fallback button */}
              {!isInstallable && !isIOS && isMobile && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Add to Phone Screen</span>
                </button>
              )}

              {/* QR Code button for Desktop visitors */}
              {!isMobile && (
                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center space-x-1.5"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Scan with Phone</span>
                </button>
              )}

              <button
                onClick={() => setIsDismissed(true)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
                title="Dismiss"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating 1-Tap Mobile Button (Visible on phones at bottom if dismissed or scrolling) */}
      {isMobile && isDismissed && (
        <div className="fixed bottom-16 left-4 right-4 z-40 md:hidden">
          <button
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                setShowIOSModal(true);
              }
            }}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 border border-emerald-600"
          >
            <Download className="w-4 h-4" />
            <span>Install App on Phone</span>
          </button>
        </div>
      )}

      {/* iPhone / Android Step-by-Step Installation Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm bg-white border border-slate-300 rounded-lg shadow-2xl overflow-hidden">
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
                You can install this app directly on your phone from your browser in 2 simple taps:
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {isIOS ? 'Tap the Share Button' : 'Tap the Browser Menu'}
                    </span>
                    <span className="text-xs text-slate-600">
                      {isIOS
                        ? 'Tap the Share icon (square with arrow ↑) in the Safari bottom bar.'
                        : 'Tap the three dots menu (⋮) in the top-right corner of Chrome.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Select "Add to Home Screen"
                    </span>
                    <span className="text-xs text-slate-600">
                      Scroll down and tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                  <div className="w-6 h-6 rounded bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950 block">Instant Native Experience</span>
                    <span className="text-xs text-emerald-800">
                      The Motorcycle Service Log app icon will now appear on your phone home screen!
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full mt-2 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Desktop users */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm bg-white border border-slate-300 rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Install on Your Phone</h3>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <p className="text-xs text-slate-600">
                Point your phone camera at this QR code to open the GitHub live link on your phone:
              </p>

              <div className="inline-block p-3 bg-white border-2 border-slate-300 rounded-lg shadow-xs">
                <img
                  src={qrCodeUrl}
                  alt="QR Code to open and install Motorcycle Service Log"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="text-xs font-mono text-slate-600 bg-slate-100 p-2 rounded border border-slate-200 break-all">
                {liveUrl}
              </div>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
