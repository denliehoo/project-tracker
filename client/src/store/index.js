// https://redux.js.org/introduction/why-rtk-is-redux-today
import { configureStore } from '@reduxjs/toolkit'
import userDetailsReducer from '../slices/userDetailsSlice'

export const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer,
    // filters: filtersReducer
  },
})
