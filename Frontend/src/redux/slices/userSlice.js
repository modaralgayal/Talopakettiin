import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userType: null,
};
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    logout: (state) => {
      state.userType = null; // Reset user state on logout
    },
  },
});

export const { setUserType, logout } = userSlice.actions;
// export const selectState = (state) => state.userSlice;

export default userSlice.reducer;
