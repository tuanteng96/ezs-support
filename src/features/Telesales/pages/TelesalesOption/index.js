import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'

export const MemberContext = React.createContext()

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function TelesalesOption({ ListProds, loading }) {
  return (
    <MemberContext.Provider value={{ ListProds, loading }}>
      <div className="h-100 d-flex flex-column">
        <PerfectScrollbar
          options={perfectScrollbarOptions}
          className="scroll d-flex h-40px bg-border"
          style={{ position: 'relative' }}
        >
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? 'text-primary bg-white' : ''
              } px-20px fw-600 d-flex align-items-center text-decoration-none text-uppercase font-size-sm min-w-90px justify-content-center`
            }
            to="dich-vu"
          >
            Thẻ liệu trình
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? 'text-primary bg-white' : ''
              } px-20px fw-600 d-flex align-items-center text-decoration-none text-uppercase font-size-sm min-w-110px justify-content-center`
            }
            to="san-pham"
          >
            Sản phẩm sắp hết
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? 'text-primary bg-white' : ''
              } px-20px fw-600 d-flex align-items-center text-decoration-none text-uppercase font-size-sm min-w-160px justify-content-center`
            }
            to="lich-su-mua-hang"
          >
            Lịch sử mua hàng
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? 'text-primary bg-white' : ''
              } px-20px fw-600 d-flex align-items-center text-decoration-none text-uppercase font-size-sm min-w-125px text-center`
            }
            to="lich-su-du-dung-dv"
          >
            Lịch sử SD DV
          </NavLink>
        </PerfectScrollbar>
        <div className="flex-grow-1 h-md-auto h-500px">
          <Outlet />
        </div>
      </div>
    </MemberContext.Provider>
  )
}

export default TelesalesOption
