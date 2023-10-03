import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import DatePicker, { registerLocale } from 'react-datepicker'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { StatisticalContext } from 'src/features/Statistical'
import SelectTeleHis from 'src/components/Selects/SelectTeleHis'

import vi from 'date-fns/locale/vi' // the locale you want
import SelectStaffs from 'src/components/Selects/SelectStaffs'
import SelectStocks from 'src/components/Selects/SelectStocks'

registerLocale('vi', vi) // register it with the name you want

Sidebar.propTypes = {
  filters: PropTypes.object,
  onSubmit: PropTypes.func
}

function Sidebar({ filters, onSubmit, loading, onRefresh }) {
  const { isSidebar, onHideSidebar } = useContext(StatisticalContext)
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
                  Tìm kiếm
                </div>
                <div className="flex-grow-1 p-15px overflow-auto">
                  {/* <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Cơ sở
                    </label>
                    <SelectStocks
                      name="filter.StockID"
                      value={values?.filter?.StockID}
                      onChange={otp => {
                        setFieldValue('filter.StockID', otp ? otp.value : '')
                      }}
                    />
                  </div> */}
                  {/* {teleAdv && (
                    <div className="mb-15px form-group">
                      <label className="font-label text-muted mb-5px">
                        Nhân viên
                      </label>
                      <SelectStaffs
                        className="select-control"
                        menuPosition="fixed"
                        menuPlacement="bottom"
                        name="filter.UserID"
                        onChange={otp => {
                          setFieldValue('filter.UserID', otp, false)
                        }}
                        value={values.filter.UserID}
                        isClearable={true}
                        adv={true}
                      />
                    </div>
                  )} */}
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Thời gian
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          calendarClassName="hide-header"
                          onChange={date => {
                            setFieldValue('filter.From', date, false)
                          }}
                          selected={values.filter.From}
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
                            setFieldValue('filter.To', date, false)
                          }}
                          selected={values.filter.To}
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
                      Kết quả
                    </label>
                    <SelectTeleHis
                      isLoading={false}
                      className="w-100 flex-1"
                      placeholder="Chọn kết quả"
                      name="filter.Result"
                      onChange={otp => {
                        setFieldValue('filter.Result', otp, false)
                      }}
                      value={values.filter.Result}
                      isClearable={true}
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
