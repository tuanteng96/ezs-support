import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

ModalCalendarIframe.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func
}

function ModalCalendarIframe({ show, onHide }) {
  //window.IfameStocks = StocksList
  const [loading, setLoading] = useState(false)
  const handleIfrmeLoad = () => setLoading(false)

  return (
    <Modal
      show={show}
      fullscreen={true}
      onHide={onHide}
      contentClassName="rounded-0"
    >
      <Modal.Header closeButton>
        <Modal.Title>Bảng lịch</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {loading && (
          <div className="position-absolute w-100 h-100 top-0 left-0 d-flex align-items-center justify-content-center">
            Đang tải dữ liệu ...
          </div>
        )}
        <iframe
          onLoad={handleIfrmeLoad}
          className="w-100 h-100"
          src="/admin/bookadmin/index.html?isTelesales=true"
          frameBorder="0"
          title="Bảng lịch cho Sales"
        ></iframe>
      </Modal.Body>
    </Modal>
  )
}

export default ModalCalendarIframe
