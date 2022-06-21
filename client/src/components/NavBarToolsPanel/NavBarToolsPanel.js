import { Col, Container, Image, Row } from 'react-bootstrap';
import React from 'react';
import { changeLanguage } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserLanguage, setCurrentUserTheme } from '../../store/reducers/UserSlice';
import { changeUserLanguage, changeUserTheme } from '../../api/store/UserStore';
import unitedStatesFlag from '../../assets/pictures/unitedStatesFlag.png';
import russiaFlag from '../../assets/pictures/russiaFlag.png';
import sun from '../../assets/pictures/sun.png';
import moon from '../../assets/pictures/moon.png';

export const NavBarToolsPanel = () => {
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
    <Container fluid className='p-0'>
      <Row xs={6} sm={6}>
        <Col md={'auto'} className='p-0 pe-2'>
          <Image
            src={unitedStatesFlag}
            height={25}
            width={25}
            roundedCircle={true}
            onClick={setEngLanguage}
          />
        </Col>
        <Col md={'auto'} className='p-0'>
          <Image
            src={russiaFlag}
            height={25}
            width={25}
            roundedCircle={true}
            onClick={setRuLanguage}
          />
        </Col>
      </Row>
      <Row xs={6} sm={6}>
        <Col md={'auto'} className='p-0 pe-2 pt-1'>
          <Image
            src={moon}
            height={25}
            width={25}
            roundedCircle={true}
            onClick={setDarkBackground}
          />
        </Col>
        <Col md={'auto'} className='p-0 pe-1 pt-1'>
          <Image
            src={sun}
            height={30}
            width={30}
            roundedCircle={true}
            onClick={setLightBackground}
          />
        </Col>
      </Row>
    </Container>
  );
};
