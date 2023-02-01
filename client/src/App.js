import { AppRoutes } from './router/AppRoutes';
import { CustomNav, LoadingComponent } from './components/index.components';
import { useAuth } from './auth/useAuth';

const App = () => {
  const { isLoadingCompleted } = useAuth();

  return (
    <div>
      {isLoadingCompleted ? (
        <>
          <CustomNav />
          <AppRoutes />
        </>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default App;
