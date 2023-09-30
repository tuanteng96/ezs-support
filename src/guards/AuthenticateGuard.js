import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AuthenticateGuard({ children }) {
  const { tele } = useSelector(({ auth }) => ({
    tele: auth.Info?.rightsSum?.tele?.hasRight
  }))

  if (tele) {
    return <Navigate to="/" />
  }

  return children
}
