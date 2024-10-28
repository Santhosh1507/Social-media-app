import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";
import postsReducer from "./features/postsSlice";
import networkReducer from "./features/networkSlice";
import notificationsReducer from "./features/networkSlice";
import authReducer from "./features/authSlice";
import profileReducer from "./features/profileSlice";
import userprofileReducer from "./features/userProfileSlice";
import conversationsSlice from "./features/conversationsSlice";
import messagesSlice from "./features/messagesSlice";
import chatReducer from "./features/chatReducer";
import userReducer from "./features/userReducer";

const store = configureStore({
	reducer: {
		users: usersReducer,
		posts: postsReducer,
		network: networkReducer,
		notifications: notificationsReducer,
		auth: authReducer,
		profile: profileReducer,
		userProfile: userprofileReducer,
		conversation: conversationsSlice.reducer,
		messages: messagesSlice.reducer,
		chat: chatReducer,
		user: userReducer,
	},
});

export default store;
