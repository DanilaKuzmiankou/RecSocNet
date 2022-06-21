import React, { useState } from 'react';
import '../../App.css';
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { LogInButton, NavBarToolsPanel, UserProfileDiminished } from '../index.components';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

export const CustomNav = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState('');

  const search = async (event) => {
    event.preventDefault();

    const searchParams = createSearchParams({ search: searchData });
    const pathname = '/search';
    navigate(`${pathname}?${searchParams}`);
  };

  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container fluid>
        <OverlayTrigger
          placement='bottom'
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip id='tooltip-disabled'>{t('to_home')}</Tooltip>}
        >
          <Link
            style={{ fontSize: '23px' }}
            to='/'
            className=' justify-content-start navbar-home-button'
          >
            {t('home')}
          </Link>
        </OverlayTrigger>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto my-2 my-lg-0' style={{ maxHeight: '100px', gap: '1rem' }}>
            {' '}
          </Nav>

          <div>
            <Container className='p-0'>
              <Row>
                <Col
                  style={{ display: 'flex', alignItems: 'center' }}
                  lg={'auto'}
                  sm={12}
                  className='nav-elements-margin '
                >
                  <Form className='d-flex' onSubmit={search}>
                    <FormControl
                      style={{ fontSize: '15px' }}
                      type='search'
                      placeholder={t('search_reviews')}
                      className='me-2 nav-search-bar'
                      aria-label='Search'
                      onChange={(event) => setSearchData(event.target.value)}
                    />
                    <Button style={{ fontSize: '15px' }} type='submit' variant='outline-success'>
                      {t('search')}
                    </Button>
                  </Form>
                </Col>
                <Col
                  style={{ display: 'flex', alignItems: 'center' }}
                  lg={'auto'}
                  sm={12}
                  className='nav-elements-margin ps-0'
                >
                  {isAuthenticated ? <UserProfileDiminished /> : <LogInButton />}
                </Col>
                <Col lg={'auto'} sm={12}>
                  <NavBarToolsPanel />
                </Col>
              </Row>
            </Container>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNav;
