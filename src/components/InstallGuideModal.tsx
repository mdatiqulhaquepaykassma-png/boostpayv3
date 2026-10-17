import { FC, useState } from 'react';
import { Download, X, Smartphone, Monitor, Share, PlusSquare, Chrome, Compass, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmInstall?: () => void;
  isInstallable: boolean;
}

export const InstallGuideModal: FC<Props> = ({ isOpen, onClose, onConfirmInstall, isInstallable }) => {
  const [activeTab, setActiveTab] = useState<'MOBILE' | 'IOS' | 'DESKTOP'>(() => {
    if (typeof window === 'undefined') return 'MOBILE';
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'IOS';
    if (/android/.test(ua)) return 'MOBILE';
    return 'MOBILE';
  });

  if (!isOpen) return null;

  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/20">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Install BoostPay App</h3>
              <p className="text-xs text-zinc-400">Add to your Home Screen for 24/7 instant access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Iframe Notice & Direct Browser Tab Launch */}
          {isIframe && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2">
              <div className="flex items-start gap-2 text-xs text-amber-200">
                <ExternalLink className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Browsers require opening the app directly in a full browser tab to trigger native Home Screen installation.
                </span>
              </div>
              <button
                onClick={handleOpenNewTab}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition cursor-pointer"
              >
                <span>Open in Full Browser Tab to Install</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Direct Install Button if supported by current browser context */}
          {isInstallable && onConfirmInstall && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center space-y-2.5">
              <p className="text-xs text-emerald-200 font-medium">
                Your browser is ready to install BoostPay right now:
              </p>
              <button
                onClick={() => {
                  onConfirmInstall();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-[0.99] transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Install BoostPay Now</span>
              </button>
            </div>
          )}

          {/* Platform Switcher Tabs */}
          <div className="flex rounded-2xl bg-zinc-950 p-1 border border-zinc-800">
            <button
              onClick={() => setActiveTab('MOBILE')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === 'MOBILE' ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>
            <button
              onClick={() => setActiveTab('IOS')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === 'IOS' ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>iPhone / iPad</span>
            </button>
            <button
              onClick={() => setActiveTab('DESKTOP')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === 'DESKTOP' ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>PC / Mac</span>
            </button>
          </div>

          {/* Instructions Cards */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3 text-xs">
            {activeTab === 'MOBILE' && (
              <>
                <div className="font-bold text-white flex items-center gap-2">
                  <Chrome className="w-4 h-4 text-amber-400" />
                  <span>Installing on Android (Chrome / Edge / Brave / Samsung)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Tap the browser menu icon (three vertical dots <span className="text-amber-400 font-bold">⋮</span>) at the top or bottom right.</li>
                  <li>Select <span className="text-white font-semibold">"Install app"</span> or <span className="text-white font-semibold">"Add to Home screen"</span>.</li>
                  <li>Confirm by tapping <span className="text-white font-semibold">"Install"</span>. The BoostPay app icon will appear directly on your home screen!</li>
                </ol>
              </>
            )}

            {activeTab === 'IOS' && (
              <>
                <div className="font-bold text-white flex items-center gap-2">
                  <Share className="w-4 h-4 text-sky-400" />
                  <span>Installing on iPhone / iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Open BoostPay in Safari browser.</li>
                  <li>Tap the <span className="text-sky-400 font-semibold inline-flex items-center gap-1">Share button <Share className="w-3 h-3 inline" /></span> in the bottom toolbar.</li>
                  <li>Scroll down the menu and tap <span className="text-white font-semibold inline-flex items-center gap-1">"Add to Home Screen" <PlusSquare className="w-3 h-3 inline text-amber-400" /></span>.</li>
                  <li>Tap <span className="text-white font-semibold">"Add"</span> in the top-right corner to finish.</li>
                </ol>
              </>
            )}

            {activeTab === 'DESKTOP' && (
              <>
                <div className="font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <span>Installing on Desktop (Chrome / Edge / Brave)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Look for the install icon (<Download className="w-3 h-3 inline text-amber-400" />) in the right side of the address bar.</li>
                  <li>Or open the browser menu (<span className="text-amber-400 font-bold">⋮</span>) and click <span className="text-white font-semibold">"Install BoostPay..."</span>.</li>
                  <li>Click <span className="text-white font-semibold">"Install"</span> to run BoostPay as a standalone desktop app.</li>
                </ol>
              </>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="rounded-xl bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
