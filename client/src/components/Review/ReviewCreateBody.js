import ReactMarkdown from "react-markdown";
import React from "react";
import "../../App.css"

export const ReviewCreateBody = (props) =>
{


    return(
        <div>
            <h1 className="review_modal_headers">Title:</h1>


            <h1 className="review_modal_headers">Category:</h1>


            <h1 className="review_modal_headers">Tags:</h1>


            <h1 className="review_modal_headers">Score:</h1>


            <h1 className="review_modal_headers">Text:</h1>

        </div>
    )
}