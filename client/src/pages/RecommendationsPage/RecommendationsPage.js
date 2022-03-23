import { Col, Container, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { setIsLoading } from '../../store/reducers/LoadingSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  LoadingComponent,
  ReviewShortened,
  ToolsContainer,
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
  const currentUser = useSelector((state) => state.user.currentUser);

  const [currentReviews, setCurrentReviews] = useState([]);
  const [infiniteScrollKey, setInfiniteScrollKey] = useState(0);
  const [fetchFunction, setFetchFunction] = useState('fetchNewestReviews');

  const [rowSelectionRate, setRowSelectionRate] = useState(0);

  const [hasMoreReviews, setHasMoreReviews] = useState(true);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');

  useEffect(async () => {
    await fetchNewestReviews();
    const tags = await getTags();
    const tagsObj = [];
    tags.map((tag) => tagsObj.push(Object.create({ value: tag, count: Math.random() * 100 })));
    setTags(tagsObj);
    dispatch(setIsLoading(false));
  }, []);

  const fetchNewestReviews = async () => {
    console.log('current user: ', currentUser);
    const newestReviewsFromApi = await getNewestReviews(10, rowSelectionRate * 10, currentUser.id);
    console.log('newest rev: ', newestReviewsFromApi);
    if (newestReviewsFromApi.length !== 0) {
      const resultNewestReviews = [...currentReviews, ...newestReviewsFromApi];
      console.log('result rev: ', resultNewestReviews);
      setCurrentReviews(resultNewestReviews);
      dispatch(setReviews(resultNewestReviews));
      setRowSelectionRate((rowSelectionRate) => rowSelectionRate + 1);
    } else {
      setHasMoreReviews(false);
    }
  };

  const fetchMostLikedReviews = async () => {
    console.log('rate: ', rowSelectionRate);
    const mostLikedReviewsFromApi = await getMostLikedReviews(
      10,
      rowSelectionRate * 10,
      currentUser.id
    );
    console.log('mostLikedReviewsFromApi rev: ', mostLikedReviewsFromApi);
    if (mostLikedReviewsFromApi.length !== 0) {
      const resultMostLikedReviews = [...currentReviews, ...mostLikedReviewsFromApi];
      console.log('result rev: ', resultMostLikedReviews);
      setCurrentReviews(resultMostLikedReviews);
      dispatch(setReviews(resultMostLikedReviews));
      setRowSelectionRate((rowSelectionRate) => rowSelectionRate + 1);
    } else {
      setHasMoreReviews(false);
    }
  };

  const fetchTagReviews = async () => {
    const tagReviewsFromApi = await getTagReviews(10, rowSelectionRate * 10, currentUser.id, tag);
    console.log('tagReviewsFromApi rev: ', tagReviewsFromApi);
    if (tagReviewsFromApi.length !== 0) {
      const resultTagReviews = [...currentReviews, ...tagReviewsFromApi];
      console.log('result rev: ', resultTagReviews);
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
    console.log('tag', tag);
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
    console.log('tag', tag.value);
    dispatch(setIsNewReviewsClicked(false));
    dispatch(setIsTopReviewsClicked(false));
    setTag(tag);
    refreshTagReviews(tag);
  };

  return (
    <div className='recommendations_page_container'>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Container>
          <Row>
            <Col> </Col>
            <Col sm={8}>
              <div className='tags_cloud_container'>
                <TagCloud
                  minSize={30}
                  maxSize={75}
                  tags={tags}
                  onClick={(tag) => findTagReviews(tag.value)}
                />
              </div>
              <ToolsContainer
                refreshNewestReviews={refreshNewestReviews}
                refreshMostLikedReviews={refreshMostLikedReviews}
              />
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
                  <div key={id} className='review_shortened_container'>
                    <ReviewShortened key={id} currentReview={review} reviewId={id} />
                  </div>
                ))}
              </InfiniteScroll>
            </Col>
            <Col> </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};
