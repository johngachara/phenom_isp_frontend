import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {ChakraProvider} from "@chakra-ui/react";
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js').then(
            (registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            (err) => {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
});

window.addEventListener('appinstalled', (evt) => {
    // Log install to analytics
    console.log('INSTALL: Success');
});

function showInstallPromotion() {
    // Show the install promotion UI
    // You can create a button or any UI element to trigger the installation
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        }
    });
    document.body.appendChild(installButton);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
    <App />
    </ChakraProvider>
  </StrictMode>,
)
