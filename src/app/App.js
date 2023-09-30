import { Provider } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthInit from 'src/features/Auth/AuthInit'
import ScrollToTop from 'src/layout/_core/ScrollToTop'
import Telesales from 'src/features/Telesales'
import TelesalesList from 'src/features/Telesales/pages/TelesalesList'
import TelesalesDetail from 'src/features/Telesales/pages/TelesalesDetail'
import TelesalesOptionServices from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionServices'
import TelesalesOptionProducts from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionProducts'
import TelesalesOptionBuying from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionBuying'
import TelesalesOptionUse from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionUse'
import UnauthenticateGuard from 'src/guards/UnauthenticateGuard'
import Authentication from 'src/features/Authentication'
import AuthenticateGuard from 'src/guards/AuthenticateGuard'
import Statistical from 'src/features/Statistical'
import StatisticalList from 'src/features/Statistical/pages/StatisticalList'
import Reminder from 'src/features/Reminder'
import ReminderList from 'src/features/Reminder/pages/ReminderList'
import ReplyCallNow from 'src/components/ReplyCallNow/ReplyCallNow'

function App({ store, persistor }) {
  return (
    <Provider store={store}>
      <AuthInit>
        <ScrollToTop>
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="/danh-sach" replace />} />
            </Route>
            <Route
              path="/danh-sach"
              element={
                <UnauthenticateGuard>
                  <Telesales />
                </UnauthenticateGuard>
              }
            >
              <Route index element={<TelesalesList />} />
              <Route path=":MemberID" element={<TelesalesDetail />}>
                <Route index element={<Navigate to="dich-vu" replace />} />
                <Route path="dich-vu" element={<TelesalesOptionServices />} />
                <Route path="san-pham" element={<TelesalesOptionProducts />} />
                <Route
                  path="lich-su-mua-hang"
                  element={<TelesalesOptionBuying />}
                />
                <Route
                  path="lich-su-du-dung-dv"
                  element={<TelesalesOptionUse />}
                />
                <Route path="*" element={<Navigate to="/dich-vu" replace />} />
              </Route>
            </Route>
            <Route
              path="/thong-ke"
              element={
                <UnauthenticateGuard>
                  <Statistical />
                </UnauthenticateGuard>
              }
            >
              <Route index element={<Navigate to="danh-sach" replace />} />
              <Route path="danh-sach" element={<StatisticalList />} />
            </Route>
            <Route
              path="/lich-nhac"
              element={
                <UnauthenticateGuard>
                  <Reminder />
                </UnauthenticateGuard>
              }
            >
              <Route index element={<Navigate to="danh-sach" replace />} />
              <Route path="danh-sach" element={<ReminderList />} />
            </Route>
            <Route
              path="/yeu-cau-quyen-truy-cap"
              element={
                <AuthenticateGuard>
                  <Authentication />
                </AuthenticateGuard>
              }
            />
            <Route
              path="/Admin/telesales/index.html"
              element={<Navigate to="/" replace />}
            />
          </Routes>
          <ReplyCallNow />
        </ScrollToTop>
      </AuthInit>
    </Provider>
  )
}

export default App
