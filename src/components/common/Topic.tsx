import { topicModule as styles }  from '@/styles/components/common';

interface TopicProps {
  title: string;
}

export const Topic = ({ title }: TopicProps) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
    </div>
  )
}