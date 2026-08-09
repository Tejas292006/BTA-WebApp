import apiClient from "./client";

// Customer API
export const Createcustomer = async (payload) => {
  try {
    const response = await apiClient.post("/api/customer/create-customer", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Getcustomerdata = async () => {
  try {
    const response = await apiClient.get("/api/customer/get-all-customers");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Deletecustomer = async (id) => {
  try {
    const response = await apiClient.delete(`/api/customer/delete-customer/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Updatecustomer = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/customer/update-customer/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// Supplier API
export const Createsupplier = async (payload) => {
  try {
    const response = await apiClient.post("/api/supplier/create-supplier", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetsupplierData = async () => {
  try {
    const response = await apiClient.get("/api/supplier/get-all-supplier");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Deletesupplier = async (id) => {
  try {
    const response = await apiClient.delete(`/api/supplier/delete-supplier/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Updatesupplier = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/supplier/update-supplier/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// Customer Payment API
export const Createcustomerpayment = async (payload) => {
  try {
    const response = await apiClient.post("/api/customerpayment/create-customerpayment", payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const GetcustomerpaymentData = async () => {
  try {
    const response = await apiClient.get("/api/customerpayment/get-all-customerpayments");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Deletecustomerpayment = async (id) => {
  try {
    const response = await apiClient.delete(`/api/customerpayment/delete-customerpayment/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Updatecustomerpayment = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/customerpayment/update-customerpayment/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// Supplier Payment API
export const Createsupplierpayment = async (payload) => {
  try {
    const response = await apiClient.post("/api/supplierpayment/create-supplierpayment", payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const GetsupplierpaymentData = async () => {
  try {
    const response = await apiClient.get("/api/supplierpayment/get-all-supplierpayments");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Deletesupplierpayment = async (id) => {
  try {
    const response = await apiClient.delete(`/api/supplierpayment/delete-supplierpayment/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Updatesupplierpayment = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/supplierpayment/update-supplierpayment/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
