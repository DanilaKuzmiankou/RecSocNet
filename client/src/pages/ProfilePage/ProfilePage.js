import {useAuth0} from '@auth0/auth0-react'
import React, {Fragment, useEffect, useRef, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {
    AuthButton,
    CustomBootstrapTable,
    CustomModal,
    LoadingComponent, LogInButton,
    UserProfile
} from "../../components/index.components";
import {getUserByAuthId, getUserById, registerNewUser} from "../../api/store/UserStore";
import {useParams} from "react-router-dom";
import {
    deleteImagesFromFirebaseCloud,
    deleteUserReview,
    getUserReviews,
    saveEditedReview,
    saveNewReview
} from "../../api/store/ReviewStore";
import {useDispatch, useSelector} from "react-redux";
import {setBrowsedUser, setCurrentUser, setIsCurrentUserAdmin} from "../../store/reducers/UserSlice";
import {setDisplayFilters, setEditedReview, setReviews, setSelectedReview} from "../../store/reducers/ReviewSlice";
import {setModalParams} from "../../store/reducers/ModalSlice";
import {setIsLoading} from "../../store/reducers/LoadingSlice";

export const ProfilePage = (props) => {

    const dispatch = useDispatch()

    const browsedUser = useSelector((state) => state.user.browsedUser)
    const currentUser = useSelector((state) => state.user.currentUser)
    const reviews = useSelector((state) => state.review.reviews)
    const isCurrentUserAdmin = useSelector((state) => state.user.isCurrentUserAdmin)
    const displayFilters = useSelector((state) => state.review.displayFilters)
    const selectedReview = useSelector((state) => state.review.selectedReview)

    const {user, isAuthenticated, getAccessTokenSilently, isLoading} = useAuth0()

    const isLoading1 = useSelector((state) => state.loading.isLoading)


    const routerParams = useParams();
    const reviewsModal = useRef();

    const [filtersBtnText, setFiltersBtnText] = useState('Show filters')

    useEffect(async () => {
        console.log('load', isAuthenticated)
        console.log('load', isLoading)

        if(!isLoading) {
            await checkPrivileges()
        }
        setTimeout(async () => {
            dispatch(setIsLoading(false))
        }, 1000);

    }, [isAuthenticated, user])


    const checkPrivileges = async () => {
        if (!isAuthenticated) {
            if (!routerParams.id) {
                console.log('1')
                redirectToAuthPage()
            } else {
                console.log('2')
                await setCurrentUserAsGuest()
            }
        } else {
            console.log('3')
            await setCurrentUserAsAuthUser()
        }
    }


    const setCurrentUserAsGuest = async () => {
        let userBrowsedProfile = await getUserById(routerParams.id) //userBrowsedProfile - profile of user, which you browse now
        dispatch(setBrowsedUser(userBrowsedProfile))
        dispatch(setIsCurrentUserAdmin(false))
        let reviews = await getUserReviews(userBrowsedProfile.authId, routerParams.id)
        dispatch(setReviews(reviews))
    }

    const redirectToAuthPage = () => {
        console.log('redirecting...')
        /*let path = `/`;
                navigate(path);*/
        //loginWithRedirect()
    }

    const authUserInOtherUserProfile = async (mainUserSearched) => {
        let userBrowsedProfile = await getUserById(routerParams.id)
        dispatch(setBrowsedUser(userBrowsedProfile))
        let reviews = await getUserReviews(userBrowsedProfile.authId, routerParams.id)
        dispatch(setReviews(reviews))
        if (userBrowsedProfile.authId === mainUserSearched.authId || mainUserSearched.role === "admin") {
            console.log('admin!')
            dispatch(setIsCurrentUserAdmin(true))
        } else {
            dispatch(setIsCurrentUserAdmin(false))
        }
    }

    const authUserInOwnProfile = async (mainUserSearched) => {
        let newReviews = await getUserReviews(mainUserSearched.authId, mainUserSearched.id)
        dispatch(setReviews(newReviews))
        dispatch(setBrowsedUser(mainUserSearched))
        dispatch(setIsCurrentUserAdmin(true))
    }

    const setCurrentUserAsAuthUser = async () => {
        let token = await getAccessTokenSilently()
        await registerNewUser(token, user.sub, user.name, user.picture)
        let mainUserSearched = await getUserByAuthId(token, user.sub)
        dispatch(setCurrentUser(mainUserSearched))
        if (routerParams.id) {
            console.log('4')
            await authUserInOtherUserProfile(mainUserSearched)
        } else {
            console.log('5')
            await authUserInOwnProfile(mainUserSearched)
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
                                            {isCurrentUserAdmin &&
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
                                {isCurrentUserAdmin ?
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