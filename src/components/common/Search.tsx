import { FiSearch } from 'react-icons/fi';

import styles from '@/styles/components/search.module.scss';
import { Dispatch, InputHTMLAttributes, SetStateAction, useEffect } from 'react';

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  setSearch: Dispatch<SetStateAction<string>>;
  searchAction: () => void;
}

export const Search = ({ setSearch, searchAction, ...rest }: SearchProps) => {
  useEffect(() => {
    if (!rest.value) {
      searchAction();
    }
  }, [rest.value]);
  return (
    <div className={styles.search}>
      <input
        name="search"
        value={rest.value}
        type={'text'}
        placeholder={rest.placeholder}
        onChange={(e) => setSearch(e.target.value)} />
      <div>
        <button type='button' className='searchButton' onClick={searchAction}>
          <FiSearch height={28} color={'var(--text)'} />
        </button>
      </div>
    </div>
  )
}

