import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { createPortal } from 'react-dom'
import Skeleton from 'react-loading-skeleton'
import telesalesApi from 'src/api/telesales.api'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import Text from 'react-texty'

import moment from 'moment'
import 'moment/locale/vi'
import { Formik, Form } from 'formik'
import SelectTeleHis from 'src/components/Selects/SelectTeleHis'

moment.locale('vi')

const initialValues = {
  Content: '',
  Result: '',
  Audio: ''
}

const AddWishListSchema = Yup.object().shape({
  Content: Yup.string().required('Nhập ghi chú')
})

function PickerHistory({ children, data, onRefresh }) {
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
      getCareHistoryList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberID, visible])

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

  const onSubmit = (values, { resetForm }) => {
    setBtnLoading(true)
    const newData = {
      items: [
        {
          MemberID: MemberID,
          Content: values.Content,
          Type: 'PROCESS',
          Result: values.Result ? values.Result.value : '',
          Audio: values.Audio
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
          resetForm()
          window.top?.toastr &&
            window.top?.toastr.success('Thêm mới lịch sử thành công', '', {
              timeOut: 1500
            })
          document.body.click()
          // onRefresh(() => {
          //   setBtnLoading(false)
          //   setLoading(false)
          //   resetForm()
          //   window.top?.toastr &&
          //     window.top?.toastr.success('Thêm mới lịch sử thành công', '', {
          //       timeOut: 1500
          //     })
          //   document.body.click()
          // })
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
                // onRefresh(() => {
                //   window.top?.toastr &&
                //     window.top?.toastr.success('Xóa lịch sử thành công', '', {
                //       timeOut: 1500
                //     })
                //   resolve()
                // })
              })
            })
            .catch(error => console.log(error))
        }),
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  return (
    <>
      <div onClick={() => setVisible(true)}>
        {List.length > 0 || (data.TopTele && data.TopTele.length > 0) ? (
          <>
            {List.length > 0 ? (
              <>
                <div className="d-flex flex-column">
                  <div>
                    {moment(List[0].CreateDate).format('HH:mm DD-MM-YYYY')}
                    {List[0].Audio && (
                      <a
                        className="ml-10px"
                        href={'/upload/image/' + List[0].Audio}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fas fa-play"></i>
                      </a>
                    )}
                  </div>
                  <Text
                    className="flex-1 pr-10px"
                    style={{ width: '260px' }}
                    tooltipMaxWidth={280}
                  >
                    {List[0].Content}
                  </Text>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex flex-column">
                  <div>
                    {moment(data.TopTele[0].CreateDate).format(
                      'HH:mm DD-MM-YYYY'
                    )}
                    {data.TopTele[0].Audio && (
                      <a
                        className="ml-10px"
                        href={'/upload/image/' + data.TopTele[0].Audio}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fas fa-play"></i>
                      </a>
                    )}
                  </div>
                  <Text
                    className="flex-1 pr-10px"
                    style={{ width: '260px' }}
                    tooltipMaxWidth={280}
                  >
                    {data.TopTele[0].Content}
                  </Text>
                </div>
              </>
            )}
          </>
        ) : (
          <>Thêm kết quả chăm sóc</>
        )}
      </div>

      {/* {children({
        open: () => setVisible(true),
        close: () => setVisible(false)
      })} */}
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
                  Lịch sử chăm sóc
                </div>
                <div className="font-number font-size-base">
                  {data?.FullName} - {data.HandCardID} - {data?.MobilePhone}
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <div>
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
                  <Form className="p-15px border-bottom">
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
                        rows="2"
                        value={values.Content}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                    </div>
                    <div className="font-weight-bold d-flex justify-content-between pt-10px">
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
          <div
            className="overflow-auto flex-grow-1 p-15px"
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
                        Không có lịch nhắc.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>,
        document.body
      )}
    </>
  )
}

export default PickerHistory
