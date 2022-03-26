import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../api/store/UserStore';
import { onImageDownloadError } from '../../utils/Utils';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [imageGetAttempt, setImageGetAttempt] = useState(0);
  const { currentUser, currentUserTheme } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      document.body.setAttribute('data-theme', currentUserTheme);
      async function fetchData() {
        const usersFromApi = await getAllUsers();
        setUsers(usersFromApi);
      }
      fetchData();
    } else {
      navigate('/NotFoundPage');
    }
  }, []);
  return (
    <Container fluid className='profile_page_container'>
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          {users.map((user, key) => (
            <Row key={key} className=' pt-5'>
              <Col md={'auto'}>
                <Image
                  src={user.profilePictureUrl}
                  height={150}
                  width={150}
                  onError={({ currentTarget }) =>
                    onImageDownloadError(currentTarget, setImageGetAttempt, imageGetAttempt, user)
                  }
                />
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center' }} md={'auto'}>
                <a href={`/profile/${user.id}`}>{user.name}</a>
              </Col>
            </Row>
          ))}
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
};
