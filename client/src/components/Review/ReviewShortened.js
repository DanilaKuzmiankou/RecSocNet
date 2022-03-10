import {Col, Container, Row} from "react-bootstrap";
import StarRatings from "react-star-ratings/build/star-ratings";
import React, {useEffect, useRef, useState} from "react";
import ReactQuill from "react-quill";
import {Feedback} from "../Feedback/Feedback";
import {setEditedReview} from "../../store/reducers/ReviewSlice";
import {setModalParams} from "../../store/reducers/ModalSlice";
import {CustomModal} from "../CustomModal/CustomModal";
import {useDispatch} from "react-redux";

export const ReviewShortened = (props) => {

    const dispatch = useDispatch()
    const [editorText, setEditorText] = useState('');
    const reviewsModal = useRef();

    useEffect(async () => {
        let isMounted = true;
        if (isMounted) {
            let shortenedText = formatText(props.review?.text)
            //let shortenedText = props.review?.text
            setEditorText(shortenedText)
        }
        return () => {
            isMounted = false
        };
    }, []);

    const formatText = (text) => {
        text = text.substring(0, process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH)
        if (text.length >= process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH) {
            return (text + "... <p>&nbsp;</p><strong><em>Click to read more!</em></strong>")
        } else {
            return text
        }
    }

    const viewReview = (review) => {
        if (Object.keys(review).length !== 0) {
            dispatch(setEditedReview(review))
            dispatch(setModalParams({
                title: "Review View",
                displayModalButtons: "none",
                displayModalFeedback: "",
                displayCreateForm: false,
                displayEditForm: false,
                displayViewForm: true,
                displayHeader: "none",
                backdrop: "true"
            }))
            reviewsModal?.current.showReviewModal()
        }
    }

    return (
        <div>
            <div
                style={{
                padding: "30px",
                backgroundColor: "white"
            }}
            >
                <div className="form-group form-inline">
                    <label style={{fontSize: "13px", fontStyle: "italic"}}>by </label>
                    <a
                        className="review_shortened_profile_url"
                        href={'/profile/' + props.review.user?.id}
                    >
                        {props.review.user?.name}
                    </a>
                </div>

                <div onClick={() => {viewReview(props.review)}}>
                <h1>{props.review?.title}</h1>

                <div style={{
                    paddingTop: "10px",
                    paddingBottom: "20px",
                }}
                >
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
                        value={editorText}
                    />
                </div>
                </div>
            </div>
            <div className="review_shortened_feedback_container">
                <Feedback review={props.review}/>
            </div>

            <CustomModal
                ref={reviewsModal}
            />
        </div>
    )
}