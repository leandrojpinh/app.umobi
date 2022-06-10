import React from 'react';
import styles from '@/styles/components/loader.module.scss';
import DotLoader from "react-spinners/DotLoader";

interface LoaderProps {
  loading: boolean
}

export function Loader({ loading }: LoaderProps) {
  return (
    <>
      {loading && <div className={styles.container}>
        <DotLoader loading={loading} size={150} />
      </div>}
    </>
  );
}