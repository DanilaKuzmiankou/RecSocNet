import {Col, Container, Row} from "react-bootstrap";
import StarRatings from "react-star-ratings/build/star-ratings";
import React, {useEffect, useState} from "react";
import ReactQuill from "react-quill";

export const ReviewShortened = (props) => {

    const [editorText, setEditorText] = useState('');

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
            return (text + "... *Click to read more!*")
        } else {
            return text
        }
    }

    return (
        <div style={{padding: "15px"
        }} >
            <div className="form-group form-inline">
                <label style={{fontSize: "13px", fontStyle: "italic"}}>by </label>
                <label style={{
                    fontSize: "22px",
                    display: 'inline-block',
                    marginLeft: "7px"
                }}
                >
                    {props.user?.name}
                </label>
            </div>

            <h1>{props.review?.title}</h1>

            <Container style={{
                paddingTop: "10px",
                paddingBottom: "20px"
            }}>
                <Row>
                    <Col md="auto">
                        <label className="review_category">{props.review?.category}</label>
                    </Col>

                    <Col md="auto">
                        <label className="review_tags">{props.review?.tags}</label>
                    </Col>

                    <Col md={{span: 0, offset: 7}}>
                        <StarRatings
                            rating={props.review?.authorScore}
                            starRatedColor="#ffd700"
                            numberOfStars={5}
                            starDimension="30px"
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
    )
}