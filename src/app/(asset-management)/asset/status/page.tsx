import React from 'react';
import { Page, PageHeader } from '@/components/common/Page';
import { AssetStatusPageClient } from '@/components/asset/status/AssetStatusPageClient';

/**
 * 자산 관리 - 은퇴 여부 페이지 (서버 컴포넌트)
 * [수정] Page 컴포넌트 레이아웃 구조 수정
 */
export default function AssetStatusPage() {
    return (
        <Page>
            {/* 1. 정적 헤더 영역 */}
            <div className="flex flex-col gap-2">
                <PageHeader>은퇴 여부</PageHeader>
                <p className="text-neutral-500 text-xl font-medium">현재 재직 중인지 체크해주세요.</p>
            </div>

            {/* 2. 동적 컨텐츠 영역 (PageContent와 PageActions를 렌더링) */}
            <AssetStatusPageClient />
        </Page>
    );
}
