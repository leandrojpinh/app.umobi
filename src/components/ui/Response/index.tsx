import { ALink } from '@/components/ui/Button';

export interface IResponseProps {
  title: string;
  message: string;
  type: 'success' | 'error'
}

export const Response = ({ title, message, type = 'success' }: IResponseProps) => {
  return (
    <div className={'flex flex-col items-start w-100 p-8'}>
      <h1 className={`text-7xl mt-20 uppercase tracking-widest font-semibold pb-4 ${type === 'success' ? '' : ''}`}>{title}</h1>
      <span className='font-app-text text-app-text2 pb-8'>{message}</span>

      <ALink path={'/profile'} label={'Entendi'} />
    </div>
  )
}