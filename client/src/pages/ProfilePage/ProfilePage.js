import {useAuth0, withAuthenticationRequired} from '@auth0/auth0-react'
import React, {useEffect, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {CustomSpinner} from "../../components/index.components";
import {getUserByAuthId, getUserById, getUserReviews, registerNewUser} from "../../store/UserStore";
import {useNavigate, useParams} from "react-router-dom";

export const ProfilePage = (props) => {

        //const usersTable = useRef(null);
        const {user, isAuthenticated} = useAuth0()
        const {getAccessTokenSilently, loginWithRedirect, logout} = useAuth0()
        const [reviews, setReviews] = useState([]);
        const [loading, setLoading] = useState(true);
        const [mainUser, setMainUser] = useState({});  //main user - is the user who is currently performing actions in the application
        const [owner, setOwner] = useState({})    //owner - is the user, which profile we're browsing now
        const [isMainUserAdmin, setIsMainUserAdmin] = useState(false)

        const routerParams = useParams();
        const navigate = useNavigate()

        useEffect(async () => {
            await checkPrivileges()
            console.log("owner: ", owner)

            setTimeout(() => {
                setLoading(false);
            }, 100);

        }, [])



        const checkPrivileges = async () => {
            if (!isAuthenticated) {
                if (!routerParams.id) {
                    /*let path = `/`;
                    navigate(path);*/
                    loginWithRedirect()
                } else {
                    let userBrowsedProfile = await getUserById(routerParams.id) //userBrowsedProfile - profile of user, which you browse now
                    setOwner(userBrowsedProfile)
                    setIsMainUserAdmin(false)
                }
            } else {
                let token = await getAccessTokenSilently()
                await registerNewUser(token, user.sub, user.name)
                let mainUserSearched = await getUserByAuthId(token, user.sub)
                setMainUser(mainUserSearched)
                if (routerParams.id) {
                    let userBrowsedProfile = await getUserById(routerParams.id) //userBrowsedProfile - profile of user, which you browse now
                    setOwner(userBrowsedProfile)
                    if (userBrowsedProfile.authId === mainUser.authId || mainUserSearched.role === "admin") {
                        setIsMainUserAdmin(true)
                    } else {
                        setIsMainUserAdmin(false)
                    }
                } else {
                    setOwner(mainUserSearched)
                    setIsMainUserAdmin(true)
                }
            }
        }

        const lol = async () => {
            console.log("owner: ", owner)
            console.log("main user: ", mainUser)
            console.log('is main user admin: ', isMainUserAdmin)
            let reviews = await getUserReviews(owner.authId)
            console.log('rev: ', reviews)

        }

        const routeChange = () => {
            logout()
        }

        if (loading) {
            return <CustomSpinner/>
        }

        return (
            <Container fluid>
            <h1 > Profile Page! </h1>
                <h1>
                   User name: {owner.name}
                </h1>
                <Button variant="danger"  onClick={routeChange}>Log out</Button>
                <Button variant="danger"  onClick={lol}>get info</Button>
            </Container>
        )
    }