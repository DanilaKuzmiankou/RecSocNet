import React, {Fragment} from 'react';
import "../../App.css"
import {Col, Container, Image, Row} from "react-bootstrap";

export class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {owner: this.props.owner};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.owner !== prevProps.owner) {
            this.setState({owner: this.props.owner})
        }
    }

    render() {
        return (
            <div className="no_select">
                <Row >
                    <Col xs={"auto"}>
                        <Image
                            src={this.state.owner.profilePictureUrl}
                            height={120}
                            width={120}
                        />
                    </Col>
                    <Col>
                        <div className="small_margin_top">
                        <h4  className="no_wrap"> User name: {this.state.owner.name} </h4>
                        <h4 className="no_wrap"> User likes: {this.state.owner.likes} </h4>
                        </div>
                    </Col>

                </Row>


            </div>

        )
    }
}