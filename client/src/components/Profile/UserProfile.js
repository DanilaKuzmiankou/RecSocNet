import React, {Fragment} from 'react';
import "../../App.css"
import {Col, Container, Image, Row} from "react-bootstrap";
import {useSelector} from "react-redux";

export const UserProfile = () =>  {

    const browsedUser = useSelector((state) => state.user.browsedUser)

        return (
            <div className="no_select">
                <Row >
                    <Col xs={"auto"}>
                        <Image
                            src={browsedUser.profilePictureUrl}
                            height={120}
                            width={120}
                        />
                    </Col>
                    <Col>
                        <div className="small_margin_top">
                        <h4  className="no_wrap"> User name: {browsedUser.name} </h4>
                        <h4 className="no_wrap"> User likes: {browsedUser.likes} </h4>
                        </div>
                    </Col>

                </Row>


            </div>

        )

}