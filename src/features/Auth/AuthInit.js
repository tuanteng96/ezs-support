import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DevHelpers } from 'src/helpers/DevHelpers'
import { LayoutSplashScreen } from 'src/layout/_core/SplashScreen'
import { setProfile } from './AuthSlice'

function checkInfo(fn) {
  if (
    window.top.Info &&
    window.top.token &&
    window.top.GlobalConfig &&
    window.top.Configs
  ) {
    fn()
  } else {
    setTimeout(() => {
      checkInfo(fn)
    }, 50)
  }
}

function AuthInit(props) {
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  const dispatch = useDispatch()
  // We should request user by authToken before rendering the application

  useEffect(() => {
    async function requestUser() {
      if (DevHelpers.isDevelopment()) {
        window.top.Info = {
          User: {
            FullName: 'Admin System',
            UserName: 'admin',
            ID: 1
          },
          Stocks: [
            {
              ID: 778,
              Title: 'Quản lý cơ sở',
              ParentID: 0
            },
            {
              ID: 8975,
              Title: 'Cser Hà Nội',
              ParentID: 778
            },
            {
              ID: 10053,
              Title: 'Cser Hồ Chí Minh',
              ParentID: 778
            }
          ],
          CrStockID: 8975, //8975
          rightsSum: {
            tele: {
              hasRight: true,
              stocks: [{ ID: 0, Title: 'Cser Hà Nội' }],
              IsAllStock: true
            },
            teleAdv: {
              hasRight: true,
              stocks: [{ ID: 0, Title: 'Cser Hồ Chí Minh' }],
              IsAllStock: true
            }
          }
        }
        window.top.token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjEwMzExNDEwMzQ1NyIsIm5iZiI6MTY5NjAzOTMwOCwiZXhwIjoxNjk2NjQ0MTA4LCJpYXQiOjE2OTYwMzkzMDh9.4W7qxwclT6UU-D584GYRdV0gzIGJNOS9LAFVAAYuAfk'
        window.top.GlobalConfig = {
          Admin: {
            kpiSortColumn: [
              {
                key: 'index',
                order: 0,
                isvisible: false
              },
              {
                key: 'FullName',
                order: 1,
                isvisible: false
              },
              {
                key: 'CreateDate',
                order: 2,
                isvisible: false
              },
              {
                key: 'ByStock.Title',
                order: 3,
                isvisible: false
              },
              {
                key: 'Staffs',
                order: 4,
                isvisible: false
              },
              {
                key: 'TeleTags',
                order: 5,
                isvisible: false
              },
              {
                key: 'TopTele',
                order: 6,
                isvisible: false
              },
              {
                key: 'TeleNote',
                order: 7,
                isvisible: false
              },
              {
                key: 'action',
                order: 100,
                isvisible: false
              }
            ],
            kpiSuccess: 'Đặt lịch thành công',
            kpiFinish: 'Khách đến làm dịch vụ',
            kpiCancel: 'Khách hủy'
          }
        }

        window.top.Configs = [
          {
            ValueText: '[]'
          }
        ]
      }
      checkInfo(() => {
        dispatch(
          setProfile({
            Info: window.top.Info,
            token: window.top.token
          })
        )
        setShowSplashScreen(false)
      })
    }
    if (
      !window.top.Info ||
      !window.top.token ||
      !window.top.GlobalConfig ||
      !window.top.Configs
    ) {
      requestUser()
    } else {
      dispatch(
        setProfile({
          Info: window.top.Info,
          token: window.top.token
        })
      )
      setShowSplashScreen(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default AuthInit
