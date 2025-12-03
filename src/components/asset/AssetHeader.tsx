'use client';

import { useUser } from '@/hooks/common/useUser';

export function AssetHeader() {
    const { userName } = useUser();

    return (
        <h1 className="text-accent text-3xl font-['Pretendard'] whitespace-pre-line">
            <span className="font-bold">{userName}</span>
            <span className="font-medium">{'님의 든든한 노후,\n저희가 책임지고\n설계합니다.'}</span>
        </h1>
    );
}
