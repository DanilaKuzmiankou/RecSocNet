import { useSearchParams } from 'react-router-dom';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { findReviews } from '../../api/store/ReviewStore';
import { Col, Container, Row } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingComponent, ReviewShortened } from '../../components/index.components';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews } from '../../store/reducers/ReviewSlice';
import { setIsLoading } from '../../store/reducers/LoadingSlice';

export const SearchPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [rowSelectionRate, setRowSelectionRate] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [searchedReviews, setSearchedReviews] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [infiniteScrollKey, setInfiniteScrollKey] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(async () => {
    if (searchParams) {
      await searchReviews(true);
      setInfiniteScrollKey(Math.random());
    }
    setTimeout(async () => {
      dispatch(setIsLoading(false));
    }, 500);
  }, [searchParams, currentUser]);

  useLayoutEffect(() => {
    return () => {
      dispatch(setIsLoading(true));
    };
  }, []);

  const searchReviews = async (reRenderFlag) => {
    let rowSelection = rowSelectionRate;
    let prevReviews = searchedReviews;
    if (reRenderFlag) {
      rowSelection = 0;
      prevReviews = [];
      setRowSelectionRate(rowSelection);
      setSearchedReviews(prevReviews);
      setHasMoreReviews(true);
    }
    console.log(
      'params: ',
      'rowSelection: ',
      rowSelection,
      'searchParams',
      searchParams.get('search'),
      'currentUser:',
      currentUser.id
    );
    const searchedReviewsFromApi = await findReviews(
      10,
      rowSelection * 10,
      searchParams.get('search'),
      currentUser.id
    );
    console.log('searched:', searchedReviewsFromApi);
    if (searchedReviewsFromApi.length !== 0) {
      const resultNewestReviews = [...prevReviews, ...searchedReviewsFromApi];
      setSearchedReviews(resultNewestReviews);
      dispatch(setReviews(resultNewestReviews));
      setRowSelectionRate((rowSelectionRate) => rowSelectionRate + 1);
      if (searchedReviewsFromApi.length < 10) {
        console.log('end!');
        setHasMoreReviews(false);
      }
    }
  };

  return (
    <div className='search_page_container'>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div>
          {searchedReviews && searchedReviews.length > 0 ? (
            <div>
              <div className='search_page_title'>Search result:</div>
              <Container className='cont'>
                <Row>
                  <Col> </Col>
                  <Col sm={8}>
                    <InfiniteScroll
                      key={infiniteScrollKey}
                      dataLength={searchedReviews.length}
                      next={searchReviews}
                      hasMore={hasMoreReviews}
                      loader={<LoadingComponent />}
                      endMessage={
                        <h3 style={{ textAlign: 'center' }}>
                          There is no more suitable reviews...
                        </h3>
                      }
                    >
                      {searchedReviews.map((review, id) => (
                        <div key={id} className='review_shortened_container'>
                          <ReviewShortened key={id} currentReview={review} reviewId={id} />
                        </div>
                      ))}
                    </InfiniteScroll>
                  </Col>
                  <Col> </Col>
                </Row>
              </Container>
            </div>
          ) : (
            <div className='center_without_content'>
              <h1>Sorry, we have not found anything!</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
