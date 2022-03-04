import {Button, Container, Modal} from "react-bootstrap";
import React, {useRef} from "react";
import "../../../App.css"
import {ReviewBody} from "../../Review/ReviewBody";
import {ReviewCreateBody} from "../../Review/ReviewCreateBody";
import {
    addImagesToDatabase,
    deleteImagesFromFirebaseCloud,
    uploadImagesToFirebaseCloud
} from "../../../store/ReviewStore";

export class MydModalWithGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHide: false,
            params: this.props.params,
            review: this.props.review,
            redactedReview: this.props.review,
            reviewImages: this.props.images,
            emptyReview: {
                title: "",
                category: "",
                tags: "",
                authorScore: "",
                text: "",
                images: []
            }
        };
    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.review !== prevProps.review) {
            this.setState({review: this.props.review})
        }
        if (this.props.images !== prevProps.images) {
            this.setState({images: this.props.images})
        }
        if (this.props.params !== prevProps.params) {
            this.setState({params: this.props.params})
        }
    }

    handleModalShowHide() {
        this.setState({showHide: !this.state.showHide})
        console.log('rev!!', this.state.review)
    }

    handleModalHide() {
        this.setState({showHide: false})
    }

    handleModalSaveChanges() {
        if (this.state.params.displayCreateForm) {
            this.createNewReview()

        } else {
            this.editReview()
        }
    }

    async uploadImagesToFirebase() {
        if (this.state.redactedReview.images && this.state.redactedReview.images.length > 0) {
            const urls = await uploadImagesToFirebaseCloud(this.state.redactedReview.images)
            this.state.redactedReview.images = urls
        }
    }

    async createNewReview() {
        const validationAnswer = this.validateFields(this.state.redactedReview)
        if(validationAnswer.length===0) {
            await this.uploadImagesToFirebase()
            this.props.handleToCreate(this.state.redactedReview)
            this.handleModalHide()
        }
        else {
            console.log(validationAnswer)
        }
    }

    async editReview() {
        const validationAnswer = this.validateFields(this.state.redactedReview)
        if (validationAnswer.length === 0) {
            await this.uploadOrDeletePictures()
            this.setState({review: this.state.redactedReview})
            this.props.handleToUpdate(this.state.redactedReview)
            this.handleModalHide()
        } else {
            console.log(validationAnswer)
        }
    }

    async uploadOrDeletePictures() {
        const picturesToUpload = []
        const redactedPictures = []
        const allPictures = this.state.redactedReview.images
        allPictures.forEach(function (picture) {
            if (picture.constructor === File) {
                picturesToUpload.push(picture)
            } else {
                redactedPictures.push(picture)
            }
        })
        const picturesToDelete = this.state.images.filter(
            prevPicture => redactedPictures.find(
                redactedPicture => redactedPicture.preview === prevPicture.imageLink) === undefined)
        await deleteImagesFromFirebaseCloud(picturesToDelete)
        const picturesUrl = await uploadImagesToFirebaseCloud(picturesToUpload)
        await addImagesToDatabase(picturesUrl, this.state.redactedReview.id)
    }

    updateReview = (redactedReview) => {
        /**
         * especially editing this.state.redactedReview without
         * setState() to prevent rerender
         */
        this.state.redactedReview = redactedReview
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
        //checking if all required (all fields except of images) are filled, return error if it isn't
        for (let key in review) {
            if (review[key] === null || review[key] == "") {
                if(key!=="images" && key!=="usersReviewScore" && key!=="usersContentScore") {
                    console.log('catch!',key)
                    return errorAnswer + key
                }
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
                            {/**
                                <div style={{display: this.state.params.displayEditAndViewForm}}>
                                    <ReviewBody review={this.state.review}
                                                params={this.state.params}
                                                updateRedactedReview={this.updateReview}

                                    />
                                </div>
                            **/}
                            {this.state.params.displayEditForm ?
                                <div>
                                    <ReviewCreateBody
                                        review={this.state.review}
                                        params={this.state.params}
                                        updateRedactedReview={this.updateReview}

                                    />
                                </div>

                                :

                                <div>
                                    <ReviewCreateBody
                                        updateRedactedReview={this.updateReview}
                                        review={this.state.emptyReview}

                                    />
                                </div>
                            }

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