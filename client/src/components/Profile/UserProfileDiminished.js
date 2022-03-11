import React, {useEffect, useState} from 'react';
import "../../App.css"
import {Image, NavDropdown} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {getUserByAuthId, registerNewUser} from "../../api/store/UserStore";
import {useDispatch, useSelector} from "react-redux";
import {setBrowsedUser} from "../../store/reducers/UserSlice";

export const UserProfileDiminished = () =>  {

    const {user, getAccessTokenSilently, logout, isAuthenticated} = useAuth0()
    const dispatch = useDispatch()
    const browsedUser = useSelector((state) => state.user.browsedUser)

    useEffect(async () => {
        if(isAuthenticated && Object.keys(browsedUser).length === 0) {
            console.log("updating user data...")
            const token = await getAccessTokenSilently()
            await registerNewUser(token, user.sub, user.name, user.picture)
            let browsed = await getUserByAuthId(token, user.sub)
            console.log('browsed: ', browsed)
            dispatch(setBrowsedUser(browsed))
        }
        console.log(browsedUser?.profilePictureUrl)
    }, [isAuthenticated])


    return (
        <div>
        {browsedUser &&
        <div className="no_select user_profile_diminished_container">
                    <Image
                        src={browsedUser?.profilePictureUrl}
                        height={50}
                        width={50}
                        roundedCircle={true}
                    />

            <div style={{marginRight:'10px'}} >
            <NavDropdown title={browsedUser?.name} id="navbarScrollingDropdown">
                <NavDropdown.Item className="no_wrap user_profile_diminished_name"

                                  href={"/profile/" + browsedUser?.id}>Profile</NavDropdown.Item>
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