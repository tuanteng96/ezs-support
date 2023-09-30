import React, { useContext, useMemo, useState } from 'react'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import { MemberContext } from 'src/features/Telesales/pages/TelesalesOption/index'
import ModalOptionService from './components/ModalOptionService'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function TelesalesOptionServices(props) {
  const { ListProds, loading } = useContext(MemberContext)
  const [visibleModal, setVisibleModal] = useState(false)
  const [OsItems, setOsItems] = useState(null)

  const onOpenModal = values => {
    setOsItems(values)
    setVisibleModal(true)
  }

  const onHideModal = () => {
    setVisibleModal(false)
  }

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowIndex }) => rowIndex + 1,
        width: 60,
        sortable: false,
        align: 'center'
      },
      {
        key: 'ProdTitle',
        title: 'Tên dịch vụ',
        dataKey: 'ProdTitle',
        width: 300,
        sortable: false
      },
      {
        key: 'Total',
        title: 'Tiến trình',
        dataKey: 'Total',
        cellRenderer: ({ rowData }) => (
          <div className="d-flex align-items-center w-100">
            <div className="progress flex-fill" style={{ height: '13px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(rowData.Done / rowData.Total) * 100 || 0}%`
                }}
                aria-valuenow={(rowData.Done / rowData.Total) * 100 || 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="number">{rowData.Done}b</span>
              </div>
            </div>
            <div className="w-50px text-end fw-600 font-size-sm font-number">
              {rowData.Done} / {rowData.Total}
            </div>
          </div>
        ),
        width: 250,
        sortable: false
      },
      {
        key: 'BH_Title',
        title: 'Bảo hành',
        dataKey: 'BH_Title',
        width: 250,
        sortable: false
      },
      {
        key: 'EndDate',
        title: 'Ngày hết hạn',
        dataKey: 'EndDate',
        cellRenderer: ({ rowData }) =>
          rowData.EndDate
            ? moment(rowData.EndDate).format('DD-MM-YYYY')
            : 'Chưa có',
        width: 200,
        sortable: false
      },
      {
        key: 'action',
        title: 'Thao tác',
        dataKey: 'action',
        cellRenderer: ({ rowData }) => (
          <div className="d-flex">
            <button
              className="btn btn-xs btn-primary"
              onClick={() => onOpenModal(rowData)}
              disabled={!rowData.OsItems || rowData.OsItems.length === 0}
            >
              {!rowData.OsItems || rowData.OsItems.length === 0
                ? 'Chưa thực hiện'
                : 'Chi tiết'}
            </button>
          </div>
        ),
        align: 'center',
        width: 130,
        sortable: false,
        frozen: 'right'
      }
    ],
    []
  )

  return (
    <div className="h-100 p-20px">
      <ReactBaseTableInfinite
        expandColumnKey={'action'}
        rowKey="Ids"
        columns={columns}
        data={ListProds}
        loading={loading}
        pageCount={1}
        rowHeight={50}
      />
      <ModalOptionService
        show={visibleModal}
        onHide={onHideModal}
        OsItems={OsItems}
      />
    </div>
  )
}

export default TelesalesOptionServices
