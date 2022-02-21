import {useAuth0, withAuthenticationRequired} from '@auth0/auth0-react'
import React, {useEffect, useLayoutEffect, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {CustomSpinner} from "../../components/index.components";
import {getUserByAuthId, getUserById, getUserReviews, registerNewUser} from "../../store/UserStore";
import {useNavigate, useParams} from "react-router-dom";

export const ProfilePage = (props) => {

        //const usersTable = useRef(null);
        const {user, isAuthenticated, getAccessTokenSilently, loginWithRedirect, logout} = useAuth0()
        const [reviews, setReviews] = useState([]);
        const [loading, setLoading] = useState(true);
        const [mainUser, setMainUser] = useState({});  //main user - is the user who is currently performing actions in the application
        const [owner, setOwner] = useState({})    //owner - is the user, which profile we're browsing now
        const [isMainUserAdmin, setIsMainUserAdmin] = useState(false)
        const routerParams = useParams();
        const navigate = useNavigate()



        useEffect(async () => {

            await checkPrivileges()

            setTimeout(async () => {
                setLoading(false);
            }, 200);

        }, [isAuthenticated])



        const checkPrivileges = async () => {
            console.log('step 1')
            console.log('isau1', isAuthenticated)
            if (!isAuthenticated) {
                console.log("step 2")
                if (!routerParams.id) {
                    console.log("step 3")
                    /*let path = `/`;
                    navigate(path);*/
                    loginWithRedirect()
                } else {
                    console.log("step 5")
                    let userBrowsedProfile = await getUserById(routerParams.id) //userBrowsedProfile - profile of user, which you browse now
                    setOwner(userBrowsedProfile)
                    console.log("browsed", userBrowsedProfile)
                    setIsMainUserAdmin(false)
                }
            } else {
                console.log("step 6")
                let token = await getAccessTokenSilently()
                await registerNewUser(token, user.sub, user.name)
                let mainUserSearched = await getUserByAuthId(token, user.sub)
                setMainUser(mainUserSearched)
                if (routerParams.id) {
                    console.log("step 7")
                    let userBrowsedProfile = await getUserById(routerParams.id) //userBrowsedProfile - profile of user, which you browse now
                    setOwner(userBrowsedProfile)
                    console.log('userBrowsedProfile.authId!', userBrowsedProfile.authId, 'mainUser.authId', mainUser.authId)
                    if (userBrowsedProfile.authId === mainUser.authId || mainUserSearched.role === "admin") {
                        console.log('ADMIN!')
                        setIsMainUserAdmin(true)
                    } else {
                        setIsMainUserAdmin(false)
                    }
                } else {
                    console.log("step 8")
                    setOwner(mainUserSearched)
                    setIsMainUserAdmin(true)
                }
            }
            console.log('isau2', isAuthenticated)
        }

        const lol = async () => {
            console.log("owner: ", owner)
            console.log("main user: ", mainUser)
            console.log('is main user admin: ', isMainUserAdmin)
            //let reviews = await getUserReviews(owner.authId)
            //console.log('rev: ', reviews)

        }
    const lol2 = async () => {
        console.log("auth or not: ", isAuthenticated)
        console.log("user: ", user)
        console.log('token: ', getAccessTokenSilently)
        //let reviews = await getUserReviews(owner.authId)
        //console.log('rev: ', reviews)

    }

        const routeChange = () => {
            logout()
        }

        if (loading) {
            return <CustomSpinner/>
        }

        return (

            <Container fluid>
                    <h1> Profile Page! </h1>
                    <h1>
                    User name: {owner.name}
                    </h1>
                    <Button variant="danger"  onClick={routeChange}>Log out</Button>
                    <Button variant="danger"  onClick={lol}>get info</Button>
                    <Button variant="danger"  onClick={lol2}>get auth info</Button>
            </Container>

        )
    }