import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

export const ReminderContext = React.createContext()

function Reminder(props) {
  const [isSidebar, setIsSidebar] = useState(false)

  const onOpenSidebar = () => {
    setIsSidebar(true)
  }

  const onHideSidebar = () => {
    setIsSidebar(false)
  }
  return (
    <ReminderContext.Provider
      value={{
        isSidebar: isSidebar,
        onHideSidebar: onHideSidebar,
        onOpenSidebar: onOpenSidebar
      }}
    >
      <Outlet />
    </ReminderContext.Provider>
  )
}

export default Reminder
