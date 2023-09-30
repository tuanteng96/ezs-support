import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import Skeleton from 'react-loading-skeleton'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import SelectTeleHis from 'src/components/Selects/SelectTeleHis'
import PerfectScrollbar from 'react-perfect-scrollbar'

import moment from 'moment'
import 'moment/locale/vi'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'

moment.locale('vi')

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const initialValues = {
  Content: '',
  Result: ''
}

const AddWishListSchema = Yup.object().shape({
  Content: Yup.string().required('Nhập ghi chú')
})

function CareHistory(props) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [List, setList] = useState([])
  const [btnLoading, setBtnLoading] = useState(false)

  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv || false
  }))

  useEffect(() => {
    getCareHistoryList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCareHistoryList = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    const filters = {
      filter: {
        MemberID: MemberID
      },
      pi: 1,
      ps: 1000
    }
    telesalesApi
      .getCareHistory(filters)
      .then(({ data }) => {
        setList(data.data)
        setLoading(false)
        callback && callback()
      })
      .catch(error => console.log(error))
  }

  const onSubmit = values => {
    setBtnLoading(true)
    const newData = {
      items: [
        {
          MemberID: MemberID,
          Content: values.Content,
          Type: 'PROCESS',
          Result: values.Result ? values.Result.value : ''
        }
      ],
      delete: []
    }
    telesalesApi
      .addCareHistory(newData)
      .then(response => {
        getCareHistoryList(false, () => {
          setBtnLoading(false)
          setLoading(false)
          window.top?.toastr &&
            window.top?.toastr.success('Thêm mới lịch sử thành công', '', {
              timeOut: 1500
            })
          document.body.click()
        })
      })
      .catch(error => console.log(error))
  }

  const onDelete = item => {
    const newData = {
      delete: [item.ID]
    }
    Swal.fire({
      title: 'Thực hiện xóa ?',
      html: `Bạn đang thực hiện xóa lịch sử này không.`,
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
            .addCareHistory(newData)
            .then(response => {
              getCareHistoryList(false, () => {
                window.top?.toastr &&
                  window.top?.toastr.success('Xóa lịch sử thành công', '', {
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
    <div>
      <div className="text-uppercase d-flex justify-content-between align-items-center pt-18px pl-18px pr-18px pb-10px">
        <span className="fw-600 text-primary">Lịch sử chăm sóc</span>
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
                validationSchema={AddWishListSchema}
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
                        Thêm mới lịch sử
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
                          Thêm mới
                        </button>
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </Popover>
          }
        >
          <button className="btn btn-xs btn-success">Thêm mới</button>
        </OverlayTrigger>
      </div>
      <PerfectScrollbar
        options={perfectScrollbarOptions}
        className="scroll pl-18px pr-18px pb-18px max-h-300px"
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
                  {item.Result && (
                    <div className="mt-8px fw-500">
                      <span className="text-danger">{item.Result}</span>
                      <span className="pl-5px">- {item.TeleName}</span>
                    </div>
                  )}
                  <div className="mt-5px fw-300">{item.Content}</div>
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
                    Không có lịch sử.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </PerfectScrollbar>
    </div>
  )
}

export default CareHistory
