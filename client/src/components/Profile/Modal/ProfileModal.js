import {Button, Container, Modal} from "react-bootstrap";
import React from "react";
import "../../../App.css"
import {ReviewBody} from "../../Review/ReviewBody";
import {ReviewCreateBody} from "../../Review/ReviewCreateBody";

export class MydModalWithGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHide: false,
            params: this.props.params,
            review: this.props.review,
            redactedReview: this.props.review,
            createdReview: {}
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
        this.setState({showHide: !this.state.showHide})
    }

    handleModalHide() {
        this.setState({showHide: false})
    }

    handleModalSaveChanges() {
        if (this.state.params.displayCreateReviewForm === "none") {
            this.editReview()
        } else {
            this.createNewReview()
        }
    }

    createNewReview() {
        const validationAnswer = this.validateFields(this.state.createdReview)
        if(validationAnswer.length===0) {
            console.log("Creating....")
            console.log(this.state.createdReview)
            this.setState({createdReview: this.state.createdReview})
            this.props.handleToCreate(this.state.createdReview)
        }
        else {
            console.log(validationAnswer)
        }
    }

    editReview() {
        if (this.validateFields(this.state.redactedReview)) {
            this.setState({review: this.state.redactedReview})
            this.props.handleToUpdate(this.state.redactedReview)
        } else {
            console.log('Wrong!')
        }
    }


    updateReview = (redactedReview) => {
        /**
         * especially editing this.state.redactedReview without
         * setState() to prevent rerender
         */
        this.state.redactedReview = redactedReview
    }

    updateCreatedReview = (createdReview) => {
        this.state.createdReview = createdReview
    }


    validateFields(review) {
        const errorAnswer = "Enter review "
        if(review.authorScore) {
            let score = parseInt(review?.authorScore)
            if (!Number.isInteger(score) && score > 0 && score <= 5) {
                return "Error! Wrong score! Enter score in range from 1 to 5"
            }
        }
        else {
            return "Enter review score!"
        }
        for (let key in review) {
            if (review[key] === null || review[key] == "") {
                return errorAnswer + key
            }
        }
        return ""
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
                        <Modal.Title>{this.state.params.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid">

                        <Container>

                            <div style={{display: this.state.params.displayEditAndViewForm}}>
                                <ReviewBody review={this.state.review}
                                            params={this.state.params}
                                            updateRedactedReview={this.updateReview}

                                />

                            </div>
                            <div style={{display: this.state.params.displayCreateReviewForm}}>
                                <ReviewCreateBody updateCreatedReview={this.updateCreatedReview}/>
                            </div>
                        </Container>

                    </Modal.Body>

                    <Modal.Footer style={{display: this.state.params.displayBtns}}>
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