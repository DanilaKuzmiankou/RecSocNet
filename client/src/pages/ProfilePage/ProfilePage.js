import {useAuth0} from '@auth0/auth0-react'
import React, {useEffect, useRef, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {CustomBootstrapTable, CustomSpinner, UserProfile} from "../../components/index.components";
import {getUserByAuthId, getUserById, registerNewUser} from "../../store/UserStore";
import {useParams} from "react-router-dom";
import {getUserReviews, saveEditedReview, saveNewReview} from "../../store/ReviewStore";
import {MydModalWithGrid} from "../../components/Profile/Modal/ProfileModal";

export const ProfilePage = (props) => {


    const {user, isAuthenticated, getAccessTokenSilently, loginWithRedirect, logout} = useAuth0()
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainUser, setMainUser] = useState({});  //main user - is the user who is currently performing actions in the application
    const [owner, setOwner] = useState({})    //owner - is the user, which profile we're browsing now
    const [isMainUserAdmin, setIsMainUserAdmin] = useState(false)
    const routerParams = useParams();
    const reviewsTable = useRef(null);
    const reviewsModal = useRef(null);
    const [selectedReview, setSelectedReview] = useState({})
    const [modalParams, setModalParams] = useState(
        {
            title: "",
            editable: "false",
            displayBtns: "none",
            displayScore: "",
            displayCreateReviewForm: "none",
            displayEditAndViewForm: ""
        })

    useEffect(async () => {
        await checkPrivileges()

        setTimeout(async () => {
            setLoading(false);
        }, 200);

    }, [isAuthenticated, selectedReview])

    const checkPrivileges = async () => {

        if (!isAuthenticated) {
            if (!routerParams.id) {
                console.log('1')
                /*let path = `/`;
                navigate(path);*/
                //loginWithRedirect()
            } else {
                console.log('2')
                let userBrowsedProfile = await getUserById(routerParams.id) //userBrowsedProfile - profile of user, which you browse now
                setOwner(userBrowsedProfile)
                setIsMainUserAdmin(false)
                let reviews = await getUserReviews(userBrowsedProfile.authId)
                setReviews(reviews)
            }
        } else {
            console.log('3')
            let token = await getAccessTokenSilently()
            await registerNewUser(token, user.sub, user.name)
            let mainUserSearched = await getUserByAuthId(token, user.sub)
            setMainUser(mainUserSearched)
            if (routerParams.id) {
                console.log('4')
                let userBrowsedProfile = await getUserById(routerParams.id)
                setOwner(userBrowsedProfile)
                let reviews = await getUserReviews(userBrowsedProfile.authId)
                setReviews(reviews)
                if (userBrowsedProfile.authId === mainUserSearched.authId || mainUserSearched.role === "admin") {
                    setIsMainUserAdmin(true)
                } else {
                    setIsMainUserAdmin(false)
                }
            } else {
                console.log('5')
                let newReviews = await getUserReviews(mainUserSearched.authId)

                setReviews(newReviews)
                console.log('user: ', mainUserSearched)
                setOwner(mainUserSearched)
                setIsMainUserAdmin(true)
            }
        }
    }


    const createReview = () => {
        let params = modalParams
        params.title = "Review Creation"
        params.editable="true"
        params.displayBtns="true"
        params.displayScore="none"
        params.displayCreateReviewForm="true"
        params.displayEditAndViewForm="none"
        setModalParams(params)
        setTimeout(async () => {
            reviewsModal.current?.handleModalShowHide()
        }, 100);

    }
    const viewReview = () => {
        let selectedId = reviewsTable.current.node.selectionContext.selected[0]
        let selectedReview = reviews.filter(review => {
            return review.id === selectedId
        })
        if(selectedReview.length>0) {
            let params = modalParams
            params.title = "Review view"
            params.editable = "false"
            params.displayBtns = "none"
            params.displayScore = "true"
            params.displayCreateReviewForm = "none"
            params.displayEditAndViewForm = "true"
            setModalParams(params)
            setSelectedReview(selectedReview)
            setTimeout(async () => {
                reviewsModal.current?.handleModalShowHide()
            }, 100);
        }
    }


    const editReview = () => {

        let selectedId = reviewsTable.current.node.selectionContext.selected[0]
        let selectedReview = reviews.filter(review => {
            return review.id === selectedId
        })
        if(selectedReview.length>0) {
            let params = modalParams
            params.title = "Review Editing"
            params.editable = "true"
            params.displayBtns = "true"
            params.displayScore = "none"
            params.displayCreateReviewForm = "none"
            params.displayEditAndViewForm = "true"
            setModalParams(params)
            setSelectedReview(selectedReview)
            setTimeout(async () => {
                reviewsModal.current?.handleModalShowHide()
            }, 100);
        }
    }


    const deleteReview = () => {
        if(selectedReview.length>0) {

        }

    }



    const handleToUpdate = async (newReview) => {
        console.log('rev1: ', reviews)
        setReviews(
            reviews.map(item =>
                item.id === newReview.id
                    ? newReview
                    : item
            ))
        await saveEditedReview(owner.authId, newReview)
    }

    const handleToCreate = async (newReview) => {
        const createdReview = await saveNewReview(owner.authId, newReview)
        const newReviews = [...reviews]
        newReviews.push(createdReview[0])
        setReviews(newReviews)
    }

    if (loading) {
        return <CustomSpinner/>
    }

    return (

        <Container fluid>
            <h1> Profile Page! </h1>
            <UserProfile owner={owner}/>
            <div className="reviews_table_button_container">
                <Button className="reviews_table_button" onClick={createReview}>Create</Button>
                <span> &nbsp; </span>
                <Button className="reviews_table_button" onClick={viewReview}>View</Button>
                <span> &nbsp; </span>
                <Button className="reviews_table_button" onClick={editReview}>Edit</Button>
                <span> &nbsp; </span>
                <Button className="reviews_table_button" onClick={deleteReview}>Delete</Button>
                <span> &nbsp; </span>
            </div>

                <MydModalWithGrid ref={reviewsModal}
                                  review={selectedReview[0]}
                                  params={modalParams}
                                  handleToUpdate = {handleToUpdate}
                                  handleToCreate = {handleToCreate}
                />


            <CustomBootstrapTable reviews={reviews} ref={reviewsTable}/>
        </Container>

    )
}