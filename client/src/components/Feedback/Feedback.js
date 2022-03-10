import {Button, Col, Container, Row} from "react-bootstrap";
import StarRatings from "react-star-ratings/build/star-ratings";
import React, {useState} from "react";
import {Like} from "./Like";
import {Comments} from "./Comments";

export const Feedback = (props) => {

    const [rating, setRating] = useState(0)

    const changeRating = (rating) => {
        console.log('rating: ', rating)
        setRating(rating)
    }

    return (
        <div className="d-flex align-items-end justify-content-around" >
                    <Like style={{paddingRight: "10px"}}/>
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