import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ScrollToTop = props => {
  const location = useLocation()
  let navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    if (location?.pathname === '/Admin/telesales/index.html') {
      navigate('/', { replace: true, state: location.state })
    } else {
      // const pathnameList = location?.pathname.split('/')
      // if (pathnameList.length > 3) {
      //   window.top.location.hash = `mb:danh-sach/${pathnameList[2]}`
      //   return
      // }
      // if (pathnameList.length === 3 && pathnameList.includes('thong-ke')) {
      //   window.top.location.hash = `mb:thong-ke/danh-sach`
      //   return
      // }
      // if (pathnameList.length === 3 && pathnameList.includes('lich-nhac')) {
      //   window.top.location.hash = `mb:lich-nhac/danh-sach`
      //   return
      // }
      // if (pathnameList.length === 2) {
      //   window.top.location.hash = `mb:/`
      //   return
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(() => {
    // if (window.top.location.hash) {
    //   const url = window.top.location.hash.slice(
    //     4,
    //     window.top.location.hash.length
    //   )
    //   navigate('/', { replace: true, state: location.state })
    //   navigate(url, { replace: true, state: location.state })
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{props.children}</>
}

export default ScrollToTop
