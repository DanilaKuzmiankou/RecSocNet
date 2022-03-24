import { useAuth0 } from '@auth0/auth0-react';
import { getUserByAuthId, registerNewUser } from '../api/store/UserStore';
import { setCurrentUser, setIsCurrentUserAdmin } from '../store/reducers/UserSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useRegisterNewUser = () => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

  useEffect(async () => {
    await checkRegistration();
  }, [isLoading]);

  const checkRegistration = async () => {
    if (isLoading === false) {
      if (isAuthenticated && Object.keys(currentUser).length === 0) {
        await startRegistration();
      }
      setIsLoadingCompleted(true);
    }
  };

  const startRegistration = async () => {
    const token = await getAccessTokenSilently();
    await registerNewUser(token, user.sub, user.name, user.picture);
    const currentUser = await getUserByAuthId(token, user.sub);
    dispatch(setCurrentUser(currentUser));
    if (currentUser.role === 'admin') {
      dispatch(setIsCurrentUserAdmin(true));
    }
  };

  return { isLoadingCompleted };
};
