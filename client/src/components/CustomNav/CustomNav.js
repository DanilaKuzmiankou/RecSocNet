import React from 'react';
import "../../App.css"
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {AuthButton} from "../index.components"

export const CustomNav = () => {

    const navigate = useNavigate()
    const routeChange = () => {
        let path = `/profile`;
        navigate(path);
    }

return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
        <div className="d-flex flex-grow-1 navbar_home_button_container">
            <OverlayTrigger placement="bottom" delay={{show: 250, hide: 400}}
                            overlay={<Tooltip id="tooltip-disabled">To Home!</Tooltip>}>
                <a href="/" className=" justify-content-start navbar_home_button">Home</a>
            </OverlayTrigger>
        </div>
        <div className="navbar-collapse collapse w-100 navbar_auth_button" id="collapsingNavbar3">
            <ul className="nav navbar-nav ml-auto w-100 justify-content-end">
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">To Profile!</Tooltip>}>
                    <a className="navbar_users_data_button" onClick={routeChange}>Profile</a>
                </OverlayTrigger>
                <AuthButton/>
            </ul>
        </div>
    </nav>
)

};

export default CustomNav;