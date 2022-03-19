import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {findReviews} from "../../api/store/ReviewStore";

export const SearchPage = () =>
{
    const { state } = useLocation();
    console.log('state: ', state);

    useEffect(async () => {
        await searchReviews()
    }, [state])

    const searchReviews = async () => {
        let response = await findReviews(state)
        console.log('resp: ', response)
        console.log('Searching: ', state)
    }

    return (
        <div>
            Search Page!
        </div>
    )
}