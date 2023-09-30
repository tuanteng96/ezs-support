import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import DatePicker, { registerLocale } from 'react-datepicker'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import SelectStaffs from 'src/components/Selects/SelectStaffs'
import SelectStocks from 'src/components/Selects/SelectStocks'
import { ReminderContext } from '..'

import vi from 'date-fns/locale/vi' // the locale you want

registerLocale('vi', vi) // register it with the name you want

Sidebar.propTypes = {
  filters: PropTypes.object,
  onSubmit: PropTypes.func
}

const StatusList = [
  {
    value: 0,
    label: 'Chưa nhắc'
  },
  {
    value: 1,
    label: 'Đã nhắc'
  }
]

function Sidebar({ filters, onSubmit, loading, onRefresh }) {
  const { isSidebar, onHideSidebar } = useContext(ReminderContext)
  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false
  }))

  return (
    <>
      <div
        className={clsx(
          'telesales-list__sidebar bg-white',
          isSidebar && 'show'
        )}
      >
        <Formik
          initialValues={filters}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {formikProps => {
            // errors, touched, handleChange, handleBlur
            const { values, setFieldValue } = formikProps

            return (
              <Form className="d-flex flex-column h-100">
                <div className="border-bottom p-15px text-uppercase fw-600 font-size-lg position-relative">
                  Tim kiếm
                </div>
                <div className="flex-grow-1 p-15px overflow-auto">
                  {/* <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Cơ sở
                    </label>
                    <SelectStocks
                      name="StockID"
                      value={values?.StockID}
                      onChange={otp => {
                        setFieldValue('StockID', otp ? otp.value : '')
                      }}
                    />
                  </div> */}
                  {teleAdv && (
                    <div className="mb-15px form-group">
                      <label className="font-label text-muted mb-5px">
                        Nhân viên
                      </label>
                      <SelectStaffs
                        className="select-control"
                        menuPosition="fixed"
                        menuPlacement="bottom"
                        name="UserID"
                        onChange={otp => {
                          setFieldValue('UserID', otp, false)
                        }}
                        value={values.UserID}
                        isClearable={true}
                        adv={true}
                      />
                    </div>
                  )}
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Thời gian
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          calendarClassName="hide-header"
                          onChange={date => {
                            setFieldValue('DateFrom', date, false)
                          }}
                          selected={values.DateFrom}
                          placeholderText="Từ ngày"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          dateFormatCalendar="MMMM"
                        />
                      </div>
                      <div className="w-35px d-flex align-items-center justify-content-center">
                        <i className="fa-regular fa-arrow-right-long text-muted"></i>
                      </div>
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('DateTo', date, false)
                          }}
                          selected={values.DateTo}
                          placeholderText="Đến ngày"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          dateFormatCalendar="MMMM"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-0">
                    <label className="font-label text-muted mb-5px">
                      Trạng thái
                    </label>
                    <Select
                      classNamePrefix="select"
                      options={StatusList}
                      className="select-control"
                      name="IsNoti"
                      value={values?.IsNoti}
                      onChange={otp => {
                        setFieldValue('IsNoti', otp)
                      }}
                      placeholder="Chọn trạng thái"
                      isClearable
                    />
                  </div>
                </div>
                <div className="border-top p-15px d-flex">
                  <button
                    type="button"
                    className="btn btn-secondary h-42px mr-8px d-lg-none"
                    onClick={onHideSidebar}
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className={clsx(
                      'btn btn-primary w-100 text-uppercase fw-500 h-42px font-size-base flex-fill',
                      loading && 'spinner spinner-white spinner-right mr-3'
                    )}
                    disabled={loading}
                  >
                    Tìm kiếm khách hàng
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
      <div
        className={clsx('telesales-list__sidebar--bg', isSidebar && 'show')}
        onClick={onHideSidebar}
      ></div>
    </>
  )
}

export default Sidebar
