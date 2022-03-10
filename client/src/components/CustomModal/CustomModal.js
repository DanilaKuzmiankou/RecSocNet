import {Button, Container, Modal} from "react-bootstrap";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import "../../App.css"
import {ReviewCreateBody} from "../Review/ReviewCreateBody";
import {
    addImagesToDatabase,
    deleteImagesFromFirebaseCloud,
    uploadImagesToFirebaseCloud
} from "../../api/store/ReviewStore";
import {useDispatch, useSelector} from "react-redux";
import {LoadingComponent, Feedback} from "../index.components";
import {setIsLoading} from "../../store/reducers/LoadingSlice";
import {ReviewBody} from "../Review/ReviewBody";

export const CustomModal = forwardRef((props, ref) => {

    const editedReview = useSelector((state) => state.review.editedReview)
    const isLoading = useSelector((state) => state.loading.isLoading)
    const params = useSelector((state) => state.modal.params)
    const user = useSelector((state) => state.user.browsedUser)

    const modal = useRef();
    const dispatch = useDispatch()
    const empty = {
        title: "",
        category: "",
        tags: "",
        authorScore: "",
        text: "",
        images: []
    }

    const [showModal, setShowModal] = useState(false)
    const [emptyReview, setEmptyReview] = useState(empty)


    useImperativeHandle(ref, () => ({
        showReviewModal() {
            setShowModal(true)
        }
    }));

    const handleModalSaveChanges = async () => {
        dispatch(setIsLoading(true))
        let newReview = Object.assign({}, modal.current.save())
        if (params.displayCreateForm) {
            console.log('create: ', newReview)
            await createNewReview(newReview)
        } else {
            console.log('edit: ', newReview)
            await editReview(newReview)
        }
        dispatch(setIsLoading(false))
    }

     const uploadImagesToFirebase = async (pictures) => {
        if (pictures && pictures.length > 0) {
            const urls = await uploadImagesToFirebaseCloud(pictures)
            return urls
        }
    }

    const createNewReview = async (newReview) => {
        const validationAnswer = validateFields(newReview)
        if(validationAnswer.length===0) {
            newReview.images = await uploadImagesToFirebase(newReview.images)
            props.handleToCreate(newReview)
            setEmptyReview(empty)
            closeModal()
        }
        else {
            setEmptyReview(newReview)
            alert(validationAnswer)
            console.log(validationAnswer)
        }
    }

    const editReview = async (newReview) => {
        const validationAnswer = validateFields(newReview)
        if (validationAnswer.length === 0) {
            await uploadOrDeletePictures(newReview)
            props.handleToUpdate(newReview)
            closeModal()
        } else {
            console.log(validationAnswer)
        }
    }

    const uploadOrDeletePictures = async (newReview) => {
        const picturesToUpload = []
        const redactedPictures = []
        const allPictures = newReview.images
        allPictures.forEach(function (picture) {
            if (picture.constructor === File) {
                picturesToUpload.push(picture)
            } else {
                redactedPictures.push(picture)
            }
        })
        const picturesToDelete = editedReview.images?.filter(
            prevPicture => redactedPictures.find(
                redactedPicture => redactedPicture.imageLink === prevPicture.imageLink || redactedPicture.preview === prevPicture.imageLink ) === undefined)
        console.log('all: ', allPictures)
        console.log('upload: ', picturesToUpload)
        console.log('delete: ', picturesToDelete)
        console.log('selectedReview: ', editedReview.images)

        await deleteImagesFromFirebaseCloud(picturesToDelete)
        const picturesUrl = await uploadImagesToFirebase(picturesToUpload)
        await addImagesToDatabase(picturesUrl, editedReview.id)
    }



    const validateFields = (review) => {
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
        console.log('nice! rev: ', review)
        return ""
    }

    const closeModal = () => {
        setShowModal(false)
    }


    return (
            <div>
                {isLoading &&
                    <LoadingComponent/>
                }
                    <Modal show={showModal}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered
                           size="xl"
                           backdrop={params.backdrop}
                           keyboard={false}
                           className="no_select"
                           scrollable="true"
                           onHide={closeModal}
                    >
                        <Modal.Header style={{display:params.displayHeader}} closeButton onClick={closeModal}>
                            <Modal.Title >{params.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="show-grid">

                            <Container>
                                {params.displayEditForm &&
                                    <ReviewCreateBody
                                        review={editedReview}
                                        modeCreate={false}
                                        ref={modal}
                                    />
                                }
                                {params.displayCreateForm &&
                                    <ReviewCreateBody
                                        modeCreate={true}
                                        review={emptyReview}
                                        ref={modal}
                                    />
                                }
                                {params.displayViewForm &&
                                    <ReviewBody
                                        user={user}
                                        review={editedReview}
                                        closeModal={closeModal}
                                    />
                                }
                            </Container>
                        </Modal.Body>

                        <Modal.Footer style={{display: params.displayModalButtons}}>
                            <Button variant="secondary" onClick={closeModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleModalSaveChanges}>
                                Save Changes
                            </Button>
                        </Modal.Footer>


                        <Modal.Footer style={{display: params.displayModalFeedback, backgroundColor: "#EEF1F0"}}>
                           <Feedback review={editedReview} />
                        </Modal.Footer>

                    </Modal>

            </div>
        );
})
