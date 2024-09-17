import { Dispatch, InputHTMLAttributes, SetStateAction, useCallback } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  setSearch: Dispatch<SetStateAction<string>>;
  searchAction: () => void;
}
export const Search = ({ setSearch, searchAction, ...rest }: SearchProps) => {
  useCallback(() => {
    if (!rest.value) {
      searchAction();
    }
  }, [rest.value]);

  return (
    <div className={'flex w-full'}>
      <input
        className="m-0 flex-1 bg-app-black-light border-[1px] border-solid border-app-placeholder py-2 px-5 rounded-md text-app-text w-full placeholder:text-app-text"
        name="search"
        value={rest.value}
        type={'text'}
        placeholder={rest.placeholder}
        onChange={(e) => {
          setSearch(e.target.value); setTimeout(() => {
            searchAction();
          }, 700);
        }} />
      <div className="flex ml-4">
        <button type='button' className='app-button border-none text-app-text cursor-pointer transition-all duration-200 py-0 px-5 rounded-md shadow-md hover:brightness-90' onClick={searchAction}>
          <FiSearch height={28} color={'var(--text)'} />
        </button>
      </div>
    </div>
  )
}