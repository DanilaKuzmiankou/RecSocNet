import ReactMarkdown from "react-markdown";
import React from "react";
import "../../App.css"
import {Form} from "react-bootstrap";

export const ReviewCreateBody = () =>
{


    return(
        <div>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Title</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
                </Form.Group>

            <h1 className="review_modal_headers">Category:</h1>


            <h1 className="review_modal_headers">Tags:</h1>


            <h1 className="review_modal_headers">Score:</h1>


            <h1 className="review_modal_headers">Text:</h1>

            </Form>
        </div>
    )
}