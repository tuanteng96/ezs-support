import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import { ReminderContext } from '../..'
import Sidebar from '../../components/Sidebar'
import telesalesApi from 'src/api/telesales.api'
import Navbar from 'src/components/Navbar/Navbar'
import uniqid from 'uniqid'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { Form, Formik } from 'formik'
import SelectTeleHis from 'src/components/Selects/SelectTeleHis'
import clsx from 'clsx'
import * as Yup from 'yup'

import moment from 'moment'
import 'moment/locale/vi'
import { Link, useLocation } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'

moment.locale('vi')

const convertArray = arrays => {
  const newArray = []
  if (!arrays || arrays.length === 0) {
    return newArray
  }
  for (let [index, obj] of arrays.entries()) {
    for (let [x, noti] of obj.lst.entries()) {
      const newObj = {
        NotiCreateDate: noti.CreateDate,
        NotiDate: noti.Date,
        Desc: noti.Desc,
        IsNoti: noti.IsNoti,
        member: obj.member,
        lst: obj.lst,
        DetailNoti: noti,
        Ids: uniqid(),
        rowIndex: index,
        rowSpan: x === 0 ? obj.lst.length : 1
      }
      newArray.push(newObj)
    }
  }
  return newArray
}

function checkGG(fn) {
  if (
    window.GC &&
    window.GC.Spread &&
    window.GC.Spread.Excel &&
    window.GC.Spread.Excel.IO
  ) {
    fn()
  } else {
    setTimeout(() => {
      checkGG(fn)
    }, 50)
  }
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

function ReminderList(props) {
  const { CrStockID, teleAdv, User } = useSelector(({ auth }) => ({
    CrStockID: auth?.Info?.CrStockID || '',
    teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false,
    User: auth?.Info?.User
  }))
  const { pathname, state, search } = useLocation()

  const query = new URLSearchParams(search)
  const isMy = query.get('auth') === 'my';

  const [ListReminder, setListReminder] = useState([])
  const [loading, setLoading] = useState(false)
  const [PageCount, setPageCount] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)
  const [btnLoading, setBtnLoading] = useState(false)
  const [IsLoadingEx, setIsLoadingEx] = useState(false)
  const [filters, setFilters] = useState(
    state?.filters
      ? state?.filters
      : {
          DateTo: isMy ? new Date() : '', // DD-MM-YYYY
          DateFrom: isMy ? new Date() : '', // DD-MM-YYYY
          StockID: CrStockID,
          IsNoti: {
            value: 0,
            label: 'Chưa nhắc'
          }, // 0, 1
          UserID: !teleAdv || isMy
            ? {
                label: User.FullName,
                value: User.ID
              }
            : '',
          Pi: 1,
          Ps: 15
        }
  )

  const { onOpenSidebar } = useContext(ReminderContext)
  const { width } = useWindowSize()

  useEffect(() => {
    getListReminder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListReminder = callback => {
    setLoading(true)
    const newFilter = {
      ...filters,
      DateFrom: filters.DateFrom
        ? moment(filters.DateFrom).format('DD/MM/YYYY')
        : '',
      DateTo: filters.DateTo ? moment(filters.DateTo).format('DD/MM/YYYY') : '',
      UserID: filters.UserID ? filters.UserID.value : '',
      IsNoti: filters.IsNoti ? filters.IsNoti.value : '',
      Pi: callback ? 1 : filters.Pi
    }
    telesalesApi
      .getMemberTeleNoti(newFilter)
      .then(({ data }) => {
        if (data.error) {
          setLoading(false)
          // Xử lí lỗi
        } else {
          const { List, Pcount, Total } = {
            List: data?.lst || [],
            Pcount: data?.PCount || 0,
            Total: data?.Total || 0
          }
          setListReminder(convertArray(List))
          setPageCount(Pcount)
          setPageTotal(Total)
          setLoading(false)
          callback && callback()
        }
      })
      .catch(error => console.log(error))
  }

  const onRefresh = callback => {
    getListReminder(() => {
      callback && callback()
    })
  }

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowData }) => rowData.rowIndex + 1,
        width: 60,
        sortable: false,
        align: 'center',
        rowSpan: ({ rowData }) => rowData.rowSpan || 1
      },
      {
        key: 'member.FullName',
        title: 'Họ tên khách hàng',
        dataKey: 'member.FullName',
        width: 250,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="fw-600">{rowData?.member?.FullName}</div>
            <div className="font-number">{rowData?.member?.MobilePhone}</div>
          </div>
        ),
        sortable: false,
        rowSpan: ({ rowData }) => rowData.rowSpan || 1
      },
      {
        key: 'NotiCreateDate',
        title: 'Ngày tạo',
        dataKey: 'NotiCreateDate',
        cellRenderer: ({ rowData }) =>
          moment(rowData.NotiCreateDate).format('HH:mm DD/MM/YYYY'),
        width: 250,
        sortable: false
      },
      {
        key: 'NotiDate',
        title: 'Ngày nhắc',
        dataKey: 'NotiDate',
        cellRenderer: ({ rowData }) =>
          moment(rowData.NotiDate).format('HH:mm DD/MM/YYYY'),
        width: 250,
        sortable: false
      },
      {
        key: 'Desc',
        title: 'Nội dung',
        dataKey: 'Desc',
        width: 350,
        sortable: false
      },
      {
        key: 'IsNoti',
        title: 'Trạng thái',
        dataKey: 'IsNoti',
        cellRenderer: ({ rowData }) => (
          <div className="cursor-pointer">
            {rowData.IsNoti ? (
              <span className="badge bg-primary">Đã nhắc</span>
            ) : (
              <span className="badge bg-danger">Chưa nhắc</span>
            )}
          </div>
        ),
        width: 130,
        sortable: false
        //frozen: width > 991 ? 'right' : false
      },
      {
        key: 'Action',
        title: 'Thực hiện',
        dataKey: 'Action',
        cellRenderer: ({ rowData }) => (
          <div>
            <button
              type="button"
              className={`fw-500 cursor-pointer btn btn-sm btn-${
                rowData?.IsNoti ? 'danger' : 'success'
              } py-5px`}
              onClick={() => onSubmit(rowData)}
            >
              {rowData?.IsNoti ? 'Chưa nhắc' : 'Thực hiện'}
            </button>
          </div>
        ),
        width: 110,
        sortable: false
      }
    ],
    [pathname, filters] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onSubmit = async values => {
    setBtnLoading(true)

    const newNoti = {
      noti: {
        MemberID: values?.DetailNoti?.MemberID,
        Date: moment(values?.DetailNoti?.Date).format('MM/DD/YYYY'),
        CreateDate: moment(values?.DetailNoti?.CreateDate).format('MM/DD/YYYY'),
        Desc: values?.DetailNoti?.Desc,
        IsNoti: !values?.DetailNoti?.IsNoti,
        ID: values?.DetailNoti?.ID
      }
    }

    try {
      await telesalesApi.addNotiMember(newNoti)
      if (filters.Pi > 1) {
        setFilters(prevState => ({ ...prevState, Pi: 1 }))
      } else {
        getListReminder()
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

  const onFilter = values => {
    setFilters(prevState => ({ ...prevState, ...values, Pi: 1 }))
  }

  const rowRenderer = ({ rowData, rowIndex, cells, columns, isScrolling }) => {
    const indexList = [0, 1]
    for (let index of indexList) {
      const rowSpan = columns[index].rowSpan({ rowData, rowIndex })
      if (rowSpan > 1) {
        const cell = cells[index]
        const style = {
          ...cell.props.style,
          backgroundColor: '#fff',
          height: rowSpan * 59 - 1,
          alignSelf: 'flex-start',
          zIndex: 1
        }
        cells[index] = React.cloneElement(cell, { style })
      }
    }
    return cells
  }

  const onPagesChange = ({ Pi, Ps }) => {
    setFilters({ ...filters, Pi, Ps })
  }

  const ExportExcel = () => {
    setIsLoadingEx(true)
    checkGG(() => {
      const newFilter = {
        ...filters,
        DateFrom: filters.DateFrom
          ? moment(filters.DateFrom).format('DD/MM/YYYY')
          : '',
        DateTo: filters.DateTo
          ? moment(filters.DateTo).format('DD/MM/YYYY')
          : '',
        UserID: filters.UserID ? filters.UserID.value : '',
        IsNoti: filters.IsNoti ? filters.IsNoti.value : '',
        pi: 1,
        ps: PageTotal
      }

      telesalesApi.getMemberTeleNoti(newFilter).then(({ data }) => {
        window?.EzsExportExcel &&
          window?.EzsExportExcel({
            Url: 'telesale-reminder',
            Data: {
              data: data,
              params: filters
            },
            hideLoading: () => setIsLoadingEx(false)
          })
      })
    })
  }

  return (
    <div className="d-flex h-100 telesales-list">
      <Sidebar
        filters={filters}
        loading={loading}
        onSubmit={onFilter}
        onRefresh={onRefresh}
      />
      <div className="telesales-list__content flex-fill px-15px px-lg-20px pb-15px pb-lg-20px d-flex flex-column">
        <div className="border-bottom py-10px fw-600 font-size-lg position-relative d-flex justify-content-between align-items-center">
          <div className="flex-1">
            <span className="text-uppercase">Lịch nhắc -</span>
            <span className="text-danger pl-3px">{PageTotal}</span>
            <span className="pl-5px font-label text-muted font-size-sm text-none">
              khách hàng
            </span>
          </div>
          <div className="w-85px w-md-auto d-flex">
            <Navbar ExportExcel={ExportExcel} IsLoadingEx={IsLoadingEx} />
            <button
              type="button"
              className="btn btn-primary d-lg-none ml-5px"
              onClick={onOpenSidebar}
            >
              <i className="fa-solid fa-filters"></i>
            </button>
          </div>
        </div>
        <div className="flex-grow-1">
          <ReactBaseTableInfinite
            rowKey="Ids"
            columns={columns}
            data={ListReminder}
            loading={loading}
            pageCount={PageCount}
            onEndReachedThreshold={300}
            rowHeight={60}
            onPagesChange={onPagesChange}
            rowRenderer={rowRenderer}
            filters={filters}
          />
        </div>
      </div>
    </div>
  )
}

export default ReminderList
