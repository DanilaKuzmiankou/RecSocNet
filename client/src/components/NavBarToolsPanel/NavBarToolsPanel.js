import { Col, Container, Image, Row } from 'react-bootstrap';
import React from 'react';
import { changeLanguage } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserLanguage, setCurrentUserTheme } from '../../store/reducers/UserSlice';
import { changeUserLanguage, changeUserTheme } from '../../api/store/UserStore';

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
            src={process.env.PUBLIC_URL + '/united_states_flag.png'}
            height={35}
            width={35}
            roundedCircle={true}
            onClick={setEngLanguage}
          />
        </Col>
        <Col md={'auto'} className='p-0'>
          <Image
            src={process.env.PUBLIC_URL + '/russia_flag.png'}
            height={35}
            width={35}
            roundedCircle={true}
            onClick={setRuLanguage}
          />
        </Col>
      </Row>
      <Row xs={6} sm={6}>
        <Col md={'auto'} className='p-0 pe-2 pt-1'>
          <Image
            src={process.env.PUBLIC_URL + '/moon.png'}
            height={35}
            width={35}
            roundedCircle={true}
            onClick={setDarkBackground}
          />
        </Col>
        <Col md={'auto'} className='p-0 pe-1 pt-1'>
          <Image
            src={process.env.PUBLIC_URL + '/sun.png'}
            height={40}
            width={40}
            roundedCircle={true}
            onClick={setLightBackground}
          />
        </Col>
      </Row>
    </Container>
  );
};
