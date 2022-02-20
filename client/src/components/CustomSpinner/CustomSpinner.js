import {Spinner} from "react-bootstrap";

export const CustomSpinner = () => (
    <Spinner animation="border" role="status" className="custom_spinner">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
)
