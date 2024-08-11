import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from '../service/auth.service';
const user = AuthService.getUser();

const getMessageError = (error) => {
   return (
      (error.response && error.response.data && error.response.data.message) ||
      error.message || error.data.message ||
      error.toString()
   );
} 

export const register = createAsyncThunk(
   "auth/register",
   async (body, thunkAPI) => {
     try {
       const response = await AuthService.register(body);
       return response.data;
     } catch (error) {
      const message = getMessageError(error);
       return thunkAPI.rejectWithValue(message);
     }
   }
 );


 export const login = createAsyncThunk(
   "auth/login",
   async ({ email, password }, thunkAPI) => {
     try {
       const data = await AuthService.login(email, password);
      

       return { user: data };
     } catch (error) {

       const message = getMessageError(error);
  
       return thunkAPI.rejectWithValue(message);
     }
   }
 );
 


 export const logout = createAsyncThunk("auth/logout",  async (thunkAPI) => {
    try {
      const response = await AuthService.logout();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }

   
 });


 export const removeUser = createAsyncThunk("auth/removeUser", async  () => {
    AuthService.removeUser()
});




const initialState = user
? { isLoggedIn: true, user }
: { isLoggedIn: false, user: null };

const authSlice = createSlice({
   name: "auth",
   initialState,
   extraReducers: (builder) => {
      builder
        .addCase(register.fulfilled, (state, action) => {
          state.isLoggedIn = false;
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoggedIn = false;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoggedIn = true;
          state.user = action.payload.user;
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoggedIn = false;
          state.user = null;
        })
        .addCase(logout.fulfilled, (state, action) => {
          state.isLoggedIn = false;
          state.user = null;
        })
        .addCase(removeUser.fulfilled, (state, action) => {
          state.isLoggedIn = false;
          state.user = null;
        })
        
   }
 });
 
 const { reducer } = authSlice;
 export default reducer;