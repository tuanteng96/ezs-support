import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import telesalesApi from 'src/api/telesales.api'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import Sidebar from './components/Sidebar'
import { Overlay } from 'react-bootstrap'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'
import SelectStaffs from 'src/components/Selects/SelectStaffs'
import { TelesalesContext } from '../..'
import { useWindowSize } from 'src/hooks/useWindowSize'
import Text from 'react-texty'
import ReminderCalendar from './components/ReminderCalendar'
import Navbar from 'src/components/Navbar/Navbar'

import moment from 'moment'
import 'moment/locale/vi'
import { setFiltersTeles } from '../../TelesalesSlice'
import SelectProgress from 'src/components/Selects/SelectProgress'
import PickerHistory from './components/PickerHistory'
import PickerReminder from './components/PickerReminder'
import PickerStatus from './components/PickerStatus'

moment.locale('vi')

const EditableCell = ({ rowData, container, showEditing, hideEditing }) => {
  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false
  }))
  const [Editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [value, setValue] = useState(
    rowData?.TeleUser?.ID > 0
      ? { label: rowData?.TeleUser?.FullName, value: rowData?.TeleUser?.ID }
      : null
  )
  const target = useRef(null)

  useEffect(() => {
    setValue(
      rowData?.TeleUser?.ID > 0
        ? { label: rowData?.TeleUser?.FullName, value: rowData?.TeleUser?.ID }
        : null
    )
  }, [rowData?.TeleUser])

  const handleClick = () => {
    if (!teleAdv) return
    setEditing(true)
    showEditing()
  }

  const handleHide = () => {
    setEditing(false)
    hideEditing()
  }

  const onSubmit = options => {
    setLoading(true)
    const newData = {
      items: [
        {
          MemberID: rowData.ID,
          TeleUserID: options ? options.value : null
        }
      ]
    }
    telesalesApi
      .setUserIDTelesales(newData)
      .then(response => {
        setValue(options)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }

  return (
    <div
      className="h-100 d-flex align-items-center cursor-pointer"
      ref={target}
      onClick={() => handleClick()}
    >
      {!Editing && (
        <>
          {value ? value.label : 'Chọn nhân viên'}
          {teleAdv && (
            <i className="fa-solid fa-user-pen pl-8px font-size-base text-muted"></i>
          )}
        </>
      )}
      {Editing && target && (
        <Overlay
          target={target.current}
          show={Editing}
          placement="right"
          //container={container}
          onHide={handleHide}
          rootClose
        >
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                position: 'absolute',
                width: 190,
                ...props.style
              }}
            >
              <SelectStaffs
                isLoading={loading}
                className="select-control"
                //menuPosition="fixed"
                name="filter.tele_user_id"
                //menuIsOpen={true}
                onChange={otp => {
                  onSubmit(otp)
                }}
                value={value}
                isClearable={true}
                adv={true}
              />
            </div>
          )}
        </Overlay>
      )}
    </div>
  )
}

const EditableCellProcess = ({
  rowData,
  container,
  showEditing,
  hideEditing
}) => {
  const [Editing, setEditing] = useState(false)

  const [value, setValue] = useState(
    rowData?.TeleTags
      ? rowData?.TeleTags.split(',').map(x => ({ label: x, value: x }))
      : null
  )
  const target = useRef(null)

  useEffect(() => {
    setValue(
      rowData?.TeleTags
        ? rowData?.TeleTags.split(',').map(x => ({ label: x, value: x }))
        : null
    )
  }, [rowData?.TeleTags])

  const handleClick = () => {
    setEditing(true)
    showEditing()
  }

  const handleHide = () => {
    setEditing(false)
    hideEditing()
  }

  const onSubmit = options => {
    let newData = {
      items: [
        {
          MemberID: rowData?.ID,
          TeleTags: options ? options.map(x => x.value).join(',') : ''
        }
      ]
    }
    telesalesApi
      .editTagsMember(newData)
      .then(response => {
        setValue(options)
      })
      .catch(error => console.log(error))
  }

  return (
    <div
      className="h-100 d-flex align-items-center cursor-pointer"
      ref={target}
      onClick={() => handleClick()}
    >
      {!Editing && (
        <>
          {value && value.length > 0
            ? value.map(x => x.value).join(',')
            : 'Chọn trạng thái'}
        </>
      )}
      {Editing && target && (
        <Overlay
          target={target.current}
          show={Editing}
          placement="right"
          //container={container}
          onHide={handleHide}
          rootClose
        >
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                position: 'absolute',
                width: 220,
                ...props.style
              }}
            >
              <SelectProgress
                //isDisabled={loading}
                isMulti
                className="w-100 flex-1"
                placeholder="Chọn trạng thái khách"
                onChange={onSubmit}
                value={value}
              />
            </div>
          )}
        </Overlay>
      )}
    </div>
  )
}

const EditableCellNote = ({ rowData, container, showEditing, hideEditing }) => {
  const [Editing, setEditing] = useState(false)

  const [value, setValue] = useState(rowData?.Desc)
  const target = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValue(rowData?.Desc)
  }, [rowData?.Desc])

  const handleClick = () => {
    setEditing(true)
    showEditing()
  }

  const handleHide = () => {
    setEditing(false)
    hideEditing()
  }

  const onSubmit = e => {
    const value = e.target.value

    const newData = {
      items: [
        {
          MemberID: rowData?.ID,
          Note: value
        }
      ]
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      telesalesApi
        .editNoteMember(newData)
        .then(response => {
          //setValue(value)
        })
        .catch(error => console.log(error))
    }, 300)
  }

  return (
    <div
      className="h-100 d-flex align-items-center cursor-pointer w-full"
      ref={target}
      onClick={() => handleClick()}
    >
      {!Editing && (
        <div
          className="text-truncate"
          style={{
            width: 290
          }}
        >
          <Text tooltipMaxWidth={290}>{value || 'Nhập ghi chú'}</Text>
        </div>
      )}
      {Editing && target && (
        <Overlay
          target={target.current}
          show={Editing}
          placement="right"
          //container={container}
          onHide={handleHide}
          rootClose
        >
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                position: 'absolute',
                width: 260,
                ...props.style
              }}
            >
              <div>
                <textarea
                  className="w-100 form-control p-12px fw-500"
                  rows="5"
                  placeholder="Nhập ghi chú"
                  onChange={e => setValue(e.target.value)}
                  onBlur={onSubmit}
                  value={value}
                ></textarea>
              </div>
            </div>
          )}
        </Overlay>
      )}
    </div>
  )
}

const columnsSort = window?.top?.GlobalConfig?.Admin?.kpiSortColumn || null

function TelesalesList(props) {
  const { User, teleAdv, CrStockID, filtersRedux } = useSelector(
    ({ auth, telesales }) => ({
      User: auth?.Info?.User,
      teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false,
      CrStockID: auth?.Info?.CrStockID || '',
      filtersRedux: telesales.filters
    })
  )
  const [ListTelesales, setListTelesales] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCall, setLoadingCall] = useState('')
  const [PageCount, setPageCount] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)
  const [IsEditing, setIsEditing] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [IsLoadingEx, setIsLoadingEx] = useState(false)

  const { onOpenSidebar } = useContext(TelesalesContext)
  const dispatch = useDispatch()

  const [filters, setFilters] = useState({
    withsNoti: true,
    filter: {
      tele_process: filtersRedux.tele_process || '', //Đang tiếp cận,Đặt lịch thành công
      tele_user_id: '',
      wishlist: filtersRedux.wishlist || '', // id,id san_pham
      birthDateFrom: filtersRedux.birthDateFrom || '', //31/12
      birthDateTo: filtersRedux.birthDateTo || '', //31/12
      bookDateFrom: filtersRedux.bookDateFrom || '', // dd/mm/yyyy
      bookDateTo: filtersRedux.bookDateTo || '', // dd/mm/yyyy
      last_used: filtersRedux.last_used || '',
      remains: filtersRedux.remains || '', //
      key: filtersRedux.key || '',
      emptyStaff: filtersRedux.emptyStaff || false,
      NotiFrom: filtersRedux.NotiFrom || '',
      NotiTo: filtersRedux.NotiTo || '',
      HasNoti: filtersRedux.HasNoti || false,
      StockID: filtersRedux.StockID || CrStockID,
      CreateFrom: filtersRedux.CreateFrom || '',
      CreateTo: filtersRedux.CreateTo || ''
    },
    pi: 1,
    ps: 20
  })

  const { width } = useWindowSize()

  useEffect(() => {
    getListTelesales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListTelesales = callback => {
    setLoading(true)
    let tele_user_id_new = ''
    if (filters.filter.emptyStaff) {
      tele_user_id_new = 0
    } else {
      tele_user_id_new = filters.filter.tele_user_id
        ? filters.filter.tele_user_id.map(x => x.value).join(',')
        : ''
    }
    const newFilter = {
      ...filters,
      filter: {
        ...filters.filter,
        tele_user_id: tele_user_id_new,
        tele_process: filters.filter.tele_process
          ? filters.filter.tele_process.join(',')
          : '',
        wishlist: filters.filter.wishlist
          ? filters.filter.wishlist.map(wish => wish.value).join(',')
          : '',
        birthDateFrom: filters.filter.birthDateFrom
          ? moment(filters.filter.birthDateFrom).format('DD/MM')
          : '',
        birthDateTo: filters.filter.birthDateTo
          ? moment(filters.filter.birthDateTo).format('DD/MM')
          : '',
        bookDateFrom: filters.filter.bookDateFrom
          ? moment(filters.filter.bookDateFrom).format('DD/MM/YYYY')
          : '',
        bookDateTo: filters.filter.bookDateTo
          ? moment(filters.filter.bookDateTo).format('DD/MM/YYYY')
          : '',
        NotiFrom: filters.filter.NotiFrom
          ? moment(filters.filter.NotiFrom).format('DD/MM/YYYY')
          : '',
        NotiTo: filters.filter.NotiTo
          ? moment(filters.filter.NotiTo).format('DD/MM/YYYY')
          : '',
        CreateFrom: filters.filter.CreateFrom
          ? moment(filters.filter.CreateFrom).format('DD/MM/YYYY')
          : '',
        CreateTo: filters.filter.CreateTo
          ? moment(filters.filter.CreateTo).format('DD/MM/YYYY')
          : ''
      },
      pi: callback ? 1 : filters.pi
    }

    telesalesApi
      .getListMemberTelesales(newFilter)
      .then(({ data }) => {
        if (data.error) {
          setLoading(false)
          // Xử lí lỗi
        } else {
          const { List, PCount, Total } = {
            List: data?.data || [],
            Pcount: data?.pCount || 0,
            Total: data?.total || 0
          }
          if (filters.pi > 1) {
            setListTelesales(prevState => [...prevState, ...List])
          } else {
            setListTelesales(List)
          }
          setPageCount(PCount)
          setPageTotal(Total)
          setLoading(false)
          callback && callback()
        }
      })
      .catch(error => console.log(error))
  }

  window.top.getListTelesales = getListTelesales

  window.updateMemberTelesale = key => {
    return new Promise(function (resolve, reject) {
      const newFilter = {
        withsNoti: true,
        filter: {
          tele_process: '',
          tele_user_id: '',
          wishlist: '',
          birthDateFrom: '',
          birthDateTo: '',
          bookDateFrom: '',
          bookDateTo: '',
          last_used: '',
          remains: '',
          key: key,
          emptyStaff: false,
          NotiFrom: '',
          NotiTo: '',
          HasNoti: false,
          StockID: '',
          CreateFrom: '',
          CreateTo: ''
        },
        pi: 1,
        ps: 20
      }
      telesalesApi.getListMemberTelesales(newFilter).then(({ data }) => {
        if (data && data.data && data.data.length > 0) {
          let crMember = data.data[0]
          let newList = ListTelesales ? [...ListTelesales] : []

          let index = newList.findIndex(x => x.ID === crMember.ID)
          if (index > -1) {
            newList[index] = crMember
          }

          setListTelesales(newList)
        }
        resolve()
      })
    })
  }

  const onRefresh = callback => {
    if (filters.pi > 1) {
      setFilters(prevState => ({ ...prevState, pi: 1 }))
      callback && callback()
    } else {
      getListTelesales(() => {
        callback && callback()
      })
    }
  }

  const callNow = phone => {
    if (!phone) return
    setLoadingCall(phone)
    telesalesApi
      .callNow({ Phone: phone })
      .then(({ data }) => {
        if (data?.error) {
          window?.top?.toastr?.error(data?.error, '', { timeOut: 1000 })
        }
        setLoadingCall('')
      })
      .catch(err => {
        console.log(err)
      })
  }
  const columns = useMemo(
    () => {
      let newColumns = [
        {
          key: 'CreateDate',
          title: 'Ngày tạo & Cơ sở',
          dataKey: 'CreateDate',
          cellRenderer: ({ rowData }) => (
            <div>
              <div className="fw-600">
                {moment(rowData?.CreateDate).format('DD-MM-YYYY')}
              </div>
            </div>
          ),
          width: 180,
          sortable: false
        },
        {
          key: 'FullName',
          title: 'Tên Spa',
          dataKey: 'FullName',
          cellRenderer: ({ rowData, container }) => (
            <div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  window?.top?.MemberEdit({
                    Member: rowData,
                    done: () =>
                      window?.top?.getListTelesales &&
                      window?.top?.getListTelesales()
                  })
                }
              >
                <div className="fw-600">{rowData?.FullName}</div>
              </div>
            </div>
          ),
          width: 200,
          sortable: false
        },
        {
          key: 'HomeAddress',
          title: 'Link Phần mềm',
          dataKey: 'HomeAddress',
          width: 290,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <a href={rowData.HomeAddress} target="_blank" rel="noreferrer">
              <Text
                tooltipMaxWidth={280}
                style={{ width: '260px', wordWrap: 'break-word' }}
                tooltipStyle={{ wordWrap: 'break-word' }}
              >
                {rowData.HomeAddress}
              </Text>
            </a>
          )
        },
        {
          key: 'CompanyName',
          title: 'Link QR Code app',
          dataKey: 'CompanyName',
          width: 290,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <a href={rowData.CompanyName} target="_blank" rel="noreferrer">
              <Text
                tooltipMaxWidth={280}
                style={{ width: '260px', wordWrap: 'break-word' }}
                tooltipStyle={{ wordWrap: 'break-word' }}
              >
                {rowData.CompanyName}
              </Text>
            </a>
          )
        },
        {
          key: 'OrganizeName',
          title: 'Link Quy trình bàn giao',
          dataKey: 'OrganizeName',
          width: 290,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <a href={rowData.OrganizeName} target="_blank" rel="noreferrer">
              <Text
                tooltipMaxWidth={280}
                style={{ width: '260px', wordWrap: 'break-word' }}
                tooltipStyle={{ wordWrap: 'break-word' }}
              >
                {rowData.OrganizeName}
              </Text>
            </a>
          )
        },
        {
          key: 'TeleTags',
          title: 'Trạng thái',
          dataKey: 'TeleTags',
          width: 250,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <PickerStatus data={rowData} onRefresh={onRefresh}></PickerStatus>
            // <EditableCellProcess
            //   rowData={rowData}
            //   container={container}
            //   hideEditing={() => setIsEditing(false)}
            //   showEditing={() => setIsEditing(true)}
            // />
          )
        },
        {
          key: 'TeleNote',
          title: 'Ghi chú',
          dataKey: 'TeleNote',
          width: 290,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <EditableCellNote
              rowData={rowData}
              container={container}
              hideEditing={() => setIsEditing(false)}
              showEditing={() => setIsEditing(true)}
            />
          )
        },
        {
          key: 'TopTele',
          title: 'Kết quả chăm sóc',
          cellRenderer: ({ rowData }) => (
            <PickerHistory data={rowData} onRefresh={onRefresh}>
              {/* {({ open }) => (
                <div onClick={open}>
                  {rowData.TopTele && rowData.TopTele.length > 0 ? (
                    <div className="d-flex flex-column">
                      <div>
                        {moment(rowData.TopTele[0].CreateDate).format(
                          'HH:mm DD-MM-YYYY'
                        )}
                        {rowData.TopTele[0].Audio && (
                          <a
                            className="ml-10px"
                            href={'/upload/image/' + rowData.TopTele[0].Audio}
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
                        {rowData.TopTele[0].Content}
                      </Text>
                    </div>
                  ) : (
                    <>Chưa có liên hệ</>
                  )}
                </div>
              )} */}
            </PickerHistory>
          ),
          dataKey: 'TopTele',
          width: 280,
          sortable: false
        },
        {
          key: 'reminder',
          title: 'Lịch nhắc',
          dataKey: 'reminder',
          width: 250,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <PickerReminder data={rowData} onRefresh={onRefresh}>
              {/* {({ open }) => (
                <div onClick={open}>
                  <div>
                    {rowData.NotiList && rowData.NotiList.length > 0 ? (
                      <>
                        <div className="mt-8px fw-500">
                          Ngày nhắc
                          <span className="pl-5px">
                            {moment(rowData.NotiList[0].Date).format(
                              'DD-MM-YYYY'
                            )}
                          </span>
                          {rowData.NotiList[0].IsNoti && (
                            <span className="pl-5px font-size-xs text-success">
                              - Đã nhắc
                            </span>
                          )}
                        </div>
                        <Text style={{ width: '230px' }} tooltipMaxWidth={250}>
                          Nội dung :
                          <span className="fw-500 pl-3px">
                            {rowData.NotiList[0].Desc}
                          </span>
                        </Text>
                      </>
                    ) : (
                      'Thêm lịch nhắc'
                    )}
                  </div>
                </div>
              )} */}
            </PickerReminder>
          )
        },
        {
          key: 'Staffs',
          title: 'Nhân viên phụ trách',
          dataKey: 'Staffs',
          width: 220,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <EditableCell
              rowData={rowData}
              container={container}
              hideEditing={() => setIsEditing(false)}
              showEditing={() => setIsEditing(true)}
            />
          )
        },

        {
          key: 'action',
          title: '',
          dataKey: 'action',
          cellRenderer: ({ rowData }) => (
            <div className="d-flex">
              <button
                disabled={loadingCall !== ''}
                type="button"
                onClick={() => callNow(rowData?.MobilePhone)}
                //href={`tel:${rowData?.MobilePhone}`}
                className="w-38px h-38px rounded-circle btn btn-success shadow mx-4px p-0 position-relative"
              >
                {loadingCall === rowData?.MobilePhone ? (
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <div className="spinner-border text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <img
                    className="w-23px position-absolute top-7px right-7px"
                    src={AssetsHelpers.toAbsoluteUrl(
                      '/_assets/images/icon-call.png'
                    )}
                    alt="Call"
                  />
                )}
              </button>
            </div>
          ),
          align: 'center',
          width: 80,
          sortable: false,
          frozen: width > 991 ? 'right' : false
        }
      ]
      if (columnsSort && columnsSort.length > 0) {
        newColumns = newColumns.map(clm => {
          let newClm = { ...clm }
          const indexSort = columnsSort.findIndex(x => x.key === clm.key)
          if (indexSort > -1) {
            newClm['order'] = columnsSort[indexSort]['order']
            newClm['isvisible'] = columnsSort[indexSort]['isvisible']
          }
          return newClm
        })
      }
      return newColumns
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, ListTelesales, loadingCall]
  )

  const handleEndReached = () => {
    if (ListTelesales.length < PageTotal) {
      setFilters(prevState => ({ ...prevState, pi: prevState.pi + 1 }))
    }
  }

  const onFilter = values => {
    dispatch(setFiltersTeles(values))
    setFilters(prevState => ({ ...prevState, ...values, pi: 1 }))
  }

  // const onOpenModal = () => {
  //   setIsModal(true)
  // }

  const onHideModal = () => {
    setIsModal(false)
  }

  const ExportExcel = () => {
    setIsLoadingEx(true)
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
            <span className="text-uppercase ">Danh sách -</span>
            <span className="text-danger pl-3px">{PageTotal}</span>
            <span className="pl-5px font-label text-muted font-size-sm text-none">
              khách hàng
            </span>
          </div>
          <div className="w-85px w-md-auto d-flex">
            <Navbar ExportExcel={ExportExcel} IsLoadingEx={IsLoadingEx} />
            {/* <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenModal}
            >
              <i className="far fa-bells pr-5px"></i>
              <span className="d-none d-md-inline-block">Lịch nhắc</span>
            </button> */}
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
            rowKey="ID"
            columns={columns}
            data={ListTelesales}
            loading={loading}
            pageCount={PageCount}
            onEndReachedThreshold={300}
            onEndReached={handleEndReached}
            rowHeight={80}
            onScroll={() => IsEditing && document.body.click()}
            //onPagesChange={onPagesChange}
            //rowRenderer={rowRenderer}
          />
        </div>
      </div>
      <ReminderCalendar show={isModal} onHide={onHideModal} filters={filters} />
    </div>
  )
}

export default TelesalesList
