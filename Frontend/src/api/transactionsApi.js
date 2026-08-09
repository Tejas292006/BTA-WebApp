import apiClient from "./client";

// Challan API
export const Createchallan = async (payload) => {
  try {
    const response = await apiClient.post("/api/challan/create-challan", payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const GetchallanData = async () => {
  try {
    const response = await apiClient.get("/api/challan/get-all-challan");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Deletechallan = async (id) => {
  try {
    const response = await apiClient.delete(`/api/challan/delete-challan/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Updatechallan = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/challan/update-challan/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdatechallanProducts = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/challan/update-challan-products/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdateProductsDue = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/challan/update-due-products/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// Quick Challan API
export const Createquickchallan = async (payload) => {
  try {
    const response = await apiClient.post("/api/quickchallan/create-quickchallan", payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const GetquickchallanData = async () => {
  try {
    const response = await apiClient.get("/api/quickchallan/get-all-quickchallan");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Deletequickchallan = async (id) => {
  try {
    const response = await apiClient.delete(`/api/quickchallan/delete-quickchallan/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Updatequickchallan = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/quickchallan/update-quickchallan/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdateQuickChallanProducts = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/quickchallan/update-quick-challan-products/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdateQuickProductsDue = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/quickchallan/update-quick-due-products/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// Invoice API
export const Createinvoice = async (payload) => {
  try {
    const response = await apiClient.post("/api/invoice/create-invoice", payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const GetinvoiceData = async () => {
  try {
    const response = await apiClient.get("/api/invoice/get-all-invoice");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetinvoiceDataByID = async (id) => {
  try {
    const response = await apiClient.get(`/api/invoice/get-invoice/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Deleteinvoice = async (id) => {
  try {
    const response = await apiClient.delete(`/api/invoice/delete-invoice/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Updateinvoice = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/invoice/update-invoice/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
