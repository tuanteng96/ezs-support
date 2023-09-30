import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import SelectStaffs from 'src/components/Selects/SelectStaffs'
import clsx from 'clsx'
import * as Yup from 'yup'

MemberTransfer.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool
}

const initialValues = {
  FromTeleUserID: '',
  ToTeleUserID: ''
}

const TransferSchema = Yup.object().shape({
  FromTeleUserID: Yup.object().required('Chọn nhân viên.'),
  ToTeleUserID: Yup.object().required('Chọn nhân viên.')
})

function MemberTransfer({ onHide, show, onSubmit, loading }) {
  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-max-sm">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validationSchema={TransferSchema}
      >
        {formikProps => {
          // errors, touched, handleChange, handleBlur
          const { values, touched, errors, setFieldValue } = formikProps

          return (
            <Form className="d-flex flex-column h-100">
              <Modal.Header closeButton>
                <Modal.Title className="font-size-lg text-uppercase">
                  Chuyển đổi khách hàng
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-15px">
                <div className="form-group mb-20px">
                  <label className="font-label text-muted mb-5px">
                    Từ nhân viên
                  </label>
                  <SelectStaffs
                    className={`select-control ${
                      errors.FromTeleUserID && touched.FromTeleUserID
                        ? 'is-invalid solid-invalid'
                        : ''
                    }`}
                    menuPosition="fixed"
                    name="FromTeleUserID"
                    onChange={otp => {
                      setFieldValue('FromTeleUserID', otp, false)
                    }}
                    value={values.FromTeleUserID}
                    isClearable={true}
                    adv={true}
                  />
                </div>
                <div className="form-group">
                  <label className="font-label text-muted mb-5px">
                    Tới nhân viên
                  </label>
                  <SelectStaffs
                    className={`select-control ${
                      errors.ToTeleUserID && touched.ToTeleUserID
                        ? 'is-invalid solid-invalid'
                        : ''
                    }`}
                    menuPosition="fixed"
                    name="ToTeleUserID"
                    onChange={otp => {
                      setFieldValue('ToTeleUserID', otp, false)
                    }}
                    value={values.ToTeleUserID}
                    isClearable={true}
                    adv={true}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    'btn btn-primary',
                    loading && 'spinner spinner-white spinner-right mr-3'
                  )}
                >
                  Chuyển đổi nhân viên
                </button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

export default MemberTransfer
