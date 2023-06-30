import { campDetailModule as styles }  from '@/styles/components/pages';

import { FiLayers } from 'react-icons/fi';

export function CampDetails() {
  const keyPix = "(85) 99244-2092";
  const handleCopy = () => {
    navigator.clipboard.writeText(keyPix);
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
        <button onClick={handleCopy}>Copiar <FiLayers height={18} color={'var(--primary-light)'} /></button>
      </div>

      <span>Banco: NU Pagamentos</span>
      <span>Tesoureiro: Wisley Silva dos Santos</span>
    </div>
  )
}