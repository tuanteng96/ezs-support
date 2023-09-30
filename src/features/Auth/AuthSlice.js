import { createSlice } from '@reduxjs/toolkit'

const Auth = createSlice({
  name: 'auth',
  initialState: {
    Info: window.top.Info,
    Token: window.top.token
  },
  reducers: {
    setProfile: (state, { payload }) => {
      //Unauthorized
      let PermissionStocks = []
      let PermissionStocksAdv = []
      if (
        payload?.Info?.rightsSum?.tele?.hasRight ||
        payload?.Info?.rightsSum?.teleAdv?.hasRight
      ) {
        if (
          payload?.Info?.rightsSum?.tele?.stocks &&
          !payload?.Info?.rightsSum?.tele?.IsAllStock
        ) {
          PermissionStocks = payload?.Info?.rightsSum?.tele?.stocks || []
        } else {
          PermissionStocks = 'All Stocks'
        }

        if (
          payload?.Info?.rightsSum?.teleAdv?.stocks &&
          !payload?.Info?.rightsSum?.teleAdv?.IsAllStock
        ) {
          PermissionStocksAdv = payload?.Info?.rightsSum?.teleAdv?.stocks || []
        } else {
          PermissionStocksAdv = 'All Stocks'
        }
      } else {
        PermissionStocks = '401 Unauthorized'
        PermissionStocksAdv = '401 Unauthorized'
      }
      return {
        ...state,
        Token: payload.token,
        Info: payload.Info,
        PermissionStocks: PermissionStocks,
        PermissionStocksAdv: PermissionStocksAdv
      }
    }
  }
})

const { reducer, actions } = Auth
export const { setProfile } = actions
export default reducer
