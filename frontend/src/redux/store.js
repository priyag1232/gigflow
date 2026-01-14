import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import gigsReducer from './slices/gigsSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigsReducer,
  }
})
