import {Button, Container} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

export const HomePage = () => {
    const navigate = useNavigate()
    const {user, isAuthenticated, loginWithRedirect, logout} = useAuth0()

    const routeChange = () => {
        let path = `/profile`;
        navigate(path);
    }
    const routeChange2 = () => {
        let path = `/profile/2`;
        navigate(path);
    }
    const getInfo = () => {
        console.log("checking...")
        if(isAuthenticated)
        {
            console.log(user)
        }
    }
    const login = () => {
        if(!isAuthenticated) {
            loginWithRedirect()
            console.log('sad')
        }
        else{
            logout()
        }
    }

    return (

        <div>
            <Container fluid >
                <div>
                    <h1 > Welcome to the Rec Soc Net Site Home Page! </h1>
                    <Button variant="danger"  onClick={getInfo}>Get Info</Button>
                    <Button variant="danger"  onClick={login}>Login or logout</Button>
                </div>
            </Container>

        </div>


    );
}
