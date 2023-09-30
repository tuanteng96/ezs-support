import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import telesalesApi from 'src/api/telesales.api'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import clsx from 'clsx'
import Skeleton from 'react-loading-skeleton'
import SelectTeleHis from 'src/components/Selects/SelectTeleHis'
import InfiniteScroll from 'react-infinite-scroll-component'

import moment from 'moment'
import 'moment/locale/vi'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'

moment.locale('vi')

ReminderCalendar.propTypes = {
  onHide: PropTypes.func
}

const AddNotiSchema = Yup.object().shape({
  Content: Yup.string().required('Nhập ghi chú')
})

function OverlayComponent({ btnLoading, onSubmit, item, Button }) {
  const [initialValues, setInitialValues] = useState({
    Content: '',
    Result: ''
  })

  useEffect(() => {
    if (item) {
      const { notifications } = item
      setInitialValues(prevState => ({
        ...prevState,
        noti: {
          MemberID: notifications.MemberID,
          Date: moment(notifications.Date).format('MM/DD/YYYY'),
          CreateDate: moment(notifications.CreateDate).format('MM/DD/YYYY'),
          Desc: notifications.Desc,
          IsNoti: true,
          ID: notifications.ID
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
                    Thực hiện lịch nhắc
                  </Popover.Header>
                  <Popover.Body>
                    <div className="form-group mb-15px">
                      <label>Kết quả</label>
                      <SelectTeleHis
                        isLoading={false}
                        className="w-100 flex-1"
                        placeholder="Chọn kết quả"
                        name="Result"
                        onChange={otp => {
                          setFieldValue('Result', otp, false)
                        }}
                        value={values.Result}
                        isClearable={true}
                      />
                    </div>
                    <div className="form-group">
                      <label>Ghi chú</label>
                      <textarea
                        name="Content"
                        className={`form-control ${
                          errors?.Content && touched?.Content
                            ? 'is-invalid solid-invalid'
                            : ''
                        }`}
                        rows="5"
                        value={values.Content}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
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

function ReminderCalendar({ onHide, show, filters }) {
  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv || false
  }))

  const [ListData, setListData] = useState([])
  const [PageCount, setPageCout] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState({
    DateTo: filters.filter.NotiTo, // DD-MM-YYYY
    DateFrom: filters.filter?.NotiFrom, // DD-MM-YYYY
    StockID: filters.filter?.StockID, // filters.filter?.StockID
    Pi: 1,
    Ps: 8
  })

  useEffect(() => {
    setFilter(prevState => ({
      ...prevState,
      DateTo: filters.filter.NotiTo, // DD-MM-YYYY
      DateFrom: filters.filter?.NotiFrom, // DD-MM-YYYY
      StockID: filters.filter?.StockID, //
      Pi: 1
    }))
  }, [filters])

  useEffect(() => {
    getListNotiTele()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const getListNotiTele = callback => {
    if (filter.Pi === 1) setLoading(true)
    const newFilter = {
      ...filter,
      DateFrom: filter.DateFrom
        ? moment(filter.DateFrom).format('DD/MM/YYYY')
        : '',
      DateTo: filter.DateTo ? moment(filter.DateTo).format('DD/MM/YYYY') : ''
    }
    telesalesApi
      .getMemberTeleNoti(newFilter)
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setListData(prevState =>
            filter.Pi === 1 ? data.lst : [...prevState, ...data.lst]
          )
          setPageCout(data.PCount)
          setPageTotal(data.Total)
        }
        setLoading(false)
        callback && callback()
      })
      .catch(error => console.log(error))
  }

  const nextListNotiTele = () => {
    if (filter.Pi >= PageCount) {
      setHasMore(false)
    } else {
      setFilter(prevState => ({
        ...prevState,
        Pi: prevState.Pi + 1
      }))
    }
  }

  const onSubmit = async values => {
    setBtnLoading(true)
    const newNoti = {
      noti: {
        ...values.noti
      }
    }
    const newHis = {
      items: [
        {
          MemberID: values.noti.MemberID,
          Content: values.Content,
          Type: 'PROCESS',
          Result: values.Result ? values.Result.value : ''
        }
      ],
      delete: []
    }
    try {
      await telesalesApi.addNotiMember(newNoti)
      await telesalesApi.addCareHistory(newHis)
      if (filter.Pi > 1) {
        setFilter(prevState => ({ ...prevState, Pi: 1 }))
      } else {
        getListNotiTele()
      }
      window.top?.toastr &&
        window.top?.toastr.success('Cập nhập thành công.', '', {
          timeOut: 1500
        })
      document.body.click()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-content-right max-w-400px"
      scrollable={true}
      enforceFocus={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="text-uppercase">Lịch nhắc</span>
          {PageTotal ? (
            <span className="pl-8px">
              <span className="pr-5px">-</span>
              <span className="text-danger pl-3px">{PageTotal}</span>
              <span className="pl-5px font-label text-muted font-size-sm text-none">
                khách có lịch nhắc
              </span>
            </span>
          ) : (
            ''
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0" id="scrollableDiv">
        <InfiniteScroll
          dataLength={ListData.length}
          next={nextListNotiTele}
          hasMore={hasMore}
          loader={
            <div className="reminder-item">
              <div className="reminder-item__name">
                <span>
                  <Skeleton count={1} width={150} height={18} />
                </span>
              </div>
              <div className="px-15px">
                {Array(1)
                  .fill()
                  .map((item, idx) => (
                    <div
                      className="bg-light rounded-sm p-15px mt-10px"
                      key={idx}
                    >
                      <div className="d-flex justify-content-between">
                        <span className="font-number fw-500">
                          <Skeleton count={1} width={130} height={15} />
                        </span>
                      </div>
                      <div className="mt-5px fw-300">
                        <Skeleton count={2} height={15} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {loading && (
            <>
              {loading &&
                Array(2)
                  .fill()
                  .map((item, index) => (
                    <div className="reminder-item" key={index}>
                      <div className="reminder-item__name">
                        <span>
                          <Skeleton count={1} width={150} height={18} />
                        </span>
                      </div>
                      <div className="px-15px">
                        {Array(2)
                          .fill()
                          .map((item, idx) => (
                            <div
                              className="bg-light rounded-sm p-15px mt-10px"
                              key={idx}
                            >
                              <div className="d-flex justify-content-between">
                                <span className="font-number fw-500">
                                  <Skeleton count={1} width={130} height={15} />
                                </span>
                              </div>
                              <div className="mt-5px fw-300">
                                <Skeleton count={2} height={15} />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
            </>
          )}
          {!loading && (
            <>
              {ListData && ListData.length > 0 ? (
                <>
                  {ListData.map((item, index) => (
                    <div className="reminder-item" key={index}>
                      <div className="reminder-item__name">
                        <span>{item?.member?.FullName}</span>
                      </div>
                      <div className="px-15px">
                        {item.lst &&
                          item.lst.map((noti, idx) => (
                            <div
                              className="bg-light rounded-sm p-15px mt-10px"
                              key={idx}
                            >
                              <div className="d-flex justify-content-between">
                                <span className="font-number fw-500">
                                  {moment(item.CreateDate).format(
                                    'HH:mm DD-MM-YYYY'
                                  )}
                                </span>
                                <div>
                                  <OverlayComponent
                                    onSubmit={onSubmit}
                                    btnLoading={btnLoading}
                                    Button={() =>
                                      teleAdv && (
                                        <span className="fw-500 cursor-pointer btn btn-xs btn-success">
                                          Thực hiện
                                        </span>
                                      )
                                    }
                                    item={{
                                      member: item.member,
                                      notifications: noti
                                    }}
                                  />
                                </div>
                              </div>
                              {noti.Date && (
                                <div className="mt-8px fw-500">
                                  Ngày nhắc
                                  <span className="pl-5px">
                                    {moment(noti.Date).format('DD-MM-YYYY')}
                                  </span>
                                  {noti.IsNoti && (
                                    <span className="pl-5px font-size-xs text-success">
                                      - Đã nhắc
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="mt-5px fw-300">
                                Nội dung :
                                <span className="fw-500 pl-5px">
                                  {noti.Desc}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="w-100 h-350px d-flex align-items-center justify-content-center">
                  <div>
                    <img
                      className="w-100 max-w-300px"
                      src={AssetsHelpers.toAbsoluteUrl(
                        '/_assets/images/data-empty.png'
                      )}
                      alt="Không có dữ liệu"
                    />
                    <div className="text-center font-size-base mt-15px fw-300">
                      Không có lịch nhắc.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </InfiniteScroll>
      </Modal.Body>
    </Modal>
  )
}

export default ReminderCalendar
