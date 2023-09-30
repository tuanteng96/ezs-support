import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import SelectProduct from 'src/components/Selects/SelectProduct'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import Text from 'react-texty'
import Skeleton from 'react-loading-skeleton'
import Swal from 'sweetalert2'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const initialValues = {
  add_wishlist: null
}

const AddWishListSchema = Yup.object().shape({
  add_wishlist: Yup.array().required('Chọn sản phẩm')
})

function InterestedProducts(props) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [List, setList] = useState([])
  const [btnLoading, setBtnLoading] = useState(false)

  useEffect(() => {
    getWishListMember()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getWishListMember = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    const filters = {
      filter: {
        memberid: MemberID,
        key: ''
      },
      pi: 1,
      ps: 1000
    }
    telesalesApi
      .getWishListMember(filters)
      .then(({ data }) => {
        setList(data.items)
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
          reset: false,
          add_wishlist: values.add_wishlist.map(item => ({
            prodid: item.value,
            desc: item.title
          })),
          delete_wishlist: []
        }
      ]
    }
    telesalesApi
      .addWishListMember(newData)
      .then(response => {
        getWishListMember(false, () => {
          setBtnLoading(false)
          setLoading(false)
          window.top?.toastr &&
            window.top?.toastr.success(
              'Thêm sản phẩm quan tâm thành công',
              '',
              {
                timeOut: 1500
              }
            )
          document.body.click()
        })
      })
      .catch(error => console.log(error))
  }

  const onDelete = item => {
    const newData = {
      items: [
        {
          MemberID: MemberID,
          reset: false, // true => xóa trắng insert lại
          add_wishlist: [],
          delete_wishlist: [item.ID] //id san_pham
        }
      ]
    }
    Swal.fire({
      title: 'Thực hiện xóa ?',
      html: `Bạn đang thực hiện xóa sản phẩm <span class="text-danger">${item.Title}</span>.`,
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
            .addWishListMember(newData)
            .then(response => {
              getWishListMember(false, () => {
                window.top?.toastr &&
                  window.top?.toastr.success(
                    'Xóa sản phẩm quan tâm thành công',
                    '',
                    {
                      timeOut: 1500
                    }
                  )
                resolve()
              })
            })
            .catch(error => console.log(error))
        }),
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  return (
    <div className="border-bottom">
      <div className="text-uppercase d-flex justify-content-between align-items-center pt-18px pl-18px pr-18px pb-10px">
        <span className="fw-600 text-primary">SP khách hàng quan tâm</span>
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
                  const { values, touched, errors, handleBlur, setFieldValue } =
                    formikProps
                  return (
                    <Form>
                      <Popover.Header className="font-weight-bold text-uppercase d-flex justify-content-between py-3">
                        Thêm mới sản phẩm quan tâm
                      </Popover.Header>
                      <Popover.Body>
                        <div className="form-group">
                          <label>Sản phẩm, dịch vụ</label>
                          <SelectProduct
                            isMulti
                            isClearable
                            className={`select-control ${
                              errors?.add_wishlist && touched?.add_wishlist
                                ? 'is-invalid solid-invalid'
                                : ''
                            }`}
                            name="add_wishlist"
                            value={values.add_wishlist}
                            onChange={option => {
                              setFieldValue('add_wishlist', option, false)
                            }}
                            onBlur={handleBlur}
                          />
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
                  'bg-light rounded-sm d-flex overflow-hidden',
                  1 - 1 !== index && 'mb-12px'
                )}
                key={index}
              >
                <div className="flex-fill py-8px px-15px fw-500">
                  <Skeleton count={1} width={150} height={18} />
                </div>
                <div className="w-35px bg-danger d-flex align-items-center justify-content-center cursor-pointer">
                  <i className="fa-regular fa-xmark text-white"></i>
                </div>
              </div>
            ))}
        {!loading && (
          <>
            {List && List.length > 0 ? (
              List.map((item, index) => (
                <div
                  className={clsx(
                    'bg-light rounded-sm d-flex overflow-hidden',
                    List.length - 1 !== index && 'mb-12px'
                  )}
                  key={index}
                >
                  <div
                    className="flex-fill py-8px px-15px fw-500"
                    style={{ width: 'calc(100% - 35px)' }}
                  >
                    <Text tooltipMaxWidth={250}>{item.Title}</Text>
                  </div>
                  <div
                    className="w-35px bg-danger d-flex align-items-center justify-content-center cursor-pointer"
                    onClick={() => onDelete(item)}
                  >
                    <i className="fa-regular fa-xmark text-white"></i>
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
                    Không có sản phẩm.
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

export default InterestedProducts
