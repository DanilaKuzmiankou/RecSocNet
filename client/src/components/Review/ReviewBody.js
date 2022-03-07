import React, {useEffect, useState} from "react";
import "../../App.css"
import {Col, Container, Image, Row} from "react-bootstrap";
import {Editor} from "react-draft-wysiwyg";
import EditorState from "draft-js/lib/EditorState";
import {convertFromRaw} from "draft-js";
import {markdownToDraft} from "markdown-draft-js";
import StarRatings from "react-star-ratings/build/star-ratings";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const ReviewBody = (props) => {

    fontawesome.library.add(faArrowLeft);

    const [editorState, setEditorState] = useState(undefined)

    useEffect(async () => {
        let isMounted = true;
        if (isMounted) {
            setEditorState(EditorState.createWithContent(convertFromRaw(markdownToDraft(props.review?.text))))
        }
        return () => {
            isMounted = false
        };
    }, []);

    const closeModal = () =>{
        props.closeModal()
    }

    return (
        <Container fluid>
            <Row>
                <Col>
            <FontAwesomeIcon size="lg"
                             icon="fa-solid fa-arrow-left"
                             onClick={closeModal}
            />

            <div style={{padding: "15px"}}>
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
                    <Editor
                        toolbarHidden
                        editorState={editorState}
                        readOnly={true}
                    />
                </div>

                {props.review?.images.map((image, index) => (
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
                </Col>
            </Row>
        </Container>
    )
}