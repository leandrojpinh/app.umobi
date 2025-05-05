'use client'

import { useState } from 'react';

import { FiLayers } from 'react-icons/fi';

export function CampDetails() {
  const keyPix = "4fa2d6d3-a08e-4570-8b18-fbb25680345b";
  const [copyText, setCopyText] = useState('Copiar');
  const handleCopy = async () => {
    await navigator.clipboard.writeText(keyPix);
    setCopyText("Copiado!");

    setTimeout(() => {
      setCopyText("Copiar");
    }, 3000);
  }

  return (
    <div className={'flex flex-col w-full font-app-text'}>
      <strong className='mb-2'>Taxa do Retiro</strong>
      {/* <strong className={styles.tax}>R$ 200,00 <span>a partir de 16/out R$ 250,00.</span></strong> */}
      <strong className={'text-4xl text-app-primary-light mb-4'}>R$ 180,00</strong>

      <strong className='mb-2 text-md font-normal tracking-widest'>Dados para envio de pix/transferências</strong>
      <span className='mb-2'>Chave Pix</span>
      <div className={'flex items-center tracking-wide self-start py-2 px-4 bg-app-black-dark rounded-md mb-4'}>
        <span className='m-0 overflow-hidden line-clamp-1'>
          {keyPix}
        </span>
        <button className='py-2 px-0 border-none ml-4 bg-[transparent] text-app-primary-light flex items-center gap-2 cursor-pointer' onClick={handleCopy}>{copyText} <FiLayers height={18} color={'var(--primary-light)'} /></button>
      </div>

      <span className='mb-2'>Banco: Will Bank</span>
      <span className='mb-2'>Tesoureiro: Sabrina Lima da Costa</span>
      <span className='mb-2'>Contato: (85) 99212-1171</span>
    </div>
  )
}