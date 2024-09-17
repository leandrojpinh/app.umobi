interface TitleProps {
  title: string;
  subtitle?: string;
}

export const Title = ({ title, subtitle }: TitleProps) => {
  return (
    <div className={'flex flex-col w-full'}>
      <h1 className="uppercase tracking-widest font-medium pb-4 text-3xl">{title}</h1>
      {subtitle && <span className="font-app-text text-app-text2 pb-12">{subtitle}</span>}
    </div>
  )
}

interface TopicProps {
  title: string;
}

export const Topic = ({ title }: TopicProps) => {
  return (
    <div className={'flex flex-col w-full'}>
      <h3 className="uppercase tracking-widest font-medium text-xl pb-4">{title}</h3>
    </div>
  )
}