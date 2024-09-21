import React, { useState, useEffect } from 'react';
import { Button, useToast } from '@chakra-ui/react';

const InstallableApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isRunningAsPWA, setIsRunningAsPWA] = useState(false);
    const toast = useToast();

    useEffect(() => {
        // Check if the app is running as a PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsRunningAsPWA(true);
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        const handleAppInstalled = () => {
            console.log('INSTALL: Success');
            toast({
                title: 'App Installed',
                description: 'The app has been successfully installed.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsRunningAsPWA(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [toast]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
                setShowInstallButton(false);
            }
            setDeferredPrompt(null);
        }
    };

    if (isRunningAsPWA) {
        return null; // Don't render anything if running as PWA
    }

    return (
        <>
            {showInstallButton && (
                <Button colorScheme="blue" variant="ghost" onClick={handleInstallClick}>
                    Install App
                </Button>
            )}
        </>
    );
};

export default InstallableApp;