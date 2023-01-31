import { RotatingSquare } from 'react-loader-spinner';
import './LoadingComponent.css';

export const LoadingComponent = () => {
  return (
    <>
      <RotatingSquare
        wrapperClass='custom-spinner'
        ariaLabel='rotating-square'
        visible={true}
        color='grey'
        strokeWidth='10'
      />
      <div className='overlay'></div>
    </>
  );
};
export default LoadingComponent;
