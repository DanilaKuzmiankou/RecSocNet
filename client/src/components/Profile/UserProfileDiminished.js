import React, {useEffect, useState} from 'react';
import "../../App.css"
import {Image, NavDropdown} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {getUserByAuthId, registerNewUser} from "../../api/store/UserStore";
import {useDispatch, useSelector} from "react-redux";
import {setBrowsedUser, setCurrentUser} from "../../store/reducers/UserSlice";

export const UserProfileDiminished = () =>  {

    const {user, getAccessTokenSilently, logout, isAuthenticated} = useAuth0()
    const dispatch = useDispatch()
    const currentUser = useSelector((state) => state.user.currentUser)

    useEffect(async () => {
        if(isAuthenticated && Object.keys(currentUser).length === 0) {
            console.log("updating user data...")
            const token = await getAccessTokenSilently()
            await registerNewUser(token, user.sub, user.name, user.picture)
            let currentUser = await getUserByAuthId(token, user.sub)
            console.log('browsed: ', currentUser)
            dispatch(setCurrentUser(currentUser))
        }
        console.log(currentUser?.profilePictureUrl)
    }, [isAuthenticated])


    return (
        <div>
        {currentUser &&
        <div className="no_select user_profile_diminished_container">
            <div>
                    <Image
                        src={currentUser?.profilePictureUrl}
                        height={50}
                        width={50}
                        roundedCircle={true}
                    />
            </div>
            <div style={{width:'auto'}}>
            <NavDropdown title={currentUser?.name} id="navbarScrollingDropdown">
                <NavDropdown.Item className="no_wrap user_profile_diminished_name"

                                  href={"/profile/" + currentUser?.id}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                    Log out
                </NavDropdown.Item>
            </NavDropdown>
            </div>

        </div>
    }
        </div>
    )

}