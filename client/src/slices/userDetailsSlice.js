// // actions
// const setUserDetails = (payload) => ({
//   type: 'SET_USER_DETAILS',
//   payload,
// })

// // initial state
// const initialState = {
//   // can put this in layout also by calling the user API; create a getUserByEmail API and allow access to only the user itself
//   email: '',
//   isPremium: false,
//   // get these from layout calling the API
//   owner: [],
//   editor: [],
// }

// // reducer
// const userDetailsReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'SET_USER_DETAILS':
//       return { ...state, ...action.payload }
//     // case 'REMOVE_SWAP_TO':
//     //     return { ...state, swapTo: action.payload }
//     default:
//       return state
//   }
// }

// // export actions and the reducer
// export { userDetailsReducer, setUserDetails }

import { createSlice } from '@reduxjs/toolkit'

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: {
    // can put this in layout also by calling the user API; create a getUserByEmail API and allow access to only the user itself
    email: '',
    isPremium: false,
    // get these from layout calling the API
    owner: [],
    editor: [],
  },
  reducers: {
    addUserDetails(state, action) {
      return { ...action.payload }
    },
    // todoToggled(state, action) {
    //   const todo = state.find((todo) => todo.id === action.payload)
    //   todo.completed = !todo.completed
    // },
  },
})

export const { addUserDetails } = userDetailsSlice.actions
export default userDetailsSlice.reducer
