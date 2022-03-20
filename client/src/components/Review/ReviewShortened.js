import {Col, Container, Row} from "react-bootstrap";
import StarRatings from "react-star-ratings/build/star-ratings";
import React, {useEffect, useRef, useState} from "react";
import ReactQuill from "react-quill";
import {Feedback} from "../Feedback/Feedback";
import {setEditedReview} from "../../store/reducers/ReviewSlice";
import {setModalParams} from "../../store/reducers/ModalSlice";
import {CustomModal} from "../CustomModal/CustomModal";
import {useDispatch, useSelector} from "react-redux";

export const ReviewShortened = (props) => {

    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.review.reviews)

    const [editorText, setEditorText] = useState('');
    const [currentReview, setCurrentReview] = useState('');
    const reviewsModal = useRef();

    useEffect(async () => {
        let isMounted = true;
        if (isMounted) {
            setCurrentReview(reviews[props.reviewId])
            let shortenedText = formatText(props.currentReview?.text)
            //let shortenedText = props.review?.text
            setEditorText(shortenedText)
        }
        return () => {
            isMounted = false
        };
    }, [reviews]);

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
                    <label style={{fontSize: "33px", fontStyle: "italic"}}>by </label>
                    <a
                        style={{marginLeft: '10px', fontSize: "43px"}}
                        className="review_shortened_profile_url"
                        href={'/profile/' + currentReview?.user?.id}
                    >
                        {currentReview?.user?.name}
                    </a>
                </div>

                <div onClick={() => {
                    viewReview(currentReview)
                }}>
                    <div style={{fontSize: "43px"}}>{currentReview?.title}</div>

                    <Container fluid style={{
                        paddingTop: "10px",
                        paddingBottom: "20px",
                    }}
                    >
                        <Row>
                            <Col md={"auto"}>
                                <label className="review_category">{currentReview?.category}</label>
                            </Col>
                            <Col className="tags_container">
                                <label className="review_tags">{currentReview?.tags}</label>
                            </Col>
                            <Col md={"auto"} style={{whiteSpace: "nowrap"}}>
                                <StarRatings
                                    rating={currentReview?.authorScore}
                                    starRatedColor="#ffd700"
                                    numberOfStars={5}
                                    starDimension="2rem"
                                    name='rating'
                                />
                            </Col>
                        </Row>
                    </Container>

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
                <Feedback review={currentReview}/>
            </div>

            <CustomModal
                ref={reviewsModal}
            />

        </div>
    )
}