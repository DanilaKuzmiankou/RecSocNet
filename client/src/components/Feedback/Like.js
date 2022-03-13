import {useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as heartLight} from "@fortawesome/free-regular-svg-icons";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as likeLight} from "@fortawesome/free-regular-svg-icons";

import Rating from "react-rating";
import {changeReviewLikeState} from "../../api/store/RatingStore";
import {useSelector} from "react-redux";

export const Like = ({updateReview, review}) => {

    fontawesome.library.add(faHeart, heartLight, faThumbsUp, likeLight);

    const currentUser = useSelector((state) => state.user.currentUser)
    const[like, setLike] = useState(false)

    useEffect( () =>{
        let isMounted = true
        if (isMounted){
            if(review.ratings && review.ratings[0]?.reviewScore!==undefined) {
                setLike(review.ratings[0]?.reviewScore)
            }
        }
        return () => { isMounted = false }
    }, [review])



    const onLikeClick = async (value) => {
        let result = await changeReviewLikeState(currentUser.authId, review.id)
        if(result.status===200)
        {
            let newReview = Object.assign({}, review)
            newReview.usersReviewScore = result.data.usersReviewScore
            setLike(result.data.liked)
            updateReview(newReview)
        }
        else
        {
            alert(result.message)
        }
    }

            return (
                <div>
                    <Rating
                        start={0}
                        stop={1}
                        initialRating={like}
                        onClick={onLikeClick}
                        emptySymbol={
                            <FontAwesomeIcon icon="fa-regular fa-thumbs-up"
                                             color={"black"}
                                             size="2x"
                            />
                        }
                        fullSymbol={
                            <FontAwesomeIcon icon="fa-solid fa-thumbs-up"
                                             size="2x"
                                             color={'red'}
                            />
                        }
                    />
                </div>
            );
}
