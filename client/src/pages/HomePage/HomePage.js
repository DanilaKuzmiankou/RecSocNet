import {Button, Container} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate()

    const routeChange = () => {
        let path = `/profile`;
        console.log('lol')
        navigate(path);
    }

    return (

        <div>
            <Container fluid >
                <div>
                    <h1 > Welcome to the Rec Soc Net Site Home Page! </h1>
                    <Button variant="danger"  onClick={routeChange}>Get Started!</Button>
                </div>
            </Container>

        </div>


    );
}
