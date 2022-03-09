import {Button, Col, Container, Row} from "react-bootstrap";
import StarRatings from "react-star-ratings/build/star-ratings";
import React from "react";
import {Like} from "./Like";
import {Comments} from "./Comments";

export const Feedback = (props) => {


    const changeRating = (rating) => {
        console.log('rating: ', rating)
    }

    return (
        <div className="d-flex align-items-end justify-content-around" >
                    <Like style={{paddingRight: "10px"}}/>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <Comments/>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <StarRatings
                        rating={0}
                        starRatedColor="#ffd700"
                        starHoverColor="#ffd700"
                        numberOfStars={5}
                        starDimension="30px"
                        changeRating={changeRating}
                        name='rating'
                    />
            <span>&nbsp;&nbsp;&nbsp;</span>
        </div>
    )
}