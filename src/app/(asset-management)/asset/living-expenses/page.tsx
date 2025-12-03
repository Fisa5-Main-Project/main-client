import React from 'react';
import { Page, PageHeader } from '@/components/common/Page';
import { AssetLivingExpensesClient } from '@/components/asset/living-expenses/AssetLivingExpensesClient';

export default function LivingExpensesPage() {
  return (
    <Page>
      <AssetLivingExpensesClient>
        <div className="flex flex-col gap-2">
          <PageHeader>예상 생활비 (월)</PageHeader>
          <p className="text-neutral-500 text-xl font-medium">
            매달 발생하는 기본 생활 비용입니다.
          </p>
        </div>
      </AssetLivingExpensesClient>
    </Page>
  );
}
