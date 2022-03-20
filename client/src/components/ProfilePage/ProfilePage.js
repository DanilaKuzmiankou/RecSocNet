import {useAuth0} from '@auth0/auth0-react'
import React, {Fragment, useEffect, useRef, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {CustomBootstrapTable, CustomModal, LoadingComponent, LogInButton, UserProfile} from "../index.components";
import {getUserById} from "../../api/store/UserStore";
import {useParams} from "react-router-dom";
import {
    deleteImagesFromFirebaseCloud,
    deleteUserReview,
    getUserReviews,
    saveEditedReview,
    saveNewReview
} from "../../api/store/ReviewStore";
import {useDispatch, useSelector} from "react-redux";
import {setBrowsedUser, setIsCurrentUserAdmin, setIsCurrentUserOwner} from "../../store/reducers/UserSlice";
import {setDisplayFilters, setEditedReview, setReviews, setSelectedReview} from "../../store/reducers/ReviewSlice";
import {setModalParams} from "../../store/reducers/ModalSlice";
import {setIsLoading} from "../../store/reducers/LoadingSlice";

export const ProfilePage = (props) => {

    const dispatch = useDispatch()
    const {isCurrentUserAdmin, isCurrentUserOwner, currentUser, browsedUser} = useSelector((state) => state.user)
    const {reviews, displayFilters, selectedReview} = useSelector((state) => state.review)
    const {user, isAuthenticated, getAccessTokenSilently, isLoading} = useAuth0()

    const isLoading1 = useSelector((state) => state.loading.isLoading)


    const routerParams = useParams();
    const reviewsModal = useRef();

    const [filtersBtnText, setFiltersBtnText] = useState('Show filters')

    useEffect(async () => {
        console.log('au', isAuthenticated)
        await checkPrivileges()
        setTimeout(async () => {
            dispatch(setIsLoading(false))
        }, 1000);

    }, [isAuthenticated])


    const checkPrivileges = async () => {
        console.log('1')
        if (isAuthenticated) {
            console.log('3')
            await setCurrentUserAsAuthUser()
        } else {
            console.log('2')
            if(routerParams.id) {
                await setCurrentUserAsGuest()
            }
        }
    }


    const setCurrentUserAsGuest = async () => {
        let userBrowsedProfile = await getUserById(routerParams.id) //userBrowsedProfile - profile of user, which you browse now
        dispatch(setBrowsedUser(userBrowsedProfile))
        dispatch(setIsCurrentUserAdmin(false))
        let reviews = await getUserReviews(userBrowsedProfile.authId, routerParams.id)
        dispatch(setReviews(reviews))
    }


    const authUserInOtherUserProfile = async () => {
        let userBrowsedProfile = await getUserById(routerParams.id)
        dispatch(setBrowsedUser(userBrowsedProfile))
        let reviews = await getUserReviews(userBrowsedProfile.authId, routerParams.id)
        dispatch(setReviews(reviews))
        if (userBrowsedProfile.authId === currentUser.authId) {
            console.log('owner!')
            dispatch(setIsCurrentUserOwner(true))
        } else {
            dispatch(setIsCurrentUserOwner(false))
        }
    }

    const authUserInOwnProfile = async () => {
        let newReviews = await getUserReviews(currentUser.authId, currentUser.id)
        dispatch(setReviews(newReviews))
        dispatch(setBrowsedUser(currentUser))
        dispatch(setIsCurrentUserOwner(true))
    }

    const setCurrentUserAsAuthUser = async () => {
        if (routerParams.id) {
            console.log('4')
            await authUserInOtherUserProfile()
        } else {
            console.log('5')
            await authUserInOwnProfile()
        }
    }


    const createReview = () => {
        dispatch(setModalParams({
            title: "Review Creating",
            displayModalButtons: "",
            displayModalFeedback: "none",
            displayCreateForm: true,
            displayEditForm: false,
            displayViewForm: false,
            displayHeader: "",
            backdrop: "static"
        }))
        reviewsModal?.current.showReviewModal()
    }

    const viewReview = () => {
        if (Object.keys(selectedReview).length !== 0) {
            dispatch(setEditedReview(selectedReview))
            dispatch(setModalParams({
                title: "Review View",
                displayModalButtons: "none",
                displayModalFeedback: "",
                displayCreateForm: false,
                displayEditForm: false,
                displayViewForm: true,
                displayHeader: "none",
                backdrop: "true"
            }))
            reviewsModal?.current.showReviewModal()
        }
    }


    const editReview = () => {
        if (Object.keys(selectedReview).length !== 0) {
            dispatch(setEditedReview(selectedReview))
            dispatch(setModalParams({
                title: "Review Editing",
                displayModalButtons: "",
                displayModalFeedback: "none",
                displayCreateForm: false,
                displayEditForm: true,
                displayViewForm: false,
                displayHeader: "",
                backdrop: "static"
            }))
            reviewsModal?.current.showReviewModal()
        }
    }


    const deleteReview = async () => {
        if (Object.keys(selectedReview).length !== 0) {
            let selectedId = selectedReview.id
            if (selectedId) {
                let filtered = reviews.filter(review => review.id !== selectedId)
                dispatch(setReviews(filtered))
                await deleteImagesFromFirebaseCloud(reviews.find(review => review.id === selectedId).images)
                await deleteUserReview(browsedUser.authId, selectedId)
            }
        }
    }

    const handleToUpdate = async (newReview) => {
        let reviewFromApi = await saveEditedReview(newReview)
        let newArr = reviews.map(item =>
            item.id === reviewFromApi.id
                ? reviewFromApi
                : item
        )
        dispatch(setReviews(newArr))
        dispatch(setSelectedReview(reviewFromApi))
    }

    const handleToCreate = async (newReview) => {
        const createdReview = await saveNewReview(browsedUser.authId, newReview)
        console.log('new', createdReview)
        console.log('others', reviews)
        const newReviews = [...reviews]
        newReviews.push(createdReview[0])
        dispatch(setReviews(newReviews))
    }

    const changeDisplayFiltersState = (e) => {
        if (!displayFilters) {
            dispatch(setDisplayFilters("none"))
            setFiltersBtnText('Show filters')
        } else {
            dispatch(setDisplayFilters(""))
            setFiltersBtnText('Hide filters')
        }
    }


    return (
        <Container fluid className="profile_page_container">

            {
                isLoading1 ?
                    <LoadingComponent/>
                    :

                    <div>
                        {routerParams.id || isAuthenticated ?

                            <div>
                                <h1 className="small_margin_left no_select"> User Profile </h1>
                                <div className="user_profile">
                                    <UserProfile/>
                                </div>

                                {reviews && reviews.length > 0 ?
                                    <div>
                                        <h1 className="text-center">Reviews</h1>

                                        <Fragment>
                                            <div className="reviews_table_container">
                                                <Button variant="success" onClick={changeDisplayFiltersState}>{filtersBtnText}</Button>
                                                <Button variant="success" className="reviews_table_button"
                                                        onClick={viewReview}>View</Button>
                                            </div>
                                            {isCurrentUserAdmin || isCurrentUserOwner &&
                                                <div className="reviews_table_container">
                                                    <Button variant="success" className="reviews_table_button"
                                                            onClick={createReview}>Create</Button>
                                                    <Button variant="success" className="reviews_table_button"
                                                            onClick={editReview}>Edit</Button>
                                                    <Button variant="success" className="reviews_table_button"
                                                            onClick={deleteReview}>Delete</Button>

                                                </div>
                                            }
                                        </Fragment>


                                    <CustomBootstrapTable/>
                                    </div>
                                    :

                                    <div className="center_profile_page text-center">
                                {isCurrentUserAdmin || isCurrentUserOwner ?
                                    <div className="no_wrap_on_normal_screen">
                                    <h2>Ooooops...It seems you have not reviews, click the
                                    button to create the first!</h2>
                                    <div className="profile_button_container">
                                    <Button className="profile_button" variant="danger"
                                    onClick={createReview}>Tap
                                    me!</Button>
                                    </div>
                                    </div>
                                    :
                                    <div className="no_wrap_on_big_screen">
                                    <h2>This user has no reviews at the moment!</h2>
                                    </div>
                                }

                                    </div>
                                }
                            </div>
                            :
                            <div className="no_wrap_on_normal_screen center_without_content text-center">
                                <div>
                                    <h2>Log in to create your first review!</h2>
                                    <LogInButton size={"big"}/>
                                </div>
                            </div>

                        }

                        <CustomModal
                            ref={reviewsModal}
                            handleToUpdate={handleToUpdate}
                            handleToCreate={handleToCreate}
                        />
                    </div>
            }
        </Container>

    )
}