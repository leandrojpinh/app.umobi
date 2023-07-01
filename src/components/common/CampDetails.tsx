import { useState } from 'react';
import { campDetailModule as styles }  from '@/styles/components/pages';

import { FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';

export function CampDetails() {
  const keyPix = "cfc50003-defe-4875-9ae0-db173dbd41e6";
  const [copyText, setCopyText] = useState('Copiar');
  const handleCopy = async () => {
    await navigator.clipboard.writeText(keyPix);
    setCopyText("Copiado!");

    setTimeout(() => {
      setCopyText("Copiar");
    }, 3000);
  }

  return (
    <div className={styles.info}>
      <strong>Taxa do Retiro</strong>
      {/* <strong className={styles.tax}>R$ 200,00 <span>a partir de 16/out R$ 250,00.</span></strong> */}
      <strong className={styles.tax}>R$ 200,00</strong>

      <strong>Dados para envio de pix/transferências</strong>
      <span>Chave Pix</span>
      <div className={styles.pix}>
        <span>
          {keyPix}
        </span>
        <button onClick={handleCopy}>{copyText} <FiLayers height={18} color={'var(--primary-light)'} /></button>
      </div>

      <span>Banco: Inter</span>
      <span>Tesoureiro: Daniel Nunes Araújo</span>
    </div>
  )
}