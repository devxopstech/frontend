import axios from "axios";

// Use hardcoded URL for development, you can change this when deploying

const BASE_URL = "http://localhost:3000/api/";

// Create axios instance with common configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints object for better maintenance
const ENDPOINTS = {
  // Auth Endpoints
  CREATE_USER: "/auth/createUser",
  LOGIN: "/auth/loginUser",
  FORGOT_PASSWORD: "/auth/forgotPassword",
  UPDATE_PASSWORD: "/auth/updatePassword",
  VERIFY_EMAIL: "/auth/verification",
  GET_USER_DETAILS: "/auth/getUserDetails",
  GOOGLE_AUTH: "/auth/google",
  GOOGLE_AUTH_CALLBACK: "/auth/google/callback",
  APPLE_AUTH: "/auth/apple",
  APPLE_AUTH_CALLBACK: "/auth/apple/callback",

  // Schedule Endpoints
  CREATE_SCHEDULE: "/schedules/create",
  GET_SCHEDULES: "/schedules",
  GET_SCHEDULE: "/schedules/:id",
  UPDATE_SCHEDULE: "/schedules/:id",
  DELETE_SCHEDULE: "/schedules/:id",

  // Priority Endpoints
  CREATE_PRIORITY: (scheduleId) => `/priorities/create`,
  GET_PRIORITIES: "/priorities",
  UPDATE_PRIORITY: (id) => `/priorities/${id}`,
  DELETE_PRIORITY: (id) => `/priorities/${id}`,

  // Employee Endpoints
  GET_EMPLOYEES: (scheduleId) => `/employees/schedule/${scheduleId}`,
  ADD_EMPLOYEE: (scheduleId) => `/employees/schedule/${scheduleId}/add`,
  UPDATE_EMPLOYEE: (id) => `/employees/${id}`,
  DELETE_EMPLOYEE: (id) => `/employees/${id}`,
  HANDLE_INVITATION: (notificationId, action) =>
    `/notifications/${notificationId}/${action}`,
  // User Endpoints
  UPDATE_PROFILE_PICTURE: "/users/updateProfilePicture",

  // 🔔 Notification Endpoints
  GET_NOTIFICATIONS: "/notifications",
  MARK_NOTIFICATION_OPENED: (id) => `/notifications/${id}/opened`,

  GENERATE_ARRANGEMENT: (scheduleId) =>
    `/schedules/${scheduleId}/generate-arrangement`,
  GET_ARRANGEMENT: (scheduleId) => `/schedules/${scheduleId}/arrangement`,

  GET_AVAILABLE_USERS: "/chat/users",
  CREATE_CHAT_ROOM: "/chat/rooms",
  GET_CHAT_ROOM: (id) => `/chat/rooms/${id}`,
  ADD_PARTICIPANTS: (roomId) => `/chat/rooms/${roomId}/participants`,
  REMOVE_PARTICIPANT: (roomId, userId) =>
    `/chat/rooms/${roomId}/participants/${userId}`,
  DELETE_ROOM: (roomId) => `/chat/rooms/${roomId}`,
  GET_CHAT_ROOMS: "/chat/rooms",
  GET_CHAT_MESSAGES: (roomId) => `/chat/rooms/${roomId}/messages`,
};

// Auth API Functions
export const createUser = async (userData) => {
  try {
    const response = await api.post(ENDPOINTS.CREATE_USER, userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to create user",
      }
    );
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log(credentials);

    const response = await api.post(ENDPOINTS.LOGIN, credentials);
    console.log(response);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Login failed",
      }
    );
  }
};
export const googleAuth = async () => {
  try {
    const response = await api.get(ENDPOINTS.GOOGLE_AUTH);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Google Auth failed",
      }
    );
  }
};

export const googleAuthCallback = async (queryParams) => {
  try {
    const response = await api.get(ENDPOINTS.GOOGLE_AUTH_CALLBACK, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Google Auth Callback failed",
      }
    );
  }
};

export const appleAuth = async () => {
  try {
    const response = await api.get(ENDPOINTS.APPLE_AUTH);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Apple Auth failed",
      }
    );
  }
};

export const appleAuthCallback = async (queryParams) => {
  try {
    const response = await api.get(ENDPOINTS.APPLE_AUTH_CALLBACK, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Apple Auth Callback failed",
      }
    );
  }
};
export const forgotPassword = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Password reset request failed",
      }
    );
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.UPDATE_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Password update failed",
      }
    );
  }
};

export const verifyEmail = async (email) => {
  try {
    const response = await api.post(ENDPOINTS.VERIFY_EMAIL, { email });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Email verification failed",
      }
    );
  }
};

export const getUserDetails = async (token) => {
  try {
    const response = await api.post(
      "/auth/getUserDetails",
      { authToken: token },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("getUserDetails error:", error);
    throw error;
  }
};

// Schedule API Functions
export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post(ENDPOINTS.CREATE_SCHEDULE, scheduleData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to create schedule",
      }
    );
  }
};

export const getSchedules = async () => {
  try {
    const response = await api.get(ENDPOINTS.GET_SCHEDULES);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to fetch schedules",
      }
    );
  }
};

export const getSchedule = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.GET_SCHEDULE.replace(":id", id));
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to fetch schedule",
      }
    );
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await api.put(
      ENDPOINTS.UPDATE_SCHEDULE.replace(":id", id),
      scheduleData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to update schedule",
      }
    );
  }
};

export const deleteSchedule = async (id) => {
  console.log("Deleting schedule with ID:", id, typeof id);
  try {
    const response = await api.delete(
      ENDPOINTS.DELETE_SCHEDULE.replace(":id", id)
    );
    console.log("Delete API Response:", response); // Log full response
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to delete schedule",
      }
    );
  }
};

// Priority API Functions
export const createPriority = async (priorityData) => {
  try {
    const response = await api.post(ENDPOINTS.CREATE_PRIORITY(), {
      ...priorityData,
      scheduleId: priorityData.scheduleId,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to create priority",
      }
    );
  }
};

export const getPriorities = async (scheduleId) => {
  try {
    const response = await api.get(`${ENDPOINTS.GET_PRIORITIES}/${scheduleId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to fetch priorities",
      }
    );
  }
};
export const updatePriority = async (id, priorityData) => {
  try {
    const response = await api.put(
      ENDPOINTS.UPDATE_PRIORITY.replace(":id", id),
      priorityData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to update priority",
      }
    );
  }
};

export const deletePriority = async (id) => {
  try {
    const response = await api.delete(
      ENDPOINTS.DELETE_PRIORITY.replace(":id", id)
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to delete priority",
      }
    );
  }
};

// Employee API Functions
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post(ENDPOINTS.CREATE_EMPLOYEE, employeeData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to create employee",
      }
    );
  }
};

export const getEmployees = async (scheduleId) => {
  try {
    const response = await api.get(ENDPOINTS.GET_EMPLOYEES(scheduleId));
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to fetch employees",
      }
    );
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(
      ENDPOINTS.UPDATE_EMPLOYEE.replace(":id", id),
      employeeData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to update employee",
      }
    );
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(
      ENDPOINTS.DELETE_EMPLOYEE.replace(":id", id)
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to delete employee",
      }
    );
  }
};

// User API Functions
export const updateProfilePicture = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    const response = await api.post(
      ENDPOINTS.UPDATE_PROFILE_PICTURE,
      formData,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to update profile picture",
      }
    );
  }
};
export const addEmployee = async (scheduleId, employeeData) => {
  try {
    console.log("Adding employee:", { scheduleId, employeeData });
    const response = await api.post(
      ENDPOINTS.ADD_EMPLOYEE(scheduleId),
      employeeData
    );
    return response.data;
  } catch (error) {
    console.error("Add employee error:", error);
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to add employee",
      }
    );
  }
};

// 🔔 Fetch Notifications
export const getNotifications = async () => {
  try {
    const response = await api.get(ENDPOINTS.GET_NOTIFICATIONS);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to fetch notifications",
      }
    );
  }
};

// 🔔 Mark Notification as Opened
export const markNotificationAsOpened = async (notificationId) => {
  try {
    const response = await api.put(
      ENDPOINTS.MARK_NOTIFICATION_OPENED(notificationId)
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to mark notification as read",
      }
    );
  }
};
export const handleInvitation = async (notificationId, action) => {
  try {
    const response = await api.post(
      ENDPOINTS.HANDLE_INVITATION(notificationId, action)
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to handle invitation",
      }
    );
  }
};
// export const getAvailableUsers = async ({
//   search = "",
//   page = 1,
//   limit = 20,
// }) => {
//   try {
//     const response = await api.get(`/chat/users`, {
//       params: {
//         search,
//         page,
//         limit,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Error:", error);
//     throw error.response?.data || error;
//   }
// };

// export const getChatRoom = async (roomId) => {
//   try {
//     const response = await api.get(ENDPOINTS.GET_CHAT_ROOM(roomId));
//     return response.data;
//   } catch (error) {
//     throw (
//       error.response?.data || {
//         success: false,
//         message: error.message || "Failed to get chat room",
//       }
//     );
//   }
// };

export const generateWorkArrangement = async (scheduleId) => {
  try {
    const response = await api.post(ENDPOINTS.GENERATE_ARRANGEMENT(scheduleId));
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to generate work arrangement",
      }
    );
  }
};

export const getWorkArrangement = async (scheduleId) => {
  try {
    console.log("Fetching arrangement for:", scheduleId);
    const response = await api.get(`/schedules/${scheduleId}/arrangement`);
    console.log("Arrangement response:", response);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getUserBuilds = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/builds`);
    return response.data;
  } catch (error) {
    console.error("Error getting user builds:", error);
    throw error;
  }
};

// Increment user's build count
export const incrementUserBuilds = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/builds/increment`);
    return response.data;
  } catch (error) {
    console.error("Error incrementing builds:", error);
    throw error;
  }
};

export const getAvailableUsers = async ({
  search = "",
  page = 1,
  limit = 20,
}) => {
  try {
    const response = await api.get(ENDPOINTS.GET_AVAILABLE_USERS, {
      params: {
        search,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error;
  }
};

export const getChatRoom = async (roomId) => {
  try {
    const response = await api.get(ENDPOINTS.GET_CHAT_ROOM(roomId));
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to get chat room",
      }
    );
  }
};

export const addParticipants = async (roomId, participants) => {
  try {
    const response = await api.post(ENDPOINTS.ADD_PARTICIPANTS(roomId), {
      participants,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to add participants",
      }
    );
  }
};

export const removeParticipant = async (roomId, userId) => {
  try {
    const response = await api.delete(
      ENDPOINTS.REMOVE_PARTICIPANT(roomId, userId)
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to remove participant",
      }
    );
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await api.delete(ENDPOINTS.DELETE_ROOM(roomId));
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to delete room",
      }
    );
  }
};

export const getChatRooms = async () => {
  try {
    const response = await api.get(ENDPOINTS.GET_CHAT_ROOMS);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to fetch chat rooms",
      }
    );
  }
};

export const getChatMessages = async (roomId) => {
  try {
    const response = await api.get(ENDPOINTS.GET_CHAT_MESSAGES(roomId));
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to fetch messages",
      }
    );
  }
};

export const createChatRoom = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.CREATE_CHAT_ROOM, data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Failed to create chat room",
      }
    );
  }
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      // You might want to redirect to login page here
    }
    return Promise.reject(error);
  }
);

export default api;
