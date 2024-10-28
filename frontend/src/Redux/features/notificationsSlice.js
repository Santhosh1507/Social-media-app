import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';

// Async actions using createAsyncThunk
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/notifications');
            return data;
        } catch (error) {
            // Check if the error has a response (e.g., server or client-side error)
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                // Handle cases where no response exists (e.g., network error)
                return rejectWithValue('Something went wrong. Please try again later.');
            }
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            return id;  // Return the notification ID to update state
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/notifications/${id}`);
            return id;  // Return the notification ID to remove from state
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Initial state
const initialState = {
    notifications: [],
    loading: false,
    error: null,
};

// Slice
const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle mark as read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notificationId = action.payload;
                const notification = state.notifications.find(n => n._id === notificationId);
                if (notification) {
                    notification.read = true;
                }
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Handle delete notification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const notificationId = action.payload;
                state.notifications = state.notifications.filter(n => n._id !== notificationId);
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// Export the reducer
export default notificationsSlice.reducer;
