import {Button, Col, Container, Row} from "react-bootstrap";
import StarRatings from "react-star-ratings/build/star-ratings";
import React, {useEffect, useState} from "react";
import {Like} from "./Like";
import {Comments} from "./Comments";

export const Feedback = (props) => {

    const [rating, setRating] = useState(0)
    const [review, setReview] = useState({})

    useEffect(() => {
        setReview(props.review)
    }, [props])

    const changeRating = (rating) => {
        console.log('rating: ', rating)
        setRating(rating)
    }

    return (
        <div className="d-flex align-items-end justify-content-around" >
                    <span style={{fontSize:'30px'}}>
                    {review.usersReviewScore}
                        &nbsp;
                    </span>
                    <Like
                        review={props.review}
                        updateReview={(newReview) => setReview(newReview)}
                    />
                    <span>&nbsp;&nbsp;</span>
                    <Comments/>
                    <span>&nbsp;&nbsp;</span>
            <div className="feedback_rating">
                    <StarRatings
                        rating={rating}
                        starRatedColor="#ffd700"
                        starHoverColor="#ffd700"
                        numberOfStars={5}
                        starDimension="30px"
                        changeRating={changeRating}
                        name='rating'
                    />
            </div>
        </div>
    )
}