import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axiosInstance.get("/posts");
  return response.data;
});

export const fetchRecommendedUsers = createAsyncThunk(
  "users/fetchRecommended",
  async () => {
    const response = await axiosInstance.get("/users/suggestions");
    return response.data;
  }
);

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/notifications");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for fetching connection requests
export const fetchConnectionRequests = createAsyncThunk(
  "connections/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/connections/requests");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for fetching connections
export const fetchConnections = createAsyncThunk(
  "network/fetchConnections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/connections");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for creating a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message || "Failed to create post"
      );
    }
  }
);

// Async thunk for deleting a post
export const deletePostAction = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/posts/delete/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for liking a post
export const likePostAction = createAsyncThunk(
  "posts/like",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for adding a comment
export const createCommentAction = createAsyncThunk(
  "posts/comment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comment`, {
        content: comment, // Ensure you're sending the correct key
      });
      return { postId, comment: response.data }; // Assuming response.data contains the updated post or comment data
    } catch (error) {
      // Reject with value to handle errors properly
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ postId, content, image }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axiosInstance.put(
        `/posts/edit/${postId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Post updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchById",
  async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  }
);

// Posts slice
export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    notifications: [],
    connectionRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload); // Add the new post at the beginning
    },
    reset: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.loading = false;
        toast.success("Post created successfully");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Delete post
      .addCase(deletePostAction.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      // Like post
      .addCase(likePostAction.fulfilled, (state, action) => {
        const post = state.posts.find(
          (post) => post._id === action.payload.postId
        );
        if (post) {
          post.likes = post.likes
            ? [...post.likes, action.payload]
            : [action.payload];
        }
      })
      // Add comment
      .addCase(createCommentAction.fulfilled, (state, action) => {
        const post = state.posts.find(
          (post) => post._id === action.payload.postId
        );
        if (post) {
          if (!post.comments) {
            post.comments = [];
          }
          post.comments.push(action.payload.comment);
        }
      })
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Use payload if available
      })
      // Fetch connection requests
      .addCase(fetchConnectionRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
        state.loading = false;
      })
      .addCase(fetchConnectionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Use payload if available
      })
      .addCase(fetchRecommendedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.recommended = action.payload;
      })
      .addCase(fetchRecommendedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle all rejections with matcher
      .addCase(editPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload || action.error.message;
        }
      );
  },
});

// Action creators
export const { setPosts, addPost, reset } = postsSlice.actions;

// Selectors
export const selectPosts = (state) => state.posts.items;
export const selectNotifications = (state) => state.posts.notifications;
export const selectConnectionRequests = (state) =>
  state.posts.connectionRequests;
export const selectRecommendedUsers = (state) => state.users.recommended;

export default postsSlice.reducer;
