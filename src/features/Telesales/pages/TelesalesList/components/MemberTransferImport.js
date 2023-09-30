import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import SelectStaffs from 'src/components/Selects/SelectStaffs'
import clsx from 'clsx'
import * as Yup from 'yup'

MemberTransferImport.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool
}

const initialValues = {
  members: '',
  users: ''
}

const TransferSchema = Yup.object().shape({
  members: Yup.string().required('Nhập khách hàng.'),
  users: Yup.array().required('Chọn nhân viên.')
})

function MemberTransferImport({
  onHide,
  show,
  onSubmit,
  onResetMember,
  loading,
  loadingReset
}) {
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
          const {
            values,
            touched,
            errors,
            setFieldValue,
            handleChange,
            handleBlur
          } = formikProps

          return (
            <Form className="d-flex flex-column h-100">
              <Modal.Header closeButton>
                <Modal.Title className="font-size-lg text-uppercase">
                  Import khách hàng
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-15px">
                <div className="form-group mb-20px">
                  <label className="font-label text-muted mb-5px">
                    Số điện thoại Khách hàng
                  </label>
                  <textarea
                    name="members"
                    className={`form-control ${
                      errors.members && touched.members
                        ? 'is-invalid solid-invalid'
                        : ''
                    }`}
                    placeholder="Nhập số điện thoại"
                    rows={3}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="font-label text-muted mb-5px">
                    Tới nhân viên
                  </label>
                  <SelectStaffs
                    isMulti
                    className={`select-control ${
                      errors.users && touched.users
                        ? 'is-invalid solid-invalid'
                        : ''
                    }`}
                    menuPosition="fixed"
                    name="users"
                    onChange={otp => {
                      setFieldValue('users', otp, false)
                    }}
                    value={values.users}
                    isClearable={true}
                    adv={true}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-between">
                <button
                  type="button"
                  disabled={loadingReset}
                  className={clsx(
                    'btn btn-success',
                    loadingReset && 'spinner spinner-white spinner-right mr-3'
                  )}
                  onClick={onResetMember}
                >
                  Reset
                </button>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary mr-8px"
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
                    Thực hiện
                  </button>
                </div>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

export default MemberTransferImport
