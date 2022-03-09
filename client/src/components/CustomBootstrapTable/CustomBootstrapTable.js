import BootstrapTable from 'react-bootstrap-table-next';
import React from 'react';
import {Container, OverlayTrigger, Tooltip} from "react-bootstrap";
import ReactMarkdown from 'react-markdown'
import "../../App.css"
import filterFactory, {Comparator, dateFilter, numberFilter, textFilter} from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import {changeSingleDateToUserTimezone} from "../../utils/Utils";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedReview} from "../../store/reducers/ReviewSlice";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';

export const CustomBootstrapTable = () => {

    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.review.reviews)
    const displayFilters = useSelector((state) => state.review.displayFilters)

        function headerFormat(column, colIndex) {
            return (
                <div>
                    <OverlayTrigger placement="bottom" delay={{show: 150, hide: 200}}
                                    overlay={<Tooltip id="tooltip-disabled">Click to sort!</Tooltip>}>
                        <h5 >{column.text}
                            <span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                        </h5>
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
            if (str.length >= process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH) {
                return (str + "...")
            } else {
                return str
            }
        }

        const columns = [{
            dataField: 'title',
            text: 'Title',
            filter: textFilter({
                placeholder: 'Title',
                style: {display: displayFilters},
            }),
            sort: true,
            headerFormatter: headerFormat
        }, {
            dataField: 'text',
            text: 'Text',
            filter: textFilter({
                placeholder: 'Text',
                style: {display: displayFilters},
            }),
            classes: "text-center",
            formatter: (cell, row, rowIndex, extraData) => (
                <div>
                    <ReactMarkdown children={formatString(row.text)}/>
                </div>
            ),
            sort: true,
            headerFormatter: headerFormat
        }, {
            dataField: 'category',
            text: 'Category',
            filter: textFilter({
                placeholder: 'Category',
                style: {display: displayFilters},

            }),
            sort: true,
            classes: "text-center",
            headerFormatter: headerFormat
        }, {
            dataField: 'tags',
            text: 'Tags',
            filter: textFilter({
                placeholder: 'Tags',
                style: {display: displayFilters},
            }),
            sort: true,
            headerFormatter: headerFormat
        }, {
            dataField: 'authorScore',
            text: 'Author score',
            filter: numberFilter({
                placeholder: 'Author score ',
                style: {display: displayFilters},
            }),
            sort: true,
            headerFormatter: headerFormat,
        }, {
            dataField: 'usersContentScore',
            text: 'Users creation score',
            filter: numberFilter({
                placeholder: 'User score ',
                style: {display: displayFilters},
            }),
            sort: true,
            headerFormatter: headerFormat
        }, {
            dataField: 'usersReviewScore',
            text: 'Likes',
            filter: numberFilter({
                placeholder: 'Likes',
                style: {display: displayFilters},
            }),
            sort: true,
            headerFormatter: headerFormat
        }, {
            dataField: 'createdAt',
            text: 'Created',
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                if (order === 'asc') {
                    return Date.parse(a) - Date.parse(b)
                } else if (order === 'desc') {
                    return Date.parse(b) - Date.parse(a)
                }
            },
            headerFormatter: headerFormat,
            filter: dateFilter({
                withoutEmptyComparatorOption: true,
                comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
                comparatorClassName: 'custom-comparator-class',
                style: {display: displayFilters}
            }),
            formatter: dateFormatter

        }];

        if (!reviews) {
            throw Error('reviews not found')
        }

        return (
                <BootstrapTable
                    bordered={false}
                    wrapperClasses="table responsive-table"
                    keyField='id'
                    data={reviews}
                    columns={columns}
                    filter={filterFactory()}
                    filterPosition="top"

                    selectRow={{
                        mode: 'radio',
                        clickToSelect: true,
                        style: {backgroundColor: '#c8e6c9'},
                        onSelect: (row, isSelect, rowIndex, e) => {
                            dispatch(setSelectedReview(row))
                        }
                    }}
                />
        )
}
