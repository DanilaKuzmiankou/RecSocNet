import BootstrapTable from 'react-bootstrap-table-next';
import React from 'react';
import {Container} from "react-bootstrap";
import ReactMarkdown from 'react-markdown'
import "../../App.css"

export class CustomBootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: this.props.reviews,
            changedReviews: []
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.reviews !== prevProps.reviews) {
            this.setState({reviews: this.props.reviews})
        }
    }



    render() {

        const formatString = (str) => {
            str = str.substring(0, process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH)
            if(str.length >= process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH){
                return (str + "...")
            }
            else{
                return str
            }
        }

        const columns = [{
            dataField: 'title',
            text: 'Title',
        }, {
            dataField: 'text',
            text: 'Text',
            formatter: (cell, row, rowIndex, extraData) => (
                <div>
                    <ReactMarkdown children={formatString(row.text)}/>
                </div>
            ),
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





        return (

            <Container fluid>

                <BootstrapTable
                    bordered={false}
                    ref={n => this.node = n}
                    keyField='id'
                    data={this.state.reviews}
                    columns={columns}
                    selectRow={{
                        mode: 'radio',
                        clickToSelect: true,
                        style: {backgroundColor: '#c8e6c9'}
                    }}
                />
            </Container>
        )

    }
}
