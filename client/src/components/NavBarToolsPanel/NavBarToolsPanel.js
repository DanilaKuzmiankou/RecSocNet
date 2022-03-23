import { Col, Container, Image, Row } from 'react-bootstrap';
import React from 'react';
import i18next from 'i18next';

export const NavBarToolsPanel = () => {
  const setEngLanguage = () => {
    i18next.changeLanguage('en');
  };
  const setRuLanguage = () => {
    i18next.changeLanguage('ru');
  };
  return (
    <Container fluid className='p-0'>
      <Row>
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
      <Row>
        <Col md={'auto'} className='p-0 pe-2 pt-1'>
          <Image
            src={process.env.PUBLIC_URL + '/moon.png'}
            height={35}
            width={35}
            roundedCircle={true}
          />
        </Col>
        <Col md={'auto'} className='p-0 pe-1 pt-1'>
          <Image
            src={process.env.PUBLIC_URL + '/sun.png'}
            height={40}
            width={40}
            roundedCircle={true}
          />
        </Col>
      </Row>
    </Container>
  );
};
