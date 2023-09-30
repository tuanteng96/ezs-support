import { createSlice } from '@reduxjs/toolkit'

const Telesales = createSlice({
  name: 'telesales',
  initialState: {
    filters: {
      tele_process: '', //Đang tiếp cận,Đặt lịch thành công
      tele_user_id: '',
      wishlist: '', // id,id san_pham
      birthDateFrom: '', //31/12
      birthDateTo: '', //31/12
      bookDateFrom: '', // dd/mm/yyyy
      bookDateTo: '', // dd/mm/yyyy
      last_used: '',
      remains: '', //
      key: '',
      emptyStaff: false,
      NotiFrom: '',
      NotiTo: '',
      HasNoti: false,
      StockID: '',
      CreateFrom: '',
      CreateTo: ''
    }
  },
  reducers: {
    setFiltersTeles: (state, { payload }) => {
      return {
        ...state,
        filters: {
          ...payload.filter
        }
      }
    }
  }
})

const { reducer, actions } = Telesales
export const { setFiltersTeles } = actions
export default reducer
