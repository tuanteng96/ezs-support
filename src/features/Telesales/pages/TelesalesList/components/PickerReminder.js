import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import { createPortal } from 'react-dom'
import Skeleton from 'react-loading-skeleton'
import telesalesApi from 'src/api/telesales.api'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import DatePicker from 'react-datepicker'
import Text from 'react-texty'
import moment from 'moment'
import 'moment/locale/vi'
import { Formik, Form } from 'formik'

moment.locale('vi')

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const AddNotiSchema = Yup.object().shape({
  noti: Yup.object().shape({
    Desc: Yup.string().required('Nhập ghi chú'),
    Date: Yup.string().required('Nhập ngày')
  })
})

function OverlayComponent({ btnLoading, onSubmit, item, Button, MemberID }) {
  const [initialValues, setInitialValues] = useState({
    noti: {
      MemberID: MemberID,
      Date: '',
      Desc: '',
      IsNoti: false,
      ID: 0
    }
  })

  useEffect(() => {
    if (item && item.ID) {
      setInitialValues(prevState => ({
        noti: {
          ...prevState.noti,
          Date: item.Date ? new Date(item.Date) : '',
          Desc: item.Desc,
          ID: item.ID,
          IsNoti: item.IsNoti,
          CreateDate: item.CreateDate ? new Date(item.CreateDate) : ''
        }
      }))
    }
  }, [item])

  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      key="top"
      placement="auto"
      overlay={
        <Popover id={`popover-positioned-top`} className="popover-lg">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={AddNotiSchema}
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
                <Form>
                  <Popover.Header className="font-weight-bold text-uppercase d-flex justify-content-between py-3">
                    {!item ? 'Thêm mới' : 'Cập nhập'} lịch nhắc
                  </Popover.Header>
                  <Popover.Body>
                    <div className="form-group mb-15px">
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
                        //dateFormatCalendar="MMMM"
                      />
                    </div>
                    <div className="form-group mb-15px">
                      <label>Nội dung</label>
                      <textarea
                        name="noti.Desc"
                        className={`form-control ${
                          errors?.noti?.Desc && touched?.noti?.Desc
                            ? 'is-invalid solid-invalid'
                            : ''
                        }`}
                        rows="5"
                        value={values?.noti?.Desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label className="checkbox d-flex cursor-pointer">
                        <input
                          type="checkbox"
                          name="noti.IsNoti"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.noti.IsNoti}
                        />
                        <span className="checkbox-icon"></span>
                        <span>Đã nhắc lịch</span>
                      </label>
                    </div>
                  </Popover.Body>
                  <div className="font-weight-bold d-flex justify-content-between py-10px px-3 border-top">
                    <button
                      type="submit"
                      className={clsx(
                        'btn btn-success py-2 font-size-sm',
                        btnLoading && 'spinner spinner-white spinner-right'
                      )}
                      disabled={btnLoading}
                    >
                      {!item ? 'Thêm mới' : 'Cập nhập'}
                    </button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </Popover>
      }
    >
      {Button()}
    </OverlayTrigger>
  )
}

function PickerReminder({ children, data, onRefresh }) {
  const MemberID = data.ID
  const [visible, setVisible] = useState()
  const [loading, setLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [List, setList] = useState([])

  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv || false
  }))

  useEffect(() => {
    if (MemberID && visible) {
      getNotiList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberID, visible])

  const getNotiList = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    const filters = {
      MemberID: MemberID
    }
    telesalesApi
      .getNotiMember(filters)
      .then(({ data }) => {
        setList(data.list)
        setLoading(false)
        callback && callback()
      })
      .catch(error => console.log(error))
  }

  const onSubmit = (values, { resetForm }) => {
    setBtnLoading(true)
    const newData = {
      noti: {
        MemberID: values.noti.MemberID,
        Date: moment(values.noti.Date).format('MM/DD/YYYY'),
        Desc: values.noti.Desc,
        IsNoti: values.noti.IsNoti,
        ID: values.noti?.ID || 0
      }
    }
    if (values.noti.CreateDate) {
      newData.noti.CreateDate = moment(values.noti.CreateDate).format(
        'MM/DD/YYYY'
      )
    }
    telesalesApi
      .addNotiMember(newData)
      .then(response => {
        getNotiList(false, () => {
          resetForm()
          setBtnLoading(false)
          setLoading(false)
          window.top?.toastr &&
            window.top?.toastr.success(
              values.noti?.ID > 0
                ? 'Cập nhập lịch nhắc thành công'
                : 'Thêm mới lịch nhắc thành công',
              '',
              {
                timeOut: 1500
              }
            )
          window.getListReminder && window.getListReminder()
          document.body.click()
          // onRefresh(() => {
          //   resetForm()
          //   setBtnLoading(false)
          //   setLoading(false)
          //   window.top?.toastr &&
          //     window.top?.toastr.success(
          //       values.noti?.ID > 0
          //         ? 'Cập nhập lịch nhắc thành công'
          //         : 'Thêm mới lịch nhắc thành công',
          //       '',
          //       {
          //         timeOut: 1500
          //       }
          //     )
          //   window.getListReminder && window.getListReminder()
          //   document.body.click()
          // })
        })
      })
      .catch(error => console.log(error))
  }

  const onDelete = item => {
    const newData = {
      deleteIds: [item.ID]
    }
    Swal.fire({
      title: 'Thực hiện xóa ?',
      html: `Bạn đang thực hiện xóa lịch nhắc này không.`,
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy',
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: 'bg-danger'
      },
      preConfirm: () =>
        new Promise((resolve, reject) => {
          telesalesApi
            .deleteNotiMember(newData)
            .then(response => {
              getNotiList(false, () => {
                window.getListReminder && window.getListReminder()
                // onRefresh(() => {
                //   window.top?.toastr &&
                //     window.top?.toastr.success('Xóa lịch nhắc thành công', '', {
                //       timeOut: 1500
                //     })
                //   resolve()
                // })
                window.top?.toastr &&
                  window.top?.toastr.success('Xóa lịch nhắc thành công', '', {
                    timeOut: 1500
                  })
                resolve()
              })
            })
            .catch(error => console.log(error))
        }),
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  return (
    <>
      {/* {children({
        open: () => setVisible(true),
        close: () => setVisible(false)
      })} */}
      <div onClick={() => setVisible(true)}>
        {List.length > 0 || (data.NotiList && data.NotiList.length > 0) ? (
          <>
            {List.length > 0 ? (
              <>
                <div className="mt-8px fw-500">
                  Ngày nhắc
                  <span className="pl-5px">
                    {moment(List[0].Date).format('DD-MM-YYYY')}
                  </span>
                  {List[0].IsNoti && (
                    <span className="pl-5px font-size-xs text-success">
                      - Đã nhắc
                    </span>
                  )}
                </div>
                <Text style={{ width: '230px' }} tooltipMaxWidth={250}>
                  Nội dung :
                  <span className="fw-500 pl-3px">{List[0].Desc}</span>
                </Text>
              </>
            ) : (
              <>
                <div className="mt-8px fw-500">
                  Ngày nhắc
                  <span className="pl-5px">
                    {moment(data.NotiList[0].Date).format('DD-MM-YYYY')}
                  </span>
                  {data.NotiList[0].IsNoti && (
                    <span className="pl-5px font-size-xs text-success">
                      - Đã nhắc
                    </span>
                  )}
                </div>
                <Text style={{ width: '230px' }} tooltipMaxWidth={250}>
                  Nội dung :
                  <span className="fw-500 pl-3px">{data.NotiList[0].Desc}</span>
                </Text>
              </>
            )}
          </>
        ) : (
          <>Thêm lịch nhắc</>
        )}
      </div>

      {createPortal(
        <Modal
          show={visible}
          onHide={() => setVisible(false)}
          dialogClassName="modal-content-right max-w-400px"
          scrollable={true}
          enforceFocus={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div>
                <div className="fw-600 font-size-lg text-uppercase">
                  Lịch nhắc
                </div>
                <div className="font-number font-size-base">
                  {data?.FullName} - {data.HandCardID} - {data?.MobilePhone}
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <div>
            <Formik
              initialValues={{
                noti: {
                  MemberID: MemberID,
                  Date: '',
                  Desc: '',
                  IsNoti: false,
                  ID: 0
                }
              }}
              onSubmit={onSubmit}
              validationSchema={AddNotiSchema}
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
                  <Form className="p-15px border-bottom">
                    <div className="form-group mb-15px">
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
                        rows="2"
                        value={values?.noti?.Desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                    </div>

                    <div className="font-weight-bold d-flex align-items justify-content-between pt-15px">
                      <div className="form-group">
                        <label className="checkbox d-flex cursor-pointer mb-0">
                          <input
                            type="checkbox"
                            name="noti.IsNoti"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.noti.IsNoti}
                          />
                          <span className="checkbox-icon"></span>
                          <span>Đã nhắc lịch</span>
                        </label>
                      </div>
                      <button
                        type="submit"
                        className={clsx(
                          'btn btn-success py-2 font-size-sm',
                          btnLoading && 'spinner spinner-white spinner-right'
                        )}
                        disabled={btnLoading}
                      >
                        Thêm mới
                      </button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className="scroll flex-grow-1 p-15px"
            style={{ position: 'relative' }}
          >
            {loading &&
              Array(1)
                .fill()
                .map((item, index) => (
                  <div
                    className={clsx(
                      'bg-light rounded-sm p-15px',
                      1 - 1 !== index && 'mb-12px'
                    )}
                    key={index}
                  >
                    <div className="d-flex justify-content-between">
                      <span className="font-number fw-500">
                        <Skeleton count={1} width={130} height={15} />
                      </span>
                      <span className="fw-500">
                        <Skeleton count={1} width={80} height={15} />
                      </span>
                    </div>
                    <div className="mt-5px fw-300">
                      <Skeleton count={3} height={15} />
                    </div>
                  </div>
                ))}
            {!loading && (
              <>
                {List && List.length > 0 ? (
                  List.map((item, index) => (
                    <div
                      className={clsx(
                        'bg-light rounded-sm p-15px',
                        List.length - 1 !== index && 'mb-12px'
                      )}
                      key={index}
                    >
                      <div className="d-flex justify-content-between">
                        <span className="font-number fw-500">
                          {moment(item.CreateDate).format('HH:mm DD-MM-YYYY')}
                        </span>
                        <div>
                          <OverlayComponent
                            onSubmit={onSubmit}
                            btnLoading={btnLoading}
                            Button={() =>
                              teleAdv && (
                                <span
                                  className="fw-500 text-success cursor-pointer text-underline font-size-sm mr-8px"
                                  //onClick={() => onDelete(item)}
                                >
                                  Sửa
                                </span>
                              )
                            }
                            item={item}
                            MemberID={MemberID}
                          />
                          {(teleAdv ||
                            moment(item.CreateDate).format('DD-MM-YYYY') ===
                              moment().format('DD-MM-YYYY')) && (
                            <span
                              className="fw-500 text-danger cursor-pointer text-underline font-size-sm"
                              onClick={() => onDelete(item)}
                            >
                              Xóa
                            </span>
                          )}
                        </div>
                      </div>
                      {item.Date && (
                        <div className="mt-8px fw-500">
                          Ngày nhắc
                          <span className="pl-5px">
                            {moment(item.Date).format('DD-MM-YYYY')}
                          </span>
                          {item.IsNoti && (
                            <span className="pl-5px font-size-xs text-success">
                              - Đã nhắc
                            </span>
                          )}
                        </div>
                      )}
                      <div className="mt-5px fw-300">
                        Nội dung : <span className="fw-500">{item.Desc}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                      <img
                        className="w-100 max-w-120px"
                        src={AssetsHelpers.toAbsoluteUrl(
                          '/_assets/images/data-empty.png'
                        )}
                        alt="Không có dữ liệu"
                      />
                      <div className="text-center font-size-base fw-300">
                        Không có lịch sử chăm sóc.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </PerfectScrollbar>
        </Modal>,
        document.body
      )}
    </>
  )
}

export default PickerReminder
