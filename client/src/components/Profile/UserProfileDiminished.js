import React, {useEffect, useState} from 'react';
import "../../App.css"
import {Image, NavDropdown} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {getUserByAuthId, registerNewUser} from "../../api/store/UserStore";

export const UserProfileDiminished = () =>  {

    const {user, getAccessTokenSilently, logout, isAuthenticated} = useAuth0()
    const [browsedUser, setBrowsedUser] = useState({})

    useEffect(async () => {
        const token = await getAccessTokenSilently()
        console.log('user.sub, user.name, user.picture', user.sub, user.name, user.picture)
        if(isAuthenticated) {
            await registerNewUser(token, user.sub, user.name, user.picture)
            let browsed = await getUserByAuthId(token, user.sub)
            setBrowsedUser(browsed)
        }
        console.log('browsed: ', browsedUser)
    }, [isAuthenticated])


    return (
        <div>
        {browsedUser &&
        <div className="no_select user_profile_diminished_container">
                    <Image
                        src={user.picture}
                        height={50}
                        width={50}
                        roundedCircle={true}
                    />
            <div style={{marginRight:'10px'}} >
            <NavDropdown title={user.name} id="navbarScrollingDropdown">
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