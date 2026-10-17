import { FC, useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';

export const PWAAutoInstallBanner: FC = () => {
  const { isInstallable, isInstalled, isInstallLoading, justInstalled, isIframe, isAndroid, install } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // If running in standalone mode (already installed), never show the banner
    if (isInstalled) {
      setIsVisible(false);
      return;
    }

    // Check if dismissed in this session
    try {
      const isDismissed = sessionStorage.getItem('boostpay_pwa_banner_dismissed') === 'true';
      if (isDismissed) {
        return;
      }
    } catch {}

    // Auto-reveal banner on load after a brief 800ms dwell time
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  // When successfully installed, hide the banner
  useEffect(() => {
    if (justInstalled || isInstalled) {
      setIsVisible(false);
    }
  }, [justInstalled, isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('boostpay_pwa_banner_dismissed', 'true');
    } catch {}
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  if (!isVisible || isInstalled) {
    return (
      <InstallGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onConfirmInstall={install}
        isInstallable={isInstallable}
      />
    );
  }

  return (
    <>
      <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 max-w-md mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="relative rounded-2xl border border-amber-500/40 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Close / Dismiss button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="absolute top-3 right-3 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5 pr-6">
            {/* App Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/30">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>

            {/* Copy */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white tracking-tight">Install BoostPay App</h4>
                {isAndroid && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 font-mono">
                    <Smartphone className="w-3 h-3" /> Android
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-300 mt-0.5 leading-snug">
                Add to your home screen for full-screen yield compounding and instant P2P transfers.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              disabled={isInstallLoading}
              className="flex-1 h-10 rounded-xl bg-amber-500 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-[0.98] transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isInstallLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Install App Now</span>
                </>
              )}
            </button>

            <button
              onClick={handleDismiss}
              className="px-3.5 h-10 rounded-xl border border-zinc-800 bg-zinc-950/80 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>
      </div>

      <InstallGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onConfirmInstall={install}
        isInstallable={isInstallable}
      />
    </>
  );
};
