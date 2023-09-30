import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import '../../_assets/sass/pages/_telesales.scss'

export const TelesalesContext = React.createContext()

function Telesales(props) {
  const [isSidebar, setIsSidebar] = useState(false)
  const [isProfile, setIsProfile] = useState(false)

  const onOpenSidebar = () => {
    setIsSidebar(true)
  }

  const onHideSidebar = () => {
    setIsSidebar(false)
  }

  const onOpenProfile = () => {
    setIsProfile(true)
  }

  const onHideProfile = () => {
    setIsProfile(false)
  }

  return (
    <TelesalesContext.Provider
      value={{
        isSidebar: isSidebar,
        onHideSidebar: onHideSidebar,
        onOpenSidebar: onOpenSidebar,
        isProfile: isProfile,
        onHideProfile: onHideProfile,
        onOpenProfile: onOpenProfile
      }}
    >
      <Outlet />
    </TelesalesContext.Provider>
  )
}

export default Telesales
