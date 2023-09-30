import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

export const StatisticalContext = React.createContext()

function Statistical(props) {
  const [isSidebar, setIsSidebar] = useState(false)

  const onOpenSidebar = () => {
    setIsSidebar(true)
  }

  const onHideSidebar = () => {
    setIsSidebar(false)
  }
  return (
    <StatisticalContext.Provider
      value={{
        isSidebar: isSidebar,
        onHideSidebar: onHideSidebar,
        onOpenSidebar: onOpenSidebar
      }}
    >
      <Outlet />
    </StatisticalContext.Provider>
  )
}

export default Statistical
