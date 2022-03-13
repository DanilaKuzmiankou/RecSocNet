import React, {useState} from 'react';
import "../../App.css"
import {Button, Col, Container, Form, Image, InputGroup, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import Rating from "react-rating";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {faEdit as editLight} from "@fortawesome/free-regular-svg-icons";
import {changeUserName} from "../../api/store/UserStore";
import {setBrowsedUser, setCurrentUser} from "../../store/reducers/UserSlice";

export const UserProfile = () => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state) => state.user.currentUser)
    const browsedUser = useSelector((state) => state.user.browsedUser)
    const isCurrentUserAdmin = useSelector((state) => state.user.isCurrentUserAdmin)
    const [edit, setEdit] = useState(false)
    const [editUsername, setEditUsername] = useState('')
    const [username, setUsername] = useState(browsedUser?.name)
    const [displayForm, setDisplayForm] = useState('none')
    const [validationMessage, setValidationMessage] = useState('')
    const [errorValidationMessage, setErrorValidationMessage] = useState('')
    const [isOverlayTriggerVisible, setIsOverlayTriggerVisible] = useState(false)
    const[imageGetAttempt, setImageGetAttempt] = useState(0)

    const showOrHideForm = () => {
        setEdit(!edit)
        setValidationMessage('')
        setErrorValidationMessage('')
        if (displayForm === '') {
            setEditUsername('')
            setDisplayForm('none')
        } else {
            setDisplayForm('')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let answer = await changeUserName(browsedUser.authId, editUsername)
        if (answer?.status === 200) {
            setUsername(editUsername)
            let newBrowsedUser = Object.assign({}, browsedUser)
            newBrowsedUser.name = editUsername
            dispatch(setBrowsedUser(newBrowsedUser))
            if(currentUser.authId===browsedUser.authId)
            {
                let newCurrentUser = Object.assign({}, currentUser)
                newCurrentUser.name = editUsername
                dispatch(setCurrentUser(newCurrentUser))
            }
            setValidationMessage(answer.data.message)
        }
        else {
            setErrorValidationMessage(answer.data.message)
        }
    }

    const autoCloseTooltip = (value) =>{
        if(value){
            setIsOverlayTriggerVisible(true)
            setTimeout(async () => {
                setIsOverlayTriggerVisible(false)
            }, 700);

        }
    }

    return (
        <Container fluid className="no_select">
            <Row>
                <Col xs={"auto"} md={"auto"}>
                    <Image
                        src={browsedUser.profilePictureUrl}
                        height={150}
                        width={150}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            setImageGetAttempt(imageGetAttempt => imageGetAttempt+1)
                            currentTarget.src = (imageGetAttempt < 10 ? currentUser.profilePictureUrl : process.env.PUBLIC_URL + "/blank_profile_picture.png")
                        }}
                    />
                </Col>
                <Col xs={"auto"} md={"auto"}>
                    <div className="small_margin_top">
                        <div className="profile_username_edit_container">
                            <Row>
                                <Col xs={"auto"} md={'auto'} sm={12}>

                                    <OverlayTrigger placement="right" delay={{show: 75, hide: 200}}
                                                    onToggle={autoCloseTooltip}
                                                    show={isOverlayTriggerVisible}
                                                    overlay={<Tooltip id="tooltip-disabled">Change user name</Tooltip>}>
                                    <div className="profile_username_edit_container">
                                        <h4 className="no_wrap"> User name: {username} </h4>
                                        {isCurrentUserAdmin &&
                                            <Rating
                                                className="profile_username_edit_icon"
                                                start={0}
                                                stop={1}
                                                initialRating={edit}
                                                onClick={showOrHideForm}
                                                emptySymbol={
                                                    <FontAwesomeIcon icon={editLight}
                                                                     color={"black"}
                                                                     size="1x"
                                                    />
                                                }
                                                fullSymbol={
                                                    <FontAwesomeIcon icon={faEdit}
                                                                     size="1x"
                                                                     color={"black"}
                                                    />
                                                }
                                            />
                                        }
                                    </div>
                                    </OverlayTrigger>
                                    <h4 className="no_wrap"> User likes: {browsedUser.likes} </h4>
                                </Col>
                                <Col md={6} sm={12}>
                                    <Form
                                        onSubmit={handleSubmit}
                                        style={{display: displayForm}}
                                        className="profile_username_edit_container"
                                    >
                                        <Form.Group className="profile_username_field">
                                            <InputGroup hasValidation>
                                                <Form.Control
                                                    required
                                                    value={editUsername}
                                                    id="inlineFormInputName"
                                                    placeholder="Enter new user name"
                                                    isInvalid={errorValidationMessage}
                                                    isValid={validationMessage}
                                                    onChange={(e) => {
                                                        setErrorValidationMessage('')
                                                        setValidationMessage('')
                                                        setEditUsername(e.target.value)
                                                    }}
                                                />
                                                <Form.Control.Feedback
                                                    type='valid'>{validationMessage}</Form.Control.Feedback>
                                                <Form.Control.Feedback
                                                    type="invalid">{errorValidationMessage}</Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                        <Button
                                            className="profile_username_submit_button"
                                            type="submit"
                                            variant="success">
                                            Submit
                                        </Button>
                                    </Form>

                                </Col>
                            </Row>


                        </div>

                    </div>
                </Col>
            </Row>


        </Container>

    )

}