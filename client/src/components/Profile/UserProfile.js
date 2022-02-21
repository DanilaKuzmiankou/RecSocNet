import React from 'react';
import "../../App.css"

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
        console.log(this.state.owner.likes)
        return (
            <div>
                <h1 >
                    User name: {this.state.owner.name}
                </h1>
                <h1>
                User likes: {this.state.owner.likes}
                </h1>
            </div>
        )
    }
}