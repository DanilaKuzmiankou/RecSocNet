import BootstrapTable from 'react-bootstrap-table-next';
import React from 'react';
import {Container} from "react-bootstrap";

export class CustomBootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {reviews: this.props.reviews};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.reviews !== prevProps.reviews) {
            this.setState({reviews: this.props.reviews})
        }
    }


    render() {

        const columns = [{
            dataField: 'title',
            text: 'Title'
        }, {
            dataField: 'text',
            text: 'Text'
        }, {
            dataField: 'category',
            text: 'Category'
        }, {
            dataField: 'tags',
            text: 'Tags'
        }, {
            dataField: 'authorScore',
            text: 'Author creation score'
        }, {
            dataField: 'usersContentScore',
            text: 'Users creation score'
        }, {
            dataField: 'usersReviewScore',
            text: 'Likes'
        }];

        if (!this.state.reviews) {
            throw Error('reviews not found')
        }

        return (
            <Container fluid>
                <BootstrapTable
                    bordered={false}
                    ref={n => this.node = n}
                    keyField='id'
                    data={this.state.reviews}
                    columns={columns}

                />
            </Container>
        )

    }
}
