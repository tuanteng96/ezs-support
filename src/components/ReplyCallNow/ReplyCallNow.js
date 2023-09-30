import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import { createPortal } from 'react-dom'
import SelectTeleHis from '../Selects/SelectTeleHis'
import SelectProgress from '../Selects/SelectProgress'
import DatePicker from 'react-datepicker'
import * as Yup from 'yup'
import moment from 'moment'
import 'moment/locale/vi'
import telesalesApi from 'src/api/telesales.api'
import Portal from 'react-overlays/cjs/Portal'
import PickerStatus from './PickerStatus'

moment.locale('vi')

const initialValue = {
  Content: '',
  Result: '',
  Audio: '',
  TeleTags: '',
  isReminder: false,
  noti: {
    MemberID: '',
    Date: '',
    Desc: '',
    IsNoti: false,
    ID: 0
  }
}

const AddSchema = Yup.object().shape({
  Result: Yup.object().required('Vui lòng chọn kết quả')
})

const CalendarContainer = ({ children }) => {
  const el = document.getElementById('calendar-portal')

  return <Portal container={el}>{children}</Portal>
}

function ReplyCallNow() {
  const [initialValues, setInitialValues] = useState(initialValue)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  window.top.CallCallback = function (inValues) {
    setInitialValues({
      Content: '',
      Result: '',
      Audio:
        inValues.audioLink && inValues.audioLink.length > 0
          ? inValues.audioLink[0]
          : '',
      TeleTags: inValues?.member?.TeleTags,
      isReminder: false,
      noti: {
        MemberID: inValues?.member?.ID,
        Date: '',
        Desc: '',
        IsNoti: false,
        ID: 0
      }
    })
    setVisible(true)
  }

  const onSubmit = async values => {
    setLoading(true)
    const newDataHist = {
      items: [
        {
          MemberID: values?.noti?.MemberID,
          Content: values.Content,
          Type: 'PROCESS',
          Result: values.Result ? values.Result.value : '',
          Audio: values.Audio
        }
      ],
      delete: []
    }
    const newDataTags = {
      items: [
        {
          MemberID: values?.noti?.MemberID,
          TeleTags: values?.TeleTags || ''
        }
      ]
    }
    const newDataReminder = {
      noti: {
        ...values?.noti,
        Date: values?.noti?.Date
          ? moment(values?.noti?.Date).format('MM/DD/YYYY')
          : ''
      }
    }
    try {
      await telesalesApi.addCareHistory(newDataHist)
      await telesalesApi.editTagsMember(newDataTags)
      if (newDataReminder.noti.Date) {
        await telesalesApi.addNotiMember(newDataReminder)
      }
      window.updateMemberTelesale &&
        window.updateMemberTelesale('#' + values?.noti?.MemberID).then(() => {
          window.top.toastr.success('Cập nhập thành công')
          setLoading(false)
          setVisible(false)
        })
    } catch (error) {
      console.log(error)
    }
  }

  return createPortal(
    <Modal show={visible} scrollable>
      <Formik
        initialValues={initialValues}
        validationSchema={AddSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {formikProps => {
          const {
            values,
            touched,
            errors,
            setFieldValue,
            handleBlur,
            handleChange
          } = formikProps

          return (
            <Form className="h-100 d-flex flex-column overflow-auto">
              <Modal.Header>
                <Modal.Title>Kết quả cuộc gọi</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group mb-15px">
                  <label>Kết quả</label>
                  <SelectTeleHis
                    isLoading={false}
                    className={`w-100 flex-1 ${
                      errors.Result && touched.Result && 'solid-invalid'
                    }`}
                    placeholder="Chọn kết quả"
                    name="Result"
                    onChange={otp => {
                      setFieldValue('Result', otp, false)
                    }}
                    value={values.Result}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: base => ({
                        ...base,
                        zIndex: 9999
                      })
                    }}
                  />
                </div>
                <div className="form-group mb-15px">
                  <label>Link Audio</label>
                  <input
                    className="form-control"
                    placeholder="Nhập link Audio"
                    name="Audio"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.Audio}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group mb-15px">
                  <label>Tags khách hàng</label>
                  <PickerStatus
                    data={{
                      TeleTags: values.TeleTags
                    }}
                    onChange={(val, close) => {
                      setFieldValue('TeleTags', val, false)
                      close && close()
                    }}
                  >
                    {({ open }) => (
                      <div
                        className="border py-9px cursor-pointer px-10px"
                        style={{ borderRadius: '2px' }}
                        onClick={open}
                      >
                        {values.TeleTags || (
                          <span style={{ color: '#6e6e6e' }}>Chọn Tags</span>
                        )}
                      </div>
                    )}
                  </PickerStatus>
                </div>
                <div className="form-group mb-15px">
                  <label>Ghi chú</label>
                  <input
                    name="Content"
                    className={`form-control ${
                      errors?.Content && touched?.Content
                        ? 'is-invalid solid-invalid'
                        : ''
                    }`}
                    value={values.Content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập ghi chú"
                  ></input>
                </div>
                <div className="d-flex align-items-center">
                  <span className="switch switch-icon">
                    <label>
                      <input
                        name="isReminder"
                        type="checkbox"
                        value={values.isReminder}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.isReminder}
                      />
                      <span />
                    </label>
                  </span>
                  <div className="ml-10px">Thêm lịch nhắc mới</div>
                </div>
                {values.isReminder && (
                  <>
                    <div className="form-group mt-15px mb-15px">
                      <label>Ngày nhắc</label>
                      <DatePicker
                        name="noti.Date"
                        onChange={date => {
                          setFieldValue('noti.Date', date, false)
                        }}
                        selected={values.noti.Date}
                        placeholderText="Chọn ngày"
                        className={`form-control ${
                          errors?.noti?.Date && touched?.noti?.Date
                            ? 'is-invalid solid-invalid'
                            : ''
                        }`}
                        dateFormat="dd/MM/yyyy"
                        onBlur={handleBlur}
                        autoComplete="off"
                        popperContainer={CalendarContainer}
                        //dateFormatCalendar="MMMM"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nội dung</label>
                      <textarea
                        name="noti.Desc"
                        className={`form-control ${
                          errors?.noti?.Desc && touched?.noti?.Desc
                            ? 'is-invalid solid-invalid'
                            : ''
                        }`}
                        rows="3"
                        value={values?.noti?.Desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                    </div>
                  </>
                )}
                <div></div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  onClick={() => setVisible(false)}
                  type="button"
                  className="btn btn-secondary flex"
                >
                  Đóng
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary flex"
                >
                  Cập nhập
                  {loading && (
                    <Spinner
                      className="ml-8px"
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>,
    window?.top?.document?.body || document.body
  )
}

export default ReplyCallNow
