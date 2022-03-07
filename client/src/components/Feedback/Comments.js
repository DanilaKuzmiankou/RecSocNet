import {useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import {faComment} from "@fortawesome/free-regular-svg-icons";
import {faComment as solidComment} from "@fortawesome/free-solid-svg-icons";
import Rating from "react-rating";

export const Comments = (props) => {

    fontawesome.library.add(faComment, solidComment);

    const[comments, setComments] = useState(false)

    useEffect( () =>{
        let isMounted = true
        if (isMounted){
            //setLikes(props?.likes)
        }
        return () => { isMounted = false }
    }, [props])



    const onCommentsClick = () =>{
        setComments(!comments)
        console.log('opening comments...')
    }

    return (
    <div>
        <Rating
            start={0}
            stop={1}
            initialRating={comments}
            onClick={onCommentsClick}
            emptySymbol={
                <FontAwesomeIcon icon="fa-regular fa-comment"
                                 color={"black"}
                                 size="2x"
                />
            }
            fullSymbol={
                <FontAwesomeIcon icon="fa-solid fa-comment"
                                 size="2x"
                                 color={"black"}
                />
            }
        />
    </div>
    );
}
