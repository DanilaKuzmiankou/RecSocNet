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
        }, {
            dataField: 'createdAt',
            text: 'Created'
        }];

        if (!this.state.reviews) {
            throw Error('reviews not found')
        }

        const expandRow = {
            onlyOneExpanding: true,
            //parentClassName: 'parent-expand-foo',
            renderer: row => (
                <div>
                    <h1>Review Text</h1>
                    {this.state.reviews[(row.id-1)].text}
                </div>
            )
        };

        return (
            <Container fluid>
                <BootstrapTable
                    bordered={false}
                    ref={n => this.node = n}
                    keyField='id'
                    data={this.state.reviews}
                    columns={columns}
                    expandRow={ expandRow }
                />
            </Container>
        )

    }
}
