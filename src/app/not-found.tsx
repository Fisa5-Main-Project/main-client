import React from 'react';
import ErrorContent from '@/components/common/ErrorContent';

export default function NotFound() {
    return (
        <ErrorContent
            title="페이지를 찾을 수 없어요"
            description={`요청하신 페이지가 사라졌거나,\n잘못된 경로로 접근하셨습니다.`}
        />
    );
}
