import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import summaryStyles from '@/styles/components/summary.module.scss';
import { SummaryPayments } from '@/services/umobi/models/Registration';
import { toMoney } from '@/helper/utils';

type ReportItem = {
  id: number;
  description: string;
  total: number;
}

export function Summary({ confirmed, pending, received, registrations, uncompleted }: SummaryPayments) {
  const [report, setReport] = useState<ReportItem[]>([]);

  useEffect(() => {
    setReport([{ id: 1, description: 'Total de inscrições', total: registrations || 0 } as ReportItem
      , { id: 2, description: 'Pag. não iniciado', total: pending || 0 }
      , { id: 3, description: 'Pag. realizados', total: confirmed || 0 } as ReportItem
      , { id: 4, description: 'Pag. em andamento', total: uncompleted || 0 } as ReportItem
      , {
        id: 5, description: 'Total recebido(R$)', total: received || 0
      } as ReportItem]);
  }, [confirmed, pending, received, registrations, uncompleted]);

  return (
    <ul className={summaryStyles.container}>
      {report.map(item => (
        <li key={item.id}>
          <span>{item.description}</span>
          <strong>{item.id === 5 ? toMoney(`${item.total}`) : item.total}</strong>
        </li>
      ))}
    </ul>
  );
}