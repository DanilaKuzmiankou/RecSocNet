import ReactMarkdown from "react-markdown";
import React, {useEffect} from "react";
import "../../App.css"
import {UploadImage} from "../UploadImage/UploadImage";
import {Image, OverlayTrigger, Tooltip} from "react-bootstrap";

export const ReviewBody = (props) => {
    return (
        <div>
            <h1 className="review_modal_headers">Title:</h1>
            <div>
                <ReactMarkdown children={props.review?.title}/>
            </div>

            <h1 className="review_modal_headers">Category:</h1>
            <div>
                <ReactMarkdown children={props.review?.category}/>
            </div>

            <h1 className="review_modal_headers">Tags:</h1>
            <div>
                <ReactMarkdown children={props.review?.tags}/>
            </div>

            <h1 className="review_modal_headers">Score:</h1>
            <div>
                <h1 className="review_modal_headers">{props.review?.authorScore}</h1>
            </div>

            <div>
                <h1 className="review_modal_headers">User review score:</h1>
                <h1 className="review_modal_headers">{props.review?.usersReviewScore}</h1>
            </div>

            <div>
                <h1 className="review_modal_headers">User content score:</h1>
                <h1 className="review_modal_headers">{props.review?.usersContentScore}</h1>
            </div>

            <h1 className="review_modal_headers">Text:</h1>
            <div>
                <ReactMarkdown children={props.review?.text}/>
            </div>
            <h1 className="review_modal_headers">Images:</h1>

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
    )
}