import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import Text from 'react-texty'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

ModalOptionService.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool
}

function ModalOptionService({ onHide, show, OsItems }) {
  const columns = useMemo(
    () => [
      {
        key: 'BookDate',
        title: 'Ngày sử dụng',
        cellRenderer: ({ rowData }) =>
          moment(rowData.BookDate).format('HH:mm DD-MM-YYYY'),
        dataKey: 'BookDate',
        width: 180,
        sortable: false
      },
      {
        key: 'IsWarrant',
        title: 'Loại buổi',
        cellRenderer: ({ rowData }) =>
          rowData.IsWarrant ? 'Bảo hành' : 'Buổi thường',
        dataKey: 'IsWarrant',
        width: 180,
        sortable: false
      },
      {
        key: 'Staffs',
        title: 'Nhân viên thực hiện',
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={280}>
            {rowData.Staffs && rowData.Staffs.length > 0
              ? rowData.Staffs.map(item => item.FullName).join(', ')
              : 'Không xác định'}
          </Text>
        ),
        dataKey: 'Staffs',
        className: 'flex-fill',
        width: 300,
        sortable: false
      }
    ],
    []
  )
  if (!OsItems) return ''
  return (
    <Modal show={show} dialogClassName="modal-max-md" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="font-size-lg text-uppercase">
          Lịch sử {OsItems.ProdTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="h-500px">
          <ReactBaseTableInfinite
            rowKey="ID"
            columns={columns}
            data={OsItems.OsItems}
            loading={false}
            pageCount={1}
            rowHeight={50}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={onHide}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalOptionService
