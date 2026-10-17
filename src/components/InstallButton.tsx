import { FC, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';

interface Props {
  variant?: 'compact' | 'full';
  className?: string;
}

export const InstallButton: FC<Props> = ({ variant = 'compact', className = '' }) => {
  const { isInstallable, isInstalled, isInstallLoading, justInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running as an installed PWA, suppress button
  if (isInstalled && !justInstalled) {
    return null;
  }

  if (justInstalled) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 animate-in fade-in duration-200 ${className}`}
        title="BoostPay installed successfully"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        id="pwa-install-button"
        onClick={handleInstallClick}
        disabled={isInstallLoading}
        aria-label="Install BoostPay"
        title="Install BoostPay app to your device"
        className={`relative inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-95 transition cursor-pointer shadow-md shadow-amber-500/20 ${className}`}
      >
        {isInstallLoading ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
        ) : (
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        )}
        <span>{variant === 'full' ? 'Install BoostPay App' : 'Install App'}</span>
      </button>

      <InstallGuideModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirmInstall={install}
        isInstallable={isInstallable}
      />
    </>
  );
};
