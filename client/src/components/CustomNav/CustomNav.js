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
import { createSearchParams, useNavigate } from 'react-router-dom';
import { LogInButton } from '../index.components';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProfileDiminished } from '../Profile/UserProfileDiminished';

export const CustomNav = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
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
          overlay={<Tooltip id='tooltip-disabled'>To Home!</Tooltip>}
        >
          <a
            style={{ fontSize: '50px' }}
            href='/'
            className=' justify-content-start navbar_home_button'
          >
            Home
          </a>
        </OverlayTrigger>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto my-2 my-lg-0' style={{ maxHeight: '100px', gap: '1rem' }}></Nav>

          <div>
            <Container>
              <Row>
                <Col
                  style={{ display: 'flex', alignItems: 'center' }}
                  lg={'auto'}
                  sm={12}
                  className='nav_elements_margin '
                >
                  <Form className='d-flex' onSubmit={search}>
                    <FormControl
                      style={{ fontSize: '25px' }}
                      type='search'
                      placeholder='Search reviews'
                      className='me-2'
                      aria-label='Search'
                      onChange={(event) => setSearchData(event.target.value)}
                    />
                    <Button style={{ fontSize: '25px' }} type='submit' variant='outline-success'>
                      Search
                    </Button>
                  </Form>
                </Col>
                <Col lg={'auto'} sm={12} className='nav_elements_margin nav_elements_margin_right'>
                  {isAuthenticated ? <UserProfileDiminished /> : <LogInButton />}
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
