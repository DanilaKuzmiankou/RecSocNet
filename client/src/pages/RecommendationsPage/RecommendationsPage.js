import {Button, Col, Container, Row} from "react-bootstrap";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {setIsLoading} from "../../store/reducers/LoadingSlice";
import {useDispatch, useSelector} from "react-redux";
import {LoadingComponent, ReviewShortened} from "../../components/index.components";
import {getNewestReviews} from "../../api/store/ReviewStore";
import InfiniteScroll from "react-infinite-scroll-component";
import {getUserByAuthId, registerNewUser} from "../../api/store/UserStore";
import {setCurrentUser} from "../../store/reducers/UserSlice";


export const RecommendationsPage = () => {

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0()
    const dispatch = useDispatch()

    const isLoading = useSelector((state) => state.loading.isLoading)
    const currentUser = useSelector((state) => state.user.currentUser)

    const [newestReviews, setNewestReviews] = useState([])
    const [infiniteScrollKey, setInfiniteScrollKey] = useState(0)


    const [rowSelectionRate, setRowSelectionRate] = useState(0)
    const [hasMoreReviews, setHasMoreReviews] = useState(true)



    useEffect(async () => {
            await  fetchNewestReviews()
        setTimeout(async () => {
            dispatch(setIsLoading(false))
        }, 500);

    }, [])

    useEffect(async () => {
        let lenRev = newestReviews.length
        if(lenRev>0 && Object.keys(currentUser).length !== 0){
            console.log('len:', lenRev)
            const newestReviewsFromApi = await getNewestReviews(lenRev,0, currentUser.id)
            console.log('Reloaded: ', newestReviewsFromApi)
            setNewestReviews(newestReviewsFromApi)
            setInfiniteScrollKey(Math.random())
        }
    }, [currentUser])

    useLayoutEffect(() => {
        return () => {
            dispatch(setIsLoading(true))
        }
    }, [])


    const fetchNewestReviews = async () => {
        console.log('rowSelectionRate ', rowSelectionRate)
        console.log('newest rev ', newestReviews)
        console.log('currentUser.id ', currentUser?.id)
        const newestReviewsFromApi = await getNewestReviews(10, rowSelectionRate * 10, currentUser.id)
        console.log('new reviews: ', newestReviewsFromApi)
        if (newestReviewsFromApi.length !== 0) {
            let resultNewestReviews = [...newestReviews, ...newestReviewsFromApi]
            setNewestReviews(resultNewestReviews)
            setRowSelectionRate(rowSelectionRate => rowSelectionRate + 1)
        } else {
            setHasMoreReviews(false)
        }

    }


    return (
        <div className="recommendations_page_container">
            {
                isLoading ?
                    <LoadingComponent/>
                    :
                    <Container className="cont">
                        <Row>
                            <Col><Button onClick={() => setNewestReviews([])}>OOOOO</Button> </Col>
                            <Col sm={8}>
                                <InfiniteScroll
                                    key={infiniteScrollKey}
                                    dataLength={newestReviews.length}
                                    next={fetchNewestReviews}
                                    hasMore={hasMoreReviews}
                                    loader={<LoadingComponent/>}
                                    endMessage={
                                        <p style={{textAlign: "center"}}>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    }
                                >
                                    {newestReviews.map((review, id) => (
                                        <div
                                            key={id}
                                            className="review_shortened_container">
                                            <ReviewShortened
                                                key={id}
                                                review={review}
                                            />
                                        </div>
                                    ))}
                                </InfiniteScroll>
                            </Col>
                            <Col> </Col>
                        </Row>

                    </Container>
            }
        </div>
    );
}
