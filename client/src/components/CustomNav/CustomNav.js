import React from 'react';
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
import {AuthButton} from "../index.components"

export const CustomNav = () => {

    const navigate = useNavigate()
    const routeChange = () => {
        let path = `/profile`;
        navigate(path);
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
                            <Row  >
                                <Col lg={"auto"} md={12} className="nav_elements_margin">
                                <OverlayTrigger placement="bottom"
                                                overlay={<Tooltip id="tooltip-disabled">To Profile!</Tooltip>}>
                                    <a className="navbar_home_button" onClick={routeChange}>Profile</a>
                                </OverlayTrigger>
                                </Col>

                                <Col lg={"auto"} md={12} className="nav_elements_margin">
                                    <Form className="d-flex">
                                        <FormControl
                                            type="search"
                                            placeholder="Search reviews"
                                            className="me-2"
                                            aria-label="Search"
                                        />
                                        <Button variant="outline-success">Search</Button>
                                    </Form>
                                </Col>

                                <Col lg={"auto"} md={12} className="nav_elements_margin" >
                                    <AuthButton/>
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