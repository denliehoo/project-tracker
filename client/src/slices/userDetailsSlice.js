import { createSlice } from "@reduxjs/toolkit";

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    // can put this in layout also by calling the user API; create a getUserByEmail API and allow access to only the user itself
    email: "",
    isPremium: false,
    // get these from layout calling the API
    owner: [],
    editor: [],
    plan: "none",
    endDate: null,
    reucrCryptId: "",
    stripeId: "",
    stripeCheckoutSession: "",
    name: "",
  },
  reducers: {
    addUserDetails(state, action) {
      return { ...action.payload };
    },
    // todoToggled(state, action) {
    //   const todo = state.find((todo) => todo.id === action.payload)
    //   todo.completed = !todo.completed
    // },
  },
});

export const { addUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
