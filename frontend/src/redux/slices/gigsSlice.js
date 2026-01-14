import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchGigs = createAsyncThunk('gigs/fetch', async ({ search='' }={}, thunkAPI) => {
  const res = await api.get(`/api/gigs?search=${encodeURIComponent(search)}`)
  return res.data
})

export const createGig = createAsyncThunk('gigs/create', async (payload, thunkAPI) => {
  const res = await api.post('/api/gigs', payload)
  return res.data
})

const slice = createSlice({
  name: 'gigs',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchGigs.pending, (s)=>{ s.loading = true })
    b.addCase(fetchGigs.fulfilled, (s, a)=>{ s.items = a.payload; s.loading = false })
    b.addCase(fetchGigs.rejected, (s)=>{ s.loading = false })
    b.addCase(createGig.fulfilled, (s,a)=>{ s.items.unshift(a.payload) })
  }
})

export default slice.reducer
