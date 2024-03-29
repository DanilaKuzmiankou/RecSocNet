import BootstrapTable from 'react-bootstrap-table-next';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './CustomBootstrapTable.css';
import filterFactory, {
  Comparator,
  dateFilter,
  numberFilter,
  textFilter,
} from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import { changeSingleDateToUserTimezone } from '../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedReview } from '../../store/reducers/ReviewSlice';
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';

export const CustomBootstrapTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { reviews, displayFilters } = useSelector((state) => state.review);

  function headerFormat(column, colIndex) {
    let tooltipPlacement = 'left';
    if (colIndex === 0) {
      tooltipPlacement = 'top-start';
    }
    return (
      <OverlayTrigger
        placement={tooltipPlacement}
        delay={{ show: 150, hide: 200 }}
        overlay={<Tooltip id='tooltip-disabled'>{t('click_to_sort')}</Tooltip>}
      >
        <h5 style={{ width: 'max-content', margin: '0 auto' }}>{column.text}</h5>
      </OverlayTrigger>
    );
  }

  function dateFormatter(cell, row) {
    const date = changeSingleDateToUserTimezone(cell);
    return <h6>{date}</h6>;
  }

  const formatString = (str) => {
    str = str.substring(0, process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH);
    if (str.length >= process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH) {
      return str + '...';
    } else {
      return str;
    }
  };

  const columns = [
    {
      dataField: 'title',
      classes: 'text-start',
      text: t('title'),
      filter: textFilter({
        placeholder: t('title'),
        style: { display: displayFilters },
      }),
      sort: true,
      headerFormatter: headerFormat,
    },
    {
      dataField: 'text',
      text: t('text'),
      filter: textFilter({
        placeholder: t('text'),
        style: { display: displayFilters },
      }),
      formatter: (cell, row, rowIndex, extraData) => (
        <ReactQuill theme={null} readOnly={true} defaultValue={formatString(row.text)} />
      ),
      sort: true,
      headerFormatter: headerFormat,
    },
    {
      dataField: 'category',
      text: t('category'),
      filter: textFilter({
        placeholder: t('category'),
        style: { display: displayFilters },
      }),
      sort: true,
      headerFormatter: headerFormat,
    },
    {
      dataField: 'tags',
      text: t('tags'),
      filter: textFilter({
        placeholder: t('tags'),
        style: { display: displayFilters },
      }),
      sort: true,
      headerFormatter: headerFormat,
    },
    {
      dataField: 'authorScore',
      text: t('author_score'),
      filter: numberFilter({
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        withoutEmptyComparatorOption: true,
        placeholder: t('author_score'),
        style: { display: displayFilters },
      }),
      sort: true,
      headerFormatter: headerFormat,
    },
    {
      dataField: 'usersContentScore',
      text: t('users_creation_score'),
      filter: numberFilter({
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        withoutEmptyComparatorOption: true,
        placeholder: t('users_creation_score'),
        style: { display: displayFilters },
      }),
      sort: true,
      headerFormatter: headerFormat,
    },
    {
      dataField: 'usersReviewScore',
      text: t('likes'),
      filter: numberFilter({
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        withoutEmptyComparatorOption: true,
        placeholder: t('likes'),
        style: { display: displayFilters },
      }),
      sort: true,
      headerFormatter: headerFormat,
    },
    {
      dataField: 'createdAt',
      text: t('created'),
      sort: true,
      sortFunc: (a, b, order, dataField, rowA, rowB) => {
        if (order === 'asc') {
          return Date.parse(a) - Date.parse(b);
        } else if (order === 'desc') {
          return Date.parse(b) - Date.parse(a);
        }
      },
      headerFormatter: headerFormat,
      filter: dateFilter({
        withoutEmptyComparatorOption: true,
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        comparatorClassName: 'custom-comparator-class',
        style: { display: displayFilters },
      }),
      formatter: dateFormatter,
    },
  ];

  if (!reviews) {
    throw Error('reviews not found');
  }

  return (
    <BootstrapTable
      bordered={false}
      wrapperClasses='table-responsive text-center'
      headerClasses='text-center'
      keyField='id'
      data={reviews}
      columns={columns}
      filter={filterFactory()}
      filterPosition='top'
      selectRow={{
        mode: 'radio',
        clickToSelect: true,
        classes: 'bootstrap-table-selected-row',
        onSelect: (row, isSelect, rowIndex, e) => {
          dispatch(setSelectedReview(row));
        },
      }}
    />
  );
};
