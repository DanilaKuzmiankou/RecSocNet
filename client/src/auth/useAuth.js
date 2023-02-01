import { useAuth0 } from '@auth0/auth0-react';
import { getUserByAuthId, registerNewUser } from '../api/store/UserStore';
import {
  setCurrentUser,
  setCurrentUserTheme,
  setIsCurrentUserAdmin,
} from '../store/reducers/UserSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import i18next, { changeLanguage } from 'i18next';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await startAuthentication();
    }

    fetchData();
  }, [isLoading]);

  const startAuthentication = async () => {
    if (isLoading === false) {
      if (isAuthenticated) {
        await authUser();
      }
      setIsLoadingCompleted(true);
    }
  };

  const authUser = async () => {
    const token = await getAccessTokenSilently();
    const language = i18next.language || 'en';
    document.body.style.fontFamily =
      language === 'ru' ? 'Avenir, Arial, serif' : document.body.fontfamily;
    await registerNewUser(token, user.sub, user.name, user.picture, language);
    const currentUser = await getUserByAuthId(token, user.sub);
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
