if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js')
      .then(function(registration) {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

let deferredPrompt;
let installButton;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});

function showInstallPromotion() {
  if (installButton) return;

  installButton = document.createElement('button');
  installButton.textContent = '📱 Install App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 30px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    z-index: 99999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: slideUp 0.5s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    deferredPrompt = null;
    if (installButton) {
      installButton.remove();
      installButton = null;
    }
  });

  document.body.appendChild(installButton);
}

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  if (installButton) {
    installButton.remove();
    installButton = null;
  }
});