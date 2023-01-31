import './NavbarToolsPanel.css';
import { Image } from 'react-bootstrap';
import { changeLanguage } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserLanguage, setCurrentUserTheme } from '../../store/reducers/UserSlice';
import { changeUserLanguage, changeUserTheme } from '../../api/store/UserStore';
import unitedStatesFlag from '../../assets/pictures/unitedStatesFlag.png';
import russiaFlag from '../../assets/pictures/russiaFlag.png';
import sun from '../../assets/pictures/sun.png';
import moon from '../../assets/pictures/moon.png';

export const NavbarToolsPanel = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const setEngLanguage = () => {
    setLanguage('en');
  };

  const setRuLanguage = () => {
    setLanguage('ru');
  };

  const setLanguage = (language) => {
    changeLanguage(language);
    dispatch(setCurrentUserLanguage(language));
    if (Object.keys(currentUser).length !== 0) {
      changeUserLanguage(currentUser.authId, language);
    }
  };

  const setLightBackground = () => {
    setTheme('light-theme');
  };

  const setDarkBackground = () => {
    setTheme('dark-theme');
  };

  const setTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    dispatch(setCurrentUserTheme(theme));
    if (Object.keys(currentUser).length !== 0) {
      changeUserTheme(currentUser.authId, theme);
    }
  };

  return (
    <div className='navbar-tools-container'>
      <div className='navbar-tools-column'>
        <Image src={unitedStatesFlag} height={25} width={25} onClick={setEngLanguage} />
        <Image src={russiaFlag} height={25} width={25} onClick={setRuLanguage} />
      </div>
      <div className='navbar-tools-column'>
        <Image src={moon} height={25} width={25} onClick={setDarkBackground} />
        <Image src={sun} height={25} width={25} onClick={setLightBackground} />
      </div>
    </div>
  );
};
