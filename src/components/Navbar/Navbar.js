import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'
import moment from 'moment'
import 'moment/locale/vi'
import { useSelector } from 'react-redux'
import telesalesApi from 'src/api/telesales.api'
import clsx from 'clsx'

moment.locale('vi')

function Navbar({ ExportExcel, IsLoadingEx }) {
  const { pathname } = useLocation()
  const navigation = useNavigate()
  const { width } = useWindowSize()
  const [bagde, setBagde] = useState(0)

  const { CrStockID, User } = useSelector(({ auth }) => ({
    CrStockID: auth?.Info?.CrStockID || '',
    teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false,
    User: auth?.Info?.User
  }))

  useEffect(() => {
    getListReminder()
  }, [])

  const getListReminder = callback => {
    const newFilter = {
      DateFrom: moment().format('DD/MM/YYYY'),
      DateTo: moment().format('DD/MM/YYYY'),
      StockID: CrStockID,
      IsNoti: 0, // 0, 1
      UserID: User.ID,
      Pi: 1,
      Ps: 500
    }
    telesalesApi
      .getMemberTeleNoti(newFilter)
      .then(({ data }) => {
        if (data.error) {
          // Xử lí lỗi
          setBagde(0)
        } else {
          setBagde(data?.Total || 0)
        }
      })
      .catch(error => console.log(error))
  }

  window.getListReminder = getListReminder

  return (
    <>
      {width > 767 ? (
        <>
          <button
            className="btn btn-success fw-500 py-6px d-flex align-items-center mr-8px"
            type="button"
            onClick={() =>
              window?.top?.MemberEdit({
                Member: { ID: 0 },
                done: () => {
                  window?.top?.getListTelesales &&
                    window?.top?.getListTelesales()
                  if (pathname !== '/danh-sach') {
                    navigation('/')
                  }
                }
              })
            }
          >
            Thêm mới
          </button>
          <NavLink
            to="/danh-sach"
            className={({ isActive }) =>
              isActive
                ? 'btn btn-primary fw-500 py-6px d-flex align-items-center'
                : 'btn btn-out btn-default fw-500 py-6px'
            }
          >
            <i className="far fa-list pr-5px"></i>
            <span className="d-none d-md-inline-block">Danh sách</span>
          </NavLink>
          <NavLink
            to="/thong-ke/danh-sach"
            className={({ isActive }) =>
              isActive
                ? 'btn btn-primary ml-8px fw-500'
                : 'btn btn-out btn-default ml-8px fw-500'
            }
          >
            <i className="far fa-sort-amount-up-alt pr-5px"></i>
            <span className="d-none d-md-inline-block">Thống kê</span>
          </NavLink>
          <NavLink
            to={bagde > 0 ? "/lich-nhac/danh-sach?auth=my" : '/lich-nhac/danh-sach'}
            className={({ isActive }) =>
              clsx(
                'd-flex align-items-center',
                isActive
                  ? 'btn btn-primary ml-8px fw-500'
                  : `${bagde > 0 ? 'btn-danger' : 'btn-default'} btn btn-out ml-8px fw-500`
              )
            }
          >
            <i className={clsx('far fa-bells pr-5px', bagde > 0 && 'bell' )}></i>
            <span className="d-none d-md-inline-block">Lịch nhắc</span>
            {bagde > 0 && (
              <div
                className='text-danger'
                style={{
                  width: '18px',
                  height: '18px',
                  background: '#fff',
                  borderRadius: '100%',
                  fontSize: '13px',
                  lineHeight: '18px',
                  marginLeft: '8px',
                  fontWeight: '600',
                }}
              >
                {bagde}
              </div>
            )}
          </NavLink>
        </>
      ) : (
        <Dropdown>
          <Dropdown.Toggle className="dropdown-toggle btn-primary">
            <i className="far fa-list pr-5px"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <NavLink
              to="/danh-sach"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary fw-500 d-block py-8px text-decoration-none'
                  : 'fw-500 d-block py-8px text-decoration-none'
              }
            >
              <i className="far fa-list pr-5px"></i>
              <span>Danh sách</span>
            </NavLink>
            <NavLink
              to="/thong-ke/danh-sach"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary fw-500 d-block py-6px text-decoration-none'
                  : 'fw-500 d-block py-6px text-decoration-none'
              }
            >
              <i className="far fa-sort-amount-up-alt pr-5px"></i>
              <span>Thống kê</span>
            </NavLink>
            <NavLink
              to="/lich-nhac/danh-sach"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary fw-500 d-block py-6px text-decoration-none'
                  : 'fw-500 d-block py-6px text-decoration-none'
              }
            >
              <i className="far fa-bells pr-5px"></i>
              <span>Lịch nhắc</span>
            </NavLink>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  )
}

export default Navbar
