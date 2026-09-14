import apiClient from "./client";

export const loginUser = async (payload) => {
  try {
    const response = await apiClient.post("/api/login", payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

export const registerUser = async (payload) => {
  try {
    const response = await apiClient.post("/api/register", payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await apiClient.get("/api/get-current-user");
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

export const UploadProfileImage = async (payload) => {
  try {
    const response = await apiClient.post("/api/uploadprofileimage", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateUser = async (payload, id) => {
  try {
    const response = await apiClient.put(`/api/updateuser/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
