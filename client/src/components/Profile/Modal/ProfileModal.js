import {Button, Container, Modal} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import React from "react";
import "../../../App.css"
import {ReviewBody} from "../../Review/ReviewBody";
import {ReviewCreateBody} from "../../Review/ReviewCreateBody";

export class MydModalWithGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHide : false,
            params: this.props.params,
            review: this.props.review,
            redactedReview: this.props.review,
            handleToUpdate : this.props.handleToUpdate
        };

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.review !== prevProps.review) {
            this.setState({review: this.props.review})
        }
        if (this.props.params !== prevProps.params) {
            this.setState({params: this.props.params})
        }
    }

    handleModalShowHide() {
        this.setState({ showHide: !this.state.showHide })
    }

    handleModalHide() {
        this.setState({ showHide: false })
    }

    handleModalSaveChanges() {

        if(this.validateFields(this.state.redactedReview)) {
            this.setState({review: this.state.redactedReview})
            this.state.handleToUpdate(this.state.redactedReview)
        }
        else{
            console.log('Wrong!')
        }
    }

    updateReview = (redactedReview) => {
        /**
         * especially editing this.state.redactedReview without
         * setState() to prevent rerender
         */
        this.state.redactedReview=redactedReview
    }


    validateFields(redactedReview){

        let score = parseInt(redactedReview.authorScore)
        return Number.isInteger(score) && score > 0 && score <= 5;
    }


    render() {
        return (
            <div>
            <Modal show={this.state.showHide}
                   ref={n => this.node = n}
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   size="xl"
                   backdrop="static"
                   keyboard={false}
                   className="no_select"
                   scrollable="true"
            >
                <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                    <Modal.Title >{this.state.params.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">

                    <Container>

                        <div style={{display:this.state.params.displayEditAndViewForm}}>
                       <ReviewBody review={this.state.review}
                                   params={this.state.params}
                                   updateRedactedReview={this.updateReview}

                       />

                        </div>
                        <div style={{display:this.state.params.displayCreateReviewForm}}>
                        <ReviewCreateBody />
                        </div>
                    </Container>

                </Modal.Body>

                <Modal.Footer style={{display:this.state.params.displayBtns}} >
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