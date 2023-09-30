import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AsyncSelect from 'react-select/async'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import moment from 'moment'
import moreApi from 'src/api/more.api'
import { useParams } from 'react-router-dom'
import SelectStocks from 'src/components/Selects/SelectStocks'
import SelectStaffsService from 'src/components/Selects/SelectStaffsService'
moment.locale('vi')

CalendarMemberBook.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func
}
CalendarMemberBook.defaultProps = {
  show: false,
  onHide: null,
  onSubmit: null
}

const initialValue = {
  MemberID: null,
  RootIdS: '',
  BookDate: new Date(),
  Desc: '',
  StockID: 0,
  UserServiceIDs: '',
  AtHome: false
}

function CalendarMemberBook({ show, onHide, onSubmit, btnLoading }) {
  let { MemberID } = useParams()
  const [initialValues, setInitialValues] = useState(initialValue)
  const { AuthCrStockID } = useSelector(({ auth }) => ({
    AuthStocks: auth.Info.Stocks.filter(item => item.ParentID !== 0).map(
      item => ({
        ...item,
        value: item.ID,
        label: item.Title
      })
    ),
    AuthCrStockID: auth.Info.CrStockID
  }))

  useEffect(() => {
    setInitialValues(prevState => ({ ...prevState, StockID: AuthCrStockID }))
  }, [AuthCrStockID])

  const loadOptionsServices = (inputValue, callback, stockID) => {
    const filters = {
      Key: inputValue,
      StockID: stockID,
      MemberID: MemberID
    }
    setTimeout(async () => {
      const { data } = await moreApi.getRootServices(filters)
      const dataResult = data.lst.map(item => ({
        value: item.ID,
        label: item.Title
      }))
      callback(dataResult)
    }, 300)
  }

  const CalendarSchema = Yup.object().shape({
    BookDate: Yup.string().required('Vui lòng chọn ngày đặt lịch.'),
    RootIdS: Yup.array().required('Vui lòng chọn dịch vụ.').nullable(),
    // UserServiceIDs: Yup.array()
    //   .required("Vui lòng chọn nhân viên.")
    //   .nullable(),
    StockID: Yup.string().required('Vui lòng chọn cơ sở.')
  })

  return (
    <Fragment>
      <Modal
        size="md"
        dialogClassName="modal-max-sm modal-content-right"
        show={show}
        onHide={onHide}
        scrollable={true}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={CalendarSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {formikProps => {
            const {
              errors,
              touched,
              values,
              handleChange,
              handleBlur,
              setFieldValue
            } = formikProps
            return (
              <Form className="h-100 d-flex flex-column">
                <Modal.Header className="open-close border-0" closeButton>
                  <Modal.Title className="text-uppercase">
                    Đặt lịch dịch vụ
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                  <div className="form-group form-group-ezs px-20px pt-15px mb-15px border-top">
                    <label className="mb-1 d-none d-md-flex justify-content-between">
                      Thời gian / Cơ sở
                      {/* <span className="btn btn-label btn-light-primary label-inline cursor-pointer">
                      Lặp lại
                    </span> */}
                    </label>
                    <DatePicker
                      name="BookDate"
                      selected={
                        values.BookDate ? new Date(values.BookDate) : ''
                      }
                      onChange={date => setFieldValue('BookDate', date)}
                      onBlur={handleBlur}
                      className={`form-control ${
                        errors.BookDate && touched.BookDate
                          ? 'is-invalid solid-invalid'
                          : ''
                      }`}
                      shouldCloseOnSelect={false}
                      dateFormat="dd/MM/yyyy HH:mm"
                      placeholderText="Chọn thời gian"
                      timeInputLabel="Thời gian"
                      showTimeSelect
                      timeFormat="HH:mm"
                    />
                    <SelectStocks
                      className={`select-control mt-2 ${
                        errors.StockID && touched.StockID
                          ? 'is-invalid solid-invalid'
                          : ''
                      }`}
                      classNamePrefix="select"
                      value={values.StockID}
                      //isLoading={true}
                      //isDisabled={true}
                      //isClearable
                      isSearchable
                      //menuIsOpen={true}
                      name="StockID"
                      placeholder="Chọn cơ sở"
                      onChange={option => {
                        setFieldValue('StockID', option ? option.value : '')
                        setFieldValue('RootIdS', '')
                        setFieldValue('UserServiceIDs', '')
                      }}
                      menuPosition="fixed"
                      onBlur={handleBlur}
                      allStock={false}
                    />
                  </div>
                  <div className="form-group form-group-ezs border-top px-20px pt-15px mb-15px">
                    <label className="mb-1 d-none d-md-block">Dịch vụ</label>
                    <AsyncSelect
                      key={`${'No-Member'}-${values.StockID}`}
                      menuPosition="fixed"
                      isMulti
                      className={`select-control ${
                        errors.RootIdS && touched.RootIdS
                          ? 'is-invalid solid-invalid'
                          : ''
                      }`}
                      classNamePrefix="select"
                      isLoading={false}
                      isDisabled={false}
                      isClearable
                      isSearchable
                      //menuIsOpen={true}
                      value={values.RootIdS}
                      onChange={option => setFieldValue('RootIdS', option)}
                      name="RootIdS"
                      placeholder="Chọn dịch vụ"
                      cacheOptions
                      loadOptions={(v, callback) =>
                        loadOptionsServices(v, callback, values.StockID)
                      }
                      defaultOptions
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? 'Không có dịch vụ'
                          : 'Không tìm thấy dịch vụ'
                      }
                    />

                    <div className="d-flex align-items-center justify-content-between mt-15px">
                      <label className="mr-3">Sử dụng dịch vụ tại nhà</label>
                      <span className="switch switch-sm switch-icon">
                        <label>
                          <input
                            type="checkbox"
                            name="AtHome"
                            onChange={evt =>
                              setFieldValue('AtHome', evt.target.checked)
                            }
                            onBlur={handleBlur}
                            checked={values.AtHome}
                          />
                          <span />
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="form-group form-group-ezs px-20px pt-15px mb-15px border-top">
                    <label className="mb-1 d-none d-md-block">
                      Nhân viên thực hiện
                    </label>
                    <SelectStaffsService
                      isMulti
                      className="select-control"
                      menuPosition="fixed"
                      menuPlacement="bottom"
                      name="UserServiceIDs"
                      value={values.UserServiceIDs}
                      onChange={option =>
                        setFieldValue('UserServiceIDs', option)
                      }
                      isClearable={true}
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? 'Không có nhân viên'
                          : 'Không tìm thấy nhân viên'
                      }
                    />
                    <textarea
                      name="Desc"
                      value={values.Desc}
                      className="form-control mt-2"
                      rows="5"
                      placeholder="Nhập ghi chú"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                  </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                  <div>
                    <button
                      type="submit"
                      className={`btn btn-sm btn-primary mr-2 font-size-base ${
                        btnLoading ? 'spinner spinner-white spinner-right' : ''
                      } w-auto my-0 mr-0 h-auto`}
                      disabled={btnLoading}
                    >
                      Đặt lịch ngay
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary d-md-none"
                      onClick={onHide}
                    >
                      Đóng
                    </button>
                  </div>
                  <div></div>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>
    </Fragment>
  )
}

export default CalendarMemberBook
