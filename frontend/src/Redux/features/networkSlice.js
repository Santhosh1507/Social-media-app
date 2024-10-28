// features/networkSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

export const fetchConnectionRequests = createAsyncThunk(
  "network/fetchConnectionRequests",
  async () => {
    const response = await axiosInstance.get("/connections/requests");
    return response.data;
  }
);

export const fetchConnections = createAsyncThunk(
  "network/fetchConnections",
  async () => {
    const response = await axiosInstance.get("/connections");
    return response.data;
  }
);

const networkSlice = createSlice({
  name: "network",
  initialState: {
    connectionRequests: [],
    connections: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnectionRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConnectionRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.connectionRequests = action.payload;
      })
      .addCase(fetchConnectionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectConnectionRequests = (state) => state.network.connectionRequests;
export const selectConnections = (state) => state.network.connections;
export default networkSlice.reducer;
