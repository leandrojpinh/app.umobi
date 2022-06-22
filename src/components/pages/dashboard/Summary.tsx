import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import summaryStyles from '@/styles/components/summary.module.scss';
import { SummaryProps } from '@/model/views/Summary';

type ReportItem = {
  id: number;
  description: string;
  total: number;
}

export function Summary(summary: SummaryProps) {
  const { amountPayments,
    confirmed,
    pendingToComplete,
    pendingToConfirm,
    totalRegistrations } = summary;
    
  const [report, setReport] = useState<ReportItem[]>([]);

  useEffect(() => {
    setReport([{ id: 1, description: 'Total de inscrições', total: totalRegistrations } as ReportItem
      , { id: 2, description: 'Total a confirmar', total: pendingToConfirm }
      , { id: 3, description: 'Total confirmado', total: confirmed } as ReportItem
      , { id: 4, description: 'Total de confirmações incompletas', total: pendingToComplete } as ReportItem
      , {
        id: 5, description: 'Total recebido(R$)', total: amountPayments
      } as ReportItem]);
  }, []);

  return (
    <ul className={summaryStyles.container}>
      {report.map(item => (
        <li key={item.id}>
          <span>{item.description}</span>
          <strong>{item.total}</strong>
        </li>
      ))}
    </ul>
  );
}