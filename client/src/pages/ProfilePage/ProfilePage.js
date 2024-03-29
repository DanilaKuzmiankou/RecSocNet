import './ProfiilePage.css';
import '../../App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import {
  CustomBootstrapTable,
  CustomModal,
  LoadingComponent,
  LogInButton,
  UserProfile,
} from '../../components/index.components';
import { getUserById } from '../../api/store/UserStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteImagesFromFirebaseCloud,
  deleteUserReview,
  getUserReviews,
} from '../../api/store/ReviewStore';
import { useDispatch, useSelector } from 'react-redux';
import { setBrowsedUser, setIsCurrentUserOwner } from '../../store/reducers/UserSlice';
import {
  setDisplayFilters,
  setEditedReview,
  setReviews,
  setSelectedReview,
} from '../../store/reducers/ReviewSlice';
import { setModalParams } from '../../store/reducers/ModalSlice';
import { setIsLoading } from '../../store/reducers/LoadingSlice';
import { useTranslation } from 'react-i18next';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routerParams = useParams();
  const reviewsModal = useRef();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth0();
  const { isCurrentUserAdmin, isCurrentUserOwner, currentUser, browsedUser, currentUserTheme } =
    useSelector((state) => state.user);
  const { reviews, displayFilters, selectedReview } = useSelector((state) => state.review);
  const isLoading1 = useSelector((state) => state.loading.isLoading);
  const [filtersBtnText, setFiltersBtnText] = useState(t('show_filters'));

  useEffect(() => {
    dispatch(setIsLoading(true));
    document.body.setAttribute('data-theme', currentUserTheme);

    async function fetchData() {
      await checkPrivileges();
      dispatch(setIsLoading(false));
    }

    fetchData();
  }, [isAuthenticated, currentUserTheme]);

  const checkPrivileges = async () => {
    if (isAuthenticated) {
      await setCurrentUserAsAuthUser();
    } else {
      if (routerParams.id) {
        await setCurrentUserAsGuest();
      }
    }
  };

  const setCurrentUserAsGuest = async () => {
    const userBrowsedProfile = await getUserById(routerParams.id);
    if (!userBrowsedProfile) {
      navigate('/1');
    }
    try {
      dispatch(setBrowsedUser(userBrowsedProfile));
      dispatch(setIsCurrentUserOwner(false));
      const reviews = await getUserReviews(userBrowsedProfile.authId, routerParams.id);
      dispatch(setReviews(reviews));
    } catch (e) {}
  };

  const authUserInOtherUserProfile = async () => {
    const userBrowsedProfile = await getUserById(routerParams.id);
    if (!userBrowsedProfile) {
      navigate('/1');
    }
    try {
      dispatch(setBrowsedUser(userBrowsedProfile));
      const reviews = await getUserReviews(userBrowsedProfile.authId, routerParams.id);
      dispatch(setReviews(reviews));
      if (userBrowsedProfile.authId === currentUser.authId) {
        dispatch(setIsCurrentUserOwner(true));
      } else {
        dispatch(setIsCurrentUserOwner(false));
      }
    } catch (e) {}
  };

  const authUserInOwnProfile = async () => {
    const newReviews = await getUserReviews(currentUser.authId, currentUser.id);
    dispatch(setReviews(newReviews));
    dispatch(setBrowsedUser(currentUser));
    dispatch(setIsCurrentUserOwner(true));
  };

  const setCurrentUserAsAuthUser = async () => {
    if (routerParams.id) {
      await authUserInOtherUserProfile();
    } else {
      await authUserInOwnProfile();
    }
  };

  const createReview = () => {
    dispatch(setEditedReview({}));
    dispatch(
      setModalParams({
        title: t('review_creating'),
        displayModalButtons: '',
        displayModalFeedback: 'none',
        displayEditForm: true,
        displayViewForm: false,
        displayHeader: '',
        backdrop: 'static',
      })
    );
    reviewsModal?.current.showReviewModal();
  };

  const viewReview = () => {
    if (Object.keys(selectedReview).length !== 0) {
      dispatch(setEditedReview(selectedReview));
      dispatch(
        setModalParams({
          title: t('review_view'),
          displayModalButtons: 'none',
          displayModalFeedback: '',
          displayEditForm: false,
          displayViewForm: true,
          displayHeader: 'none',
          backdrop: 'true',
        })
      );
      reviewsModal?.current.showReviewModal();
    }
  };

  const editReview = () => {
    if (Object.keys(selectedReview).length !== 0) {
      dispatch(setEditedReview(selectedReview));
      dispatch(
        setModalParams({
          title: t('review_editing'),
          displayModalButtons: '',
          displayModalFeedback: 'none',
          displayEditForm: true,
          displayViewForm: false,
          displayHeader: '',
          backdrop: 'static',
        })
      );
      reviewsModal?.current.showReviewModal();
    }
  };

  const deleteReview = async () => {
    if (Object.keys(selectedReview).length !== 0) {
      const selectedId = selectedReview.id;
      if (selectedId) {
        const filtered = reviews.filter((review) => review.id !== selectedId);
        dispatch(setReviews(filtered));
        await deleteImagesFromFirebaseCloud(
          reviews.find((review) => review.id === selectedId).images
        );
        await deleteUserReview(browsedUser.authId, selectedId);
        dispatch(setSelectedReview({}));
      }
    }
  };

  const changeDisplayFiltersState = () => {
    if (!displayFilters) {
      dispatch(setDisplayFilters('none'));
      setFiltersBtnText(t('show_filters'));
    } else {
      dispatch(setDisplayFilters(''));
      setFiltersBtnText(t('hide_filters'));
    }
  };

  return (
    <Container fluid className='page-container profile-page-container'>
      {isLoading1 ? (
        <LoadingComponent />
      ) : (
        <div>
          {routerParams.id || isAuthenticated ? (
            <div>
              <h2 className='no-select profile-title'>{t('profile')}</h2>
              <UserProfile />
              {reviews && reviews.length > 0 ? (
                <div style={{ paddingTop: '20px' }}>
                  <h1 className='text-center'>{t('reviews')}</h1>
                  <div className='buttons-container'>
                    <Button
                      className='button-with-shadow'
                      variant='success'
                      onClick={changeDisplayFiltersState}
                    >
                      {filtersBtnText}
                    </Button>
                    <div className='reviews-table-container'>
                      <Button
                        variant='success'
                        className='reviews-table-button button-with-shadow'
                        onClick={viewReview}
                      >
                        {t('view')}
                      </Button>
                      {isCurrentUserAdmin || isCurrentUserOwner ? (
                        <>
                          <Button
                            variant='success'
                            className='reviews-table-button button-with-shadow'
                            onClick={createReview}
                          >
                            {t('create')}
                          </Button>
                          <Button
                            variant='success'
                            className='reviews-table-button button-with-shadow'
                            onClick={editReview}
                          >
                            {t('edit')}
                          </Button>
                          <Button
                            variant='success'
                            className='reviews-table-button button-with-shadow'
                            onClick={deleteReview}
                          >
                            {t('delete')}
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className='profile-page-table-container'>
                    <CustomBootstrapTable />
                  </div>
                </div>
              ) : (
                <div className='centered-profile-page text-center'>
                  {isCurrentUserAdmin || isCurrentUserOwner ? (
                    <div className='no-wrap-on-normal-screen'>
                      <h2>{t('no_reviews')}</h2>
                      <div className='profile-button-container'>
                        <Button className='profile-button' variant='danger' onClick={createReview}>
                          {t('tap_me')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='no-wrap-on-big-screen'>
                      <h2>{t('no_reviews_admin')}</h2>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className='no-wrap-on-normal-screen centered-without-content text-center'>
              <div>
                <h2>{t('log_in_first')}</h2>
                <LogInButton size={'big'} />
              </div>
            </div>
          )}
          <CustomModal ref={reviewsModal} />
        </div>
      )}
    </Container>
  );
};
