import ReactMarkdown from "react-markdown";
import React from "react";
import "../../App.css"

export const ReviewBody = (props) =>
{
    let redactedReview = props.review

    function updateRedactedReview(){
            props.updateRedactedReview(redactedReview);
    }

    return(
        <div>
        <h1 className="review_modal_headers">Title:</h1>
    <div contentEditable={props.params.editable} suppressContentEditableWarning={true} onInput={e => {
        redactedReview.title = e.currentTarget.textContent
        updateRedactedReview()
    }}>
        <ReactMarkdown children={props.review?.title} />
    </div>

    <h1 className="review_modal_headers">Category:</h1>
    <div contentEditable={props.params.editable} suppressContentEditableWarning={true} onInput={e => {
        redactedReview.category = e.currentTarget.textContent
        updateRedactedReview()
    }}>
        <ReactMarkdown children={props.review?.category} />
    </div>

    <h1 className="review_modal_headers">Tags:</h1>
    <div contentEditable={props.params.editable} suppressContentEditableWarning={true} onInput={e => {
        redactedReview.tags = e.currentTarget.textContent
        updateRedactedReview()
    }}>
        <ReactMarkdown children={props.review?.tags} />
    </div>

    <h1 className="review_modal_headers">Score:</h1>
    <div contentEditable={props.params.editable} suppressContentEditableWarning={true} onInput={e => {
        redactedReview.authorScore = e.currentTarget.textContent
        updateRedactedReview()
    }}>
        <h1 className="review_modal_headers">{redactedReview?.authorScore}</h1>
    </div>

            <div style={{display:props.params.displayScore}}>
            <h1 className="review_modal_headers">User review score:</h1>
            <h1 className="review_modal_headers">{redactedReview?.usersReviewScore}</h1>
            </div>

            <div style={{display:props.params.displayScore}}>
                <h1 className="review_modal_headers">User content score:</h1>
                <h1 className="review_modal_headers">{redactedReview?.usersContentScore}</h1>
            </div>

    <h1 className="review_modal_headers">Text:</h1>
    <div contentEditable={props.params.editable} suppressContentEditableWarning={true} onInput={e => {
        redactedReview.text = e.currentTarget.textContent
        updateRedactedReview()
    }}>
        <ReactMarkdown children={props.review?.text} />
    </div>
        </div>
    )
}