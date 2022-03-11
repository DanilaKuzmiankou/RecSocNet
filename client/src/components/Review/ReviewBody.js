import React, {useEffect, useState} from "react";
import "../../App.css"
import {Col, Container, Image, Row} from "react-bootstrap";
import StarRatings from "react-star-ratings/build/star-ratings";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";

export const ReviewBody = (props) => {

    fontawesome.library.add(faArrowLeft);


    const closeModal = () => {
        props.closeModal()
    }

    return (
        <div>
            <FontAwesomeIcon size="lg"
                             icon="fa-solid fa-arrow-left"
                             onClick={closeModal}
            />
        <Container fluid>

                    <div className="review_container">
                        <div className="form-group form-inline">
                            <label style={{fontSize: "13px", fontStyle: "italic"}}>by </label>
                            <label style={{
                                fontSize: "22px",
                                display: 'inline-block',
                                marginLeft: "7px"
                            }}>
                                {props.review.user?.name}
                            </label>
                        </div>

                        <h1>{props.review?.title}</h1>

                        <div style={{
                            paddingTop: "10px",
                            paddingBottom: "20px",
                        }}>
                            <label className="review_category">{props.review?.category}</label>
                            <label className="review_tags">{props.review?.tags}</label>
                            <div className="review_rating_container">
                                <StarRatings

                                    rating={props.review?.authorScore}
                                    starRatedColor="#ffd700"
                                    numberOfStars={5}
                                    starDimension="30px"
                                    name='rating'
                                />
                            </div>
                        </div>


                        <div>
                            <ReactQuill
                                theme={null}
                                readOnly={true}
                                defaultValue={props.review?.text}
                            />
                        </div>

                        {props.review?.images?.map((image, index) => (
                            <div className="thumb" key={index}>
                                <div className="thumbInner">
                                    <Image
                                        src={image.imageLink}
                                        className="review_img"
                                    />
                                </div>
                            </div>
                        ))
                        }

                    </div>

        </Container>
        </div>
    )
}