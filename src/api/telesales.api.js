import http from './configs/http'

const telesalesApi = {
  getListMemberTelesales: data => {
    return http.post('/api/v3/tele23@member_search', JSON.stringify(data))
  },
  setUserIDTelesales: data => {
    return http.post(
      '/api/v3/tele23@member_setTeleUserID',
      JSON.stringify(data)
    )
  },
  getMemberIDTelesales: MemberID => {
    return http.get(`/api/v3/tele23@member_id?memberid=${MemberID}`)
  },
  editTagsMember: data => {
    return http.post('/api/v3/tele23@edit_tags', JSON.stringify(data))
  },
  editNoteMember: data => {
    return http.post('/api/v3/tele23@edit_note', JSON.stringify(data))
  },
  getListBuydingProduct: ({ MemberID, pi, ps }) => {
    return http.get(
      `/api/v3/member23?cmd=da_mua&memberid=${MemberID}&pi=${pi}&ps=${ps}`
    )
  },
  getHisUseServices: MemberID => {
    return http.get(
      `/services/preview.aspx?a=1&cmd=loadOrderService&MemberID=${MemberID}&IsMember=0&fromOrderAdd=0`
    )
  },
  getListProductInDate: data => {
    return http.post('/api/v3/tele23@prods_indate', JSON.stringify(data))
  },
  addWishListMember: data => {
    return http.post('/api/v3/tele23@member_wishlist', JSON.stringify(data))
  },
  getWishListMember: data => {
    return http.post(
      '/api/v3/tele23@member_wishlist_list',
      JSON.stringify(data)
    )
  },
  addCareHistory: data => {
    return http.post('/api/v3/tele23@edit_tele', JSON.stringify(data))
  },
  getCareHistory: data => {
    return http.post('/api/v3/tele23@list_tele', JSON.stringify(data))
  },
  getNotiMember: data => {
    return http.post('/api/v3/Tele23@notiList', JSON.stringify(data))
  },
  addNotiMember: data => {
    return http.post('/api/v3/Tele23@notiEdit', JSON.stringify(data))
  },
  deleteNotiMember: data => {
    return http.post('/api/v3/Tele23@notiDelete', JSON.stringify(data))
  },
  getListBookMember: ({ From = null, To = null, StockID = '', MemberID }) => {
    return http.get(
      `/api/v3/mbookadmin?cmd=getbooks&memberid=${MemberID}&from=${From}&to=${To}&stockid=${StockID}&status=XAC_NHAN&UserServiceIDs=&StatusMember=&StatusBook=&StatusAtHome=`
    )
  },
  addMemberBooking: (data, { CurrentStockID, u_id_z4aDf2 }) => {
    return http.post(
      `/api/v3/mbookadmin?cmd=AdminBooking&CurrentStockID=${CurrentStockID}&u_id_z4aDf2=${u_id_z4aDf2}`,
      JSON.stringify(data)
    )
  },
  transferMember: data => {
    return http.post(
      '/api/v3/tele23@member_transferTeleUserIDs',
      JSON.stringify(data)
    )
  },
  transferMemberImport: data => {
    return http.post('/api/v3/tele23@setmembers', JSON.stringify(data))
  },
  transferMemberReset: () => {
    return http.post('/api/v3/tele23@ResetMembers')
  },
  getMemberTeleNoti: data => {
    return http.post('/api/v3/Tele23@MemberTeleNoti', JSON.stringify(data))
  },
  getListStatisticals: data => {
    return http.post('/api/v3/Tele23@list_tele', JSON.stringify(data))
  },
  callNow: data =>
    http.post('/api/third/SBPhonePA@CallNow', JSON.stringify(data))
}
export default telesalesApi
