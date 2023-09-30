import React, { createContext, useContext, useState } from 'react'

const TelesalesContext = createContext({})

export const useTeleDetail = () => useContext(TelesalesContext)

function TelesalesDetailLayout({ children }) {
  const [TagsList, setTagsList] = useState([])
  const [TagsSelected, setTagsSelected] = useState([])

  return (
    <TelesalesContext.Provider
      value={{
        TagsList,
        setTagsList,
        TagsSelected,
        setTagsSelected
      }}
    >
      {children}
    </TelesalesContext.Provider>
  )
}

export default TelesalesDetailLayout
