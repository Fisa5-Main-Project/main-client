import React from 'react';
import { AssetLayoutClient } from '@/components/asset/AssetLayoutClient';

export default function AssetLayout({ children }: { children: React.ReactNode }) {
    return (
        <AssetLayoutClient>
            {children}
        </AssetLayoutClient>
    );
}
