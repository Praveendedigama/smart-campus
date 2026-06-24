import { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('installDismissed') === 'true'
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt || dismissed) return null;

  const handleInstall = async () => {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('installDismissed', 'true');
  };

  return (
    <div className="install-banner" role="complementary" aria-label="Install app">
      <div className="install-banner__icon">📲</div>
      <div className="install-banner__text">
        <strong>Add to Home Screen</strong>
        <span>Use Smart Campus like a native app</span>
      </div>
      <div className="install-banner__actions">
        <button className="install-banner__install" onClick={handleInstall}>
          Install
        </button>
        <button className="install-banner__dismiss" onClick={handleDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}
