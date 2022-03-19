import React, {useEffect, useState} from 'react';
import "../../App.css"
import {
    Button, Col,
    Container,
    Form,
    FormControl,
    Nav,
    Navbar,
    NavDropdown,
    OverlayTrigger,
    Row,
    Tooltip
} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {AuthButton, LogInButton} from "../index.components"
import {useAuth0} from "@auth0/auth0-react";
import {UserProfileDiminished} from "../Profile/UserProfileDiminished";
import {findReviews} from "../../api/store/ReviewStore";

export const CustomNav = () => {

    const navigate = useNavigate()
    const {isAuthenticated} = useAuth0()
    const [searchData, setSearchData] = useState('')

    const search = async (event) => {
        event.preventDefault();
        navigate('/search', {
            state: searchData
        })
    }

    return (

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container fluid>
                <OverlayTrigger placement="bottom" delay={{show: 250, hide: 400}}
                                overlay={<Tooltip id="tooltip-disabled">To Home!</Tooltip>}>
                    <a href="/" className=" justify-content-start navbar_home_button">Home</a>
                </OverlayTrigger>


                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav

                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px', gap: "1rem"}}>

                    </Nav>

                    <div>
                        <Container >
                            <Row >
                                <Col lg={"auto"} sm={12} className="nav_elements_margin">
                                    <Form className="d-flex"
                                          onSubmit = {search}
                                    >
                                        <FormControl
                                            type="search"
                                            placeholder="Search reviews"
                                            className="me-2"
                                            aria-label="Search"
                                            onChange={event => setSearchData(event.target.value)}
                                        />
                                        <Button type="submit" variant="outline-success">Search</Button>
                                    </Form>
                                </Col>
                                <Col lg={"auto"} sm={12} className="nav_elements_margin" >
                                    {isAuthenticated ?
                                        <UserProfileDiminished/>
                                        :
                                        <LogInButton/>
                                    }
                                </Col>
                            </Row>
                        </Container>
                    </div>

                </Navbar.Collapse>
            </Container>
        </Navbar>


    )

};

export default CustomNav;