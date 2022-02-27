import BootstrapTable from 'react-bootstrap-table-next';
import React from 'react';
import {Button, Container, OverlayTrigger, Tooltip} from "react-bootstrap";
import ReactMarkdown from 'react-markdown'
import "../../App.css"
import filterFactory, {Comparator, dateFilter, numberFilter, textFilter} from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import {changeDateToUserTimezoneSingleObj, changeSingleDateToUserTimezone} from "../../utils/CustomDate";

export class CustomBootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: this.props.reviews,
            changedReviews: [],
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.reviews !== prevProps.reviews) {
            this.setState({reviews: this.props.reviews})
        }
    }




    render() {

        function headerFormat(column, colIndex) {
            return (
                <div>
                    <OverlayTrigger placement="bottom" delay={{show: 150, hide: 200}}
                                    overlay={<Tooltip id="tooltip-disabled">Click to sort!</Tooltip>}>
                        <h5>{ column.text} </h5>
                    </OverlayTrigger>
                </div>
            );
        }

        function dateFormatter(cell, row) {
            let date = changeSingleDateToUserTimezone(cell)
                return (
                    <h6>{date}</h6>
                );
            }


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
            filter: textFilter({
                placeholder: 'Title',
                style: {display:this.props.displayFilters},
            }),
            sort: true,
            headerAlign:'center',
            headerFormatter: headerFormat
        }, {
            dataField: 'text',
            text: 'Text',
            filter: textFilter({
                placeholder: 'Text',
                style: {display:this.props.displayFilters},
            }),
            formatter: (cell, row, rowIndex, extraData) => (
                <div>
                    <ReactMarkdown children={formatString(row.text)}/>
                </div>
            ),
            sort: true,
            headerAlign:'center',
            headerFormatter: headerFormat
            }, {
            dataField: 'category',
            text: 'Category',
            filter: textFilter({
                placeholder: 'Category',
                style: {display:this.props.displayFilters},

            }),
            sort: true,
            headerAlign:'center',
            headerFormatter: headerFormat
        }, {
            dataField: 'tags',
            text: 'Tags',
            filter: textFilter({
                placeholder: 'Tags',
                style: {display:this.props.displayFilters},
            }),
            sort: true,
            headerAlign:'center',
            headerFormatter: headerFormat
        }, {
            dataField: 'authorScore',
            text: 'Author creation score',
            filter: numberFilter({
                placeholder: 'Author score ',
                style: {display:this.props.displayFilters},
            }),
            sort: true,
            headerAlign:'center',
            headerFormatter: headerFormat
        }, {
            dataField: 'usersContentScore',
            text: 'Users creation score',
            filter: numberFilter({
                placeholder: 'User score ',
                style: {display:this.props.displayFilters},
            }),
            sort: true,
            headerAlign:'center',
            headerFormatter: headerFormat
        }, {
            dataField: 'usersReviewScore',
            text: 'Likes',
            filter: numberFilter({
                placeholder: 'Likes',
                style: {display:this.props.displayFilters},
            }),
            sort: true,
            headerAlign:'center',
            headerFormatter: headerFormat
        }, {
            dataField: 'createdAt',
            text: 'Created',
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                if (order === 'asc')
                {
                    return Date.parse(a) - Date.parse(b)
                }
                else if (order === 'desc') {
                    return  Date.parse(b) - Date.parse(a)
                }
            },
            headerAlign:'center',
            headerFormatter: headerFormat,
            filter: dateFilter({
                withoutEmptyComparatorOption: true,
                comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
                comparatorClassName: 'custom-comparator-class',
                style: {display:this.props.displayFilters}
            }),
            formatter:dateFormatter
        }];

        if (!this.state.reviews) {
            throw Error('reviews not found')
        }



        return (

            <Container fluid>

                <BootstrapTable
                    headerWrapperClasses="no_wrap no_select"
                    filtersClasses="nice"
                    bordered={false}
                    ref={n => this.node = n}
                    keyField='id'
                    data={this.state.reviews}
                    columns={columns}
                    filter={ filterFactory() }
                    filterPosition="top"
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
