import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'main project',
        short_name: '우리은행',
        description: 'main project with Next.js',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#0067AC',
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
