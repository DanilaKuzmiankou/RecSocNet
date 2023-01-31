import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import { getAllUsers } from '../../api/store/UserStore';
import { onImageDownloadError } from '../../utils/Utils';
import { Image } from 'react-bootstrap';
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
    <div className='page-container admin-page-container'>
      <ul className='user-list'>
        {users.map((user) => (
          <li key={user.id} className='user-container'>
            <Image
              src={user.profilePictureUrl}
              height={150}
              width={150}
              onError={({ currentTarget }) =>
                onImageDownloadError(currentTarget, setImageGetAttempt, imageGetAttempt, user)
              }
            />
            <a href={`/profile/${user.id}`}>{user.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
