import './SearchPage.css';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { findReviews } from '../../api/store/ReviewStore';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingComponent, ReviewShortened } from '../../components/index.components';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews } from '../../store/reducers/ReviewSlice';
import { setIsLoading } from '../../store/reducers/LoadingSlice';
import { useTranslation } from 'react-i18next';

export const SearchPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [rowSelectionRate, setRowSelectionRate] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [searchedReviews, setSearchedReviews] = useState([]);
  const { currentUser, currentUserTheme } = useSelector((state) => state.user);
  const [infiniteScrollKey, setInfiniteScrollKey] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      document.body.setAttribute('data-theme', currentUserTheme);

      async function fetchData() {
        await searchReviews(true);
      }

      fetchData();
      setInfiniteScrollKey(Math.random());
    }
  }, [searchParams, currentUser]);

  const searchReviews = async (reRenderFlag) => {
    dispatch(setIsLoading(true));
    let rowSelection = rowSelectionRate;
    let prevReviews = searchedReviews;
    if (reRenderFlag) {
      rowSelection = 0;
      prevReviews = [];
      setRowSelectionRate(rowSelection);
      setSearchedReviews(prevReviews);
      setHasMoreReviews(true);
    }
    const searchedReviewsFromApi = await findReviews(
      10,
      rowSelection * 10,
      searchParams.get('search'),
      currentUser.id
    );
    if (searchedReviewsFromApi.length !== 0) {
      setFetchedReviews(prevReviews, searchedReviewsFromApi);
    }
    dispatch(setIsLoading(false));
  };

  const setFetchedReviews = (prevReviews, searchedReviewsFromApi) => {
    const resultNewestReviews = [...prevReviews, ...searchedReviewsFromApi];
    setSearchedReviews(resultNewestReviews);
    dispatch(setReviews(resultNewestReviews));
    setRowSelectionRate((rowSelectionRate) => rowSelectionRate + 1);
    if (searchedReviewsFromApi.length < 10) {
      setHasMoreReviews(false);
    }
  };

  return (
    <div className='page-container search-page-container'>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {searchedReviews && searchedReviews.length > 0 ? (
            <>
              <h2 className='search-page-title'>{t('search_result')}</h2>
              <InfiniteScroll
                key={infiniteScrollKey}
                dataLength={searchedReviews.length}
                next={searchReviews}
                hasMore={hasMoreReviews}
                loader={<LoadingComponent />}
                endMessage={<h3 style={{ textAlign: 'center' }}>{t('no_more_suitable')}</h3>}
              >
                {searchedReviews.map((review, id) => (
                  <div key={id} className='review-shortened-container'>
                    <ReviewShortened key={id} currentReview={review} reviewId={id} />
                  </div>
                ))}
              </InfiniteScroll>
            </>
          ) : (
            <div className='centered-without-content'>
              <h1>{t('no_found_more')}</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};
