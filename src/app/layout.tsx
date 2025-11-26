import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import AppLifecycleManager from '@/components/common/AppLifecycleManager';

export const viewport: Viewport = {
    themeColor: '#ffffff',
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
};

export const metadata: Metadata = {
    title: 'knowwhohow',
    description: 'Main Project Client with Next.js',
    icons: [
        { rel: 'icon', url: '/icons/icon-192x192.png', sizes: '192x192' },
        { rel: 'icon', url: '/icons/icon-512x512.png', sizes: '512x512' },
        { rel: 'apple-touch-icon', url: '/icons/icon-192x192.png' },
    ],
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'knowwhohow',
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className="font-sans" suppressHydrationWarning>
            <body className="bg-white sm:bg-neutral-200" suppressHydrationWarning>
                <div className="sm:flex sm:items-center sm:justify-center sm:min-h-screen">
                    <main className="relative w-full bg-white sm:max-w-[402px] sm:h-screen h-screen sm:shadow-lg sm:rounded-2xl overflow-y-auto">
                        <AppLifecycleManager>{children}</AppLifecycleManager>
                    </main>
                </div>
            </body>
        </html>
    );
}
