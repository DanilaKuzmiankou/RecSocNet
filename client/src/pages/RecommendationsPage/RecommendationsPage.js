import {Button, Col, Container, Row} from "react-bootstrap";
import React, {useEffect, useLayoutEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {setIsLoading} from "../../store/reducers/LoadingSlice";
import {useDispatch, useSelector} from "react-redux";
import {LoadingComponent, ReviewShortened} from "../../components/index.components";
import {getNewestReviews} from "../../api/store/ReviewStore";
import {setNewestReviews} from "../../store/reducers/ReviewSlice";

export const RecommendationsPage = () => {

    const isAuthenticated = useAuth0()
    const dispatch = useDispatch()

    const isLoading = useSelector((state) => state.loading.isLoading)
    const newestReviews = useSelector((state) => state.review.newestReviews)

    useEffect(async () => {

        await fetchNewestReviews()

        setTimeout(async () => {
            dispatch(setIsLoading(false))
        }, 500);

    }, [isAuthenticated])


    useLayoutEffect(() => {
        return () => {
            dispatch(setIsLoading(true))
        }
    }, [])


    const fetchNewestReviews = async () => {
        let newestReviews = await getNewestReviews()

        dispatch(setNewestReviews(newestReviews))
        console.log('newest: ', newestReviews)
    }

    const ons2s =(value) =>{
        console.log('click: ', value)
    }

    return (
        <div className="recommendations_page_container">
            {
                isLoading ?
                    <LoadingComponent/>
                    :
                    <Container>
                        <Row>
                            <Col> </Col>
                            <Col sm={8}>
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
                            </Col>
                            <Col> </Col>
                        </Row>

                    </Container>
            }
        </div>
    );
}
