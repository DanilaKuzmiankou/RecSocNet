import React from 'react';
import {useAuth0} from '@auth0/auth0-react';
import "../../../App.css"
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export const LogInButton = () => {
    const {loginWithRedirect} = useAuth0();
    return (
        <OverlayTrigger delay={{show: 250, hide: 400}} placement="bottom"
                        overlay={<Tooltip id="tooltip-disabled">Log in!</Tooltip>}>
            <button
                className="btn btn-primary btn-block log_in_button"
                onClick={() => loginWithRedirect()}
            >
                Log In
            </button>
        </OverlayTrigger>
    );
};

export default LogInButton;