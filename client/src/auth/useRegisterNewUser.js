import { useAuth0 } from '@auth0/auth0-react';
import { getUserByAuthId, registerNewUser } from '../api/store/UserStore';
import {
  setBrowsedUser,
  setCurrentUser,
  setCurrentUserTheme,
  setIsCurrentUserAdmin,
} from '../store/reducers/UserSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18next, { changeLanguage } from 'i18next';

export const useRegisterNewUser = () => {
  const dispatch = useDispatch();
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { currentUser } = useSelector((state) => state.user);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await checkRegistration();
    }
    fetchData();
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
    console.log('register');
    const token = await getAccessTokenSilently();
    const language = i18next.language || 'en';
    await registerNewUser(token, user.sub, user.name, user.picture, language);
    const currentUser = await getUserByAuthId(token, user.sub);
    dispatch(setBrowsedUser(currentUser));
    dispatch(setCurrentUserTheme(currentUser.theme));
    changeLanguage(currentUser.language);
    dispatch(setCurrentUser(currentUser));
    if (currentUser.role === 'admin') {
      dispatch(setIsCurrentUserAdmin(true));
    } else {
      dispatch(setIsCurrentUserAdmin(false));
    }
  };

  return { isLoadingCompleted };
};
