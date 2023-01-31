import { useState } from 'react';
import './CustomNav.css';
import { Button, Form, FormControl, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { LogInButton, NavbarToolsPanel, UserProfileDiminished } from '../index.components';
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
    <Navbar collapseOnSelect expand='md' bg='dark' variant='dark'>
      <div className='custom-navbar'>
        <OverlayTrigger
          placement='bottom'
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip id='tooltip-disabled'>{t('to_home')}</Tooltip>}
        >
          <Link style={{ fontSize: '23px' }} to='/' className='navbar-home-button'>
            {t('home')}
          </Link>
        </OverlayTrigger>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' className='navbar-togler' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <div className='navbar-content-container'>
            <Form className='navbar-form' onSubmit={search}>
              <FormControl
                type='search'
                placeholder={t('search_reviews')}
                className='me-2 nav-search-bar'
                aria-label='Search'
                onChange={(event) => setSearchData(event.target.value)}
              />
              <Button className='nav-search-button' type='submit' variant='outline-success'>
                {t('search')}
              </Button>
            </Form>
            <div className='avatar-tools-container'>
              {isAuthenticated ? <UserProfileDiminished /> : <LogInButton />}
              <NavbarToolsPanel />
            </div>
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default CustomNav;
