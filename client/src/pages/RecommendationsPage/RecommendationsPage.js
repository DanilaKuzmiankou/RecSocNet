import { Col, Container, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { setIsLoading } from '../../store/reducers/LoadingSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  LoadingComponent,
  RecommendationsMenu,
  ReviewShortened,
} from '../../components/index.components';
import {
  getMostLikedReviews,
  getNewestReviews,
  getTagReviews,
  getTags,
} from '../../api/store/ReviewStore';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  setIsNewReviewsClicked,
  setIsTopReviewsClicked,
  setReviews,
} from '../../store/reducers/ReviewSlice';
import { TagCloud } from 'react-tagcloud';

export const RecommendationsPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const { currentUser, currentUserTheme } = useSelector((state) => state.user);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [infiniteScrollKey, setInfiniteScrollKey] = useState(0);
  const [fetchFunction, setFetchFunction] = useState('fetchNewestReviews');
  const [rowSelectionRate, setRowSelectionRate] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');

  useEffect(() => {
    dispatch(setIsLoading(true));
    document.body.setAttribute('data-theme', currentUserTheme);
    async function fetchData() {
      await fetchNewestReviews();
      await initTags();
      dispatch(setIsLoading(false));
    }
    fetchData();
  }, []);

  const initTags = async () => {
    let tags = await getTags();
    tags = tags.map((tag) => Object.create({ value: tag, count: Math.random() * 100 }));
    setTags(tags);
  };

  const fetchNewestReviews = async () => {
    const newestReviewsFromApi = await getNewestReviews(10, rowSelectionRate * 10, currentUser.id);
    if (newestReviewsFromApi.length !== 0) {
      const resultNewestReviews = [...currentReviews, ...newestReviewsFromApi];
      setCurrentReviews(resultNewestReviews);
      dispatch(setReviews(resultNewestReviews));
      setRowSelectionRate((rowSelectionRate) => rowSelectionRate + 1);
    } else {
      setHasMoreReviews(false);
    }
  };

  const fetchMostLikedReviews = async () => {
    const mostLikedReviewsFromApi = await getMostLikedReviews(
      10,
      rowSelectionRate * 10,
      currentUser.id
    );
    if (mostLikedReviewsFromApi.length !== 0) {
      const resultMostLikedReviews = [...currentReviews, ...mostLikedReviewsFromApi];
      setCurrentReviews(resultMostLikedReviews);
      dispatch(setReviews(resultMostLikedReviews));
      setRowSelectionRate((rowSelectionRate) => rowSelectionRate + 1);
    } else {
      setHasMoreReviews(false);
    }
  };

  const fetchTagReviews = async () => {
    const tagReviewsFromApi = await getTagReviews(10, rowSelectionRate * 10, currentUser.id, tag);
    if (tagReviewsFromApi.length !== 0) {
      const resultTagReviews = [...currentReviews, ...tagReviewsFromApi];
      setCurrentReviews(resultTagReviews);
      dispatch(setReviews(resultTagReviews));
      setRowSelectionRate((rowSelectionRate) => rowSelectionRate + 1);
    } else {
      setHasMoreReviews(false);
    }
  };

  const refreshInfiniteScroll = (reviews) => {
    setRowSelectionRate((rate) => 1);
    setCurrentReviews(reviews);
    dispatch(setReviews(reviews));
    setInfiniteScrollKey(Math.random());
    setHasMoreReviews(true);
    dispatch(setIsLoading(false));
  };

  const refreshNewestReviews = async () => {
    dispatch(setIsLoading(true));
    setFetchFunction((fetchFunction) => 'fetchNewestReviews');
    const newestReviewsFromApi = await getNewestReviews(10, 0, currentUser.id);
    refreshInfiniteScroll(newestReviewsFromApi);
  };

  const refreshMostLikedReviews = async () => {
    dispatch(setIsLoading(true));
    setFetchFunction((fetchFunction) => 'fetchMostLikedReviews');
    const mostLikedReviewsFromApi = await getMostLikedReviews(10, 0, currentUser.id);
    refreshInfiniteScroll(mostLikedReviewsFromApi);
  };

  const refreshTagReviews = async (tag) => {
    dispatch(setIsLoading(true));
    setFetchFunction((fetchFunction) => 'fetchTagReviews');
    const tagReviewsFromApi = await getTagReviews(10, 0, currentUser.id, tag);
    refreshInfiniteScroll(tagReviewsFromApi);
  };

  const fetchReviews = () => {
    switch (fetchFunction) {
      case 'fetchNewestReviews':
        fetchNewestReviews();
        break;
      case 'fetchMostLikedReviews':
        fetchMostLikedReviews();
        break;
      case 'fetchTagReviews':
        fetchTagReviews();
        break;
    }
  };

  const findTagReviews = (tag) => {
    dispatch(setIsNewReviewsClicked(false));
    dispatch(setIsTopReviewsClicked(false));
    setTag(tag);
    refreshTagReviews(tag);
  };

  const customRenderer = (tag, size, color) => (
    <span
      key={tag.value}
      style={{
        fontSize: `${size / 2}em`,
        margin: '3px',
        padding: '3px',
        display: 'inline-block',
        color: `${color}`,
      }}
    >
      {tag.value}
    </span>
  );

  const options = {
    luminosity: 'bright',
    hue: 'purple',
  };

  return (
    <div className='recommendations-page-container no-select'>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Container>
          <Row>
            <Col> </Col>
            <Col sm={7}>
              <InfiniteScroll
                key={infiniteScrollKey}
                dataLength={currentReviews.length}
                next={fetchReviews}
                hasMore={hasMoreReviews}
                loader={<LoadingComponent />}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                {currentReviews.map((review, id) => (
                  <div key={id} className='review-shortened-container'>
                    <ReviewShortened key={id} currentReview={review} reviewId={id} />
                  </div>
                ))}
              </InfiniteScroll>
            </Col>
            <Col>
              <div style={{ position: 'sticky', top: '10px' }}>
                <RecommendationsMenu
                  refreshNewestReviews={refreshNewestReviews}
                  refreshMostLikedReviews={refreshMostLikedReviews}
                />
                <div className='tags-cloud-container'>
                  <TagCloud
                    minSize={2}
                    maxSize={5}
                    shuffle={false}
                    tags={tags}
                    colorOptions={options}
                    renderer={customRenderer}
                    onClick={(tag) => findTagReviews(tag.value)}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};
