import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';

import { backModule as styles }  from '@/styles/components/common';

type BackProps = {
  onClick?: () => void;
}

export const Back = (props: BackProps) => {
  const history = useRouter();

  return (
    <button className={styles.back} onClick={() => {
      if(props.onClick != undefined) props.onClick();
      else history.back()
    }}>
      <FiArrowLeft size={18} color={'var(--text)'} />
      <span>Voltar</span>
    </button>
  )
}