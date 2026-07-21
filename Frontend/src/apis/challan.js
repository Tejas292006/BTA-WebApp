import axios from "axios"

export const Createchallan = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/challan/create-challan`, payload);
        return response.data;

    } catch (error) {
        return error
    }
}

export const GetchallanData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/challan/get-all-challan`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletechallan = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/challan/delete-challan/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatechallan = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/challan/update-challan/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const UpdatechallanProducts = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/challan/update-challan-products/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const UpdateProductsDue = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/challan/update-due-products/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
