import React from 'react';
import DotLoader from "react-spinners/DotLoader";

interface LoaderProps {
  loading: boolean
}

export function Loader({ loading }: LoaderProps) {
  return (
    <>
      {loading && <div className={'app-loader'}>
        <DotLoader loading={loading} size={150} />
      </div>}
    </>
  );
}