import {Button, Container, Modal} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import React from "react";
import "../../../App.css"

export class MydModalWithGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHide : false,
            review: this.props.review,
            redactedReview: this.props.review,
            handleToUpdate : this.props.handleToUpdate
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.review !== prevProps.review) {
            this.setState({review: this.props.review})
        }
    }

    handleModalShowHide() {
        this.setState({ showHide: !this.state.showHide })
    }

    handleModalHide() {
        this.setState({ showHide: false })
    }

    handleModalSaveChanges() {
        console.log('modal saved id',this.state.redactedReview.id )
        this.setState({review: this.state.redactedReview})
        this.state.handleToUpdate(this.state.redactedReview)
    }


    render() {


        return (
            <div>
            <Modal show={this.state.showHide}
                   ref={n => this.node = n}
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
            >
                <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                    <Modal.Title >Review editing</Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">

                    <Container>

                        <h1 className="review_modal_headers">Title:</h1>
                        <div contentEditable="true" suppressContentEditableWarning={true} onInput={e => {
                            this.state.redactedReview.title = e.currentTarget.textContent
                        }}>
                            <ReactMarkdown children={this.state.review.title} />
                        </div>

                        <h1 className="review_modal_headers">Category:</h1>
                        <div contentEditable="true" suppressContentEditableWarning={true} onInput={e => {
                            this.state.redactedReview.category = e.currentTarget.textContent
                        }}>
                            <ReactMarkdown children={this.state.review.category} />
                        </div>

                        <h1 className="review_modal_headers">Tags:</h1>
                        <div contentEditable="true" suppressContentEditableWarning={true} onInput={e => {
                            this.state.redactedReview.tags = e.currentTarget.textContent
                        }}>
                            <ReactMarkdown children={this.state.review.tags} />
                        </div>

                        <h1 className="review_modal_headers">Score:</h1>
                        <div contentEditable="true" suppressContentEditableWarning={true} onInput={e => {
                            this.state.redactedReview.authorScore = e.currentTarget.textContent
                        }}>
                            <h1 className="review_modal_headers">{this.state.redactedReview.authorScore}</h1>
                        </div>

                        <h1 className="review_modal_headers">Text:</h1>
                        <div contentEditable="true" suppressContentEditableWarning={true} onInput={e => {
                            this.state.redactedReview.text = e.currentTarget.textContent
                        }}>
                            <ReactMarkdown children={this.state.review.text} />
                        </div>



                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleModalHide()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.handleModalSaveChanges()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        );

    }

}