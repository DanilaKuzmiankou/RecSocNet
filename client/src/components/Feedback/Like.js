import {useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as heartLight} from "@fortawesome/free-regular-svg-icons";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as likeLight} from "@fortawesome/free-regular-svg-icons";

import Rating from "react-rating";

export const Like = (props) => {

    fontawesome.library.add(faHeart, heartLight, faThumbsUp, likeLight);
    const[fullSymbol, setFullSymbol] = useState("black")
    const[likes, setLikes] = useState(false)

    useEffect( () =>{
        let isMounted = true
        if (isMounted){
            setLikes(props?.likes)
        }
        return () => { isMounted = false }
    }, [props])



    const onLikeClick = () =>{
        setLikes(!likes)
        setFullSymbol("red")
    }

    const onLikeHover = (value) =>{
        if(value)
        {
            setFullSymbol("black")
        }
        else {
            setFullSymbol("red")
        }
    }

            return (
                <div>
                    <Rating
                        start={0}
                        stop={1}
                        initialRating={likes}
                        onClick={onLikeClick}
                        onHover={onLikeHover}
                        emptySymbol={
                            <FontAwesomeIcon icon="fa-regular fa-thumbs-up"
                                             color={"black"}
                                             size="2x"
                            />
                        }
                        fullSymbol={
                        <FontAwesomeIcon icon="fa-solid fa-thumbs-up"
                                         size="2x"
                                         color={fullSymbol}
                            />
                    }
                    />
                </div>
            );
}
