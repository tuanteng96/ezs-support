import { combineReducers } from 'redux'
import authReducer from '../features/Auth/AuthSlice'
import telesalesReducer from '../features/Telesales/TelesalesSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  telesales: telesalesReducer
})
