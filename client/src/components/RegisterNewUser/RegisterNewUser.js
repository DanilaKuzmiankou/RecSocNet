import {useAuth0} from "@auth0/auth0-react";
import {getUserByAuthId, registerNewUser} from "../../api/store/UserStore";
import {setCurrentUser} from "../../store/reducers/UserSlice";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

export const RegisterNewUser = () => {
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0()
    const {currentUser, isCurrentUserAdmin} = useSelector((state) => state.user)
    const dispatch = useDispatch()


    useEffect(async () => {
        if (isAuthenticated && Object.keys(currentUser).length === 0) {
            console.log("updating user data...")
            const token = await getAccessTokenSilently()
            await registerNewUser(token, user.sub, user.name, user.picture)
            let currentUser = await getUserByAuthId(token, user.sub)
            console.log('browsed: ', currentUser)
            dispatch(setCurrentUser(currentUser))
        }
    }, [isAuthenticated])
    return null
}