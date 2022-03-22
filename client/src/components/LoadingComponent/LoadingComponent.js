import { RotatingSquare } from 'react-loader-spinner';
import React from 'react';

export const LoadingComponent = () => {
  return (
    <div>
      <RotatingSquare
        wrapperClass='custom_spinner'
        ariaLabel='rotating-square'
        visible={true}
        color='grey'
        strokeWidth='10'
      />
      <div className='overlay'></div>
    </div>
  );
};
export default LoadingComponent;
