import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  try{
    const res = await api.get('/api/auth/me')
    return res.data.user
  }catch(err){
    return null
  }
})

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try{
    const res = await api.post('/api/auth/login', payload)
    return res.data.user
  }catch(err){
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Login failed' })
  }
})

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try{
    const res = await api.post('/api/auth/register', payload)
    return res.data.user
  }catch(err){
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Register failed' })
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try{
    await api.post('/api/auth/logout')
    return null
  }catch(err){
    return thunkAPI.rejectWithValue({ message: 'Logout failed' })
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action)=>{ state.user = action.payload })
      .addCase(register.fulfilled, (state, action)=>{ state.user = action.payload })
      .addCase(loadUser.fulfilled, (state, action)=>{ state.user = action.payload })
      .addCase(logout.fulfilled, (state, action)=>{ state.user = null })
  }
})

export default slice.reducer
