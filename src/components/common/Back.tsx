import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';

import { backModule as styles }  from '@/styles/components/common';

export const Back = () => {
  const history = useRouter();

  return (
    <button className={styles.back} onClick={() => history.back()}>
      <FiArrowLeft size={18} color={'var(--text)'} />
      <span>Voltar</span>
    </button>
  )
}