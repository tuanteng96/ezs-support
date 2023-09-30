import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import uuid from 'react-uuid'
import telesalesApi from 'src/api/telesales.api'
import { ArrayHelpers } from 'src/helpers/ArrayHelpers'
import Text from 'react-texty'

import moment from 'moment'
import 'moment/locale/vi'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'

moment.locale('vi')

function TelesalesOptionUse(props) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [ListData, setListData] = useState([])

  useEffect(() => {
    getListUseSerives()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListUseSerives = () => {
    setLoading(true)
    telesalesApi
      .getHisUseServices(MemberID)
      .then(({ data }) => {
        const newData = []
        for (let item of data) {
          for (let service of item.Services) {
            if (service.Status === 'done')
              newData.push({
                ...service,
                ProdTitle: item.OrderItem.ProdTitle
              })
          }
        }
        const newDataGroups = ArrayHelpers.groupbyDDHHMM(newData)
        const newDatas = []
        for (let [index, item] of newDataGroups.entries()) {
          for (let [k, o] of item.items.entries()) {
            const newObj = {
              ...o,
              ...item,
              index: index,
              Ids: uuid()
            }
            if (k !== 0) {
              delete newObj.items
            }
            newDatas.push(newObj)
          }
        }
        setListData(newDatas)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowData }) => rowData.index + 1,
        rowSpan: ({ rowData }) =>
          rowData.items && rowData.items.length > 0 ? rowData.items.length : 1,
        width: 60,
        sortable: false,
        align: 'center'
      },
      {
        key: 'dayFull',
        title: 'Ngày sử dụng',
        dataKey: 'dayFull',
        cellRenderer: ({ rowData }) =>
          moment(rowData.dayFull).format('HH:mm DD-MM-YYYY'),
        rowSpan: ({ rowData }) =>
          rowData.items && rowData.items.length > 0 ? rowData.items.length : 1,
        width: 200,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Tên dịch vụ',
        dataKey: 'Title',
        width: 250,
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={250}>
            {rowData.ProdTitle} ({rowData.Title})
          </Text>
        ),
        sortable: false,
        className: 'flex-fill',
        headerClassName: 'flex-fill'
      },
      {
        key: 'Nhân viên thực hiện',
        title: 'Nhân viên thực hiện',
        dataKey: 'Qty',
        width: 200,
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={250}>
            {rowData.Staffs &&
              rowData.Staffs.map(staff => staff.FullName).join(', ')}
          </Text>
        ),
        sortable: false
      }
    ],
    []
  )

  const rowRenderer = ({ rowData, rowIndex, cells, columns, isScrolling }) => {
    if (isScrolling)
      return (
        <div className="pl-15px d-flex align-items">
          <div className="spinner spinner-primary w-40px"></div> Đang tải ...
        </div>
      )
    const indexList = [0, 1]
    for (let index of indexList) {
      const rowSpan = columns[index].rowSpan({ rowData, rowIndex })
      if (rowSpan > 1) {
        const cell = cells[index]
        const style = {
          ...cell.props.style,
          backgroundColor: '#fff',
          height: rowSpan * 50 - 1,
          alignSelf: 'flex-start',
          zIndex: 1
        }
        cells[index] = React.cloneElement(cell, { style })
      }
    }
    return cells
  }

  return (
    <div className="h-100 p-20px">
      <ReactBaseTableInfinite
        rowKey="Ids"
        columns={columns}
        data={ListData}
        loading={loading}
        rowHeight={50}
        overscanRowCount={4}
        useIsScrolling
        rowRenderer={rowRenderer}
      />
    </div>
  )
}

export default TelesalesOptionUse
