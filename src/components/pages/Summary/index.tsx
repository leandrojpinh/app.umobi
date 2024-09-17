import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

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
    <ul className={'list-none grid gap-4 grid-cols-1 auto-rows-auto mb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}>
      {report.map(item => (
        <li key={item.id} className='flex items-center justify-between flex-col p-3 bg-app-black-light shadow-md rounded-md transition-all duration-200 hover:bg-app-black-dark'>
          <span className='text-center text-sm text-app-text'>{item.description}</span>
          <strong className='text-4xl mt-3 text-app-text'>{item.id === 5 ? toMoney(`${item.total}`) : item.total}</strong>
        </li>
      ))}
    </ul>
  );
}