import axios from "axios"

export const Createinvoice = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/invoice/create-invoice`, payload);
        return response.data;

    } catch (error) {
        return error
    }
}

export const GetinvoiceData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/invoice/get-all-invoice`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetinvoiceDataByID = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/invoice/get-all-invoice`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deleteinvoice = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/invoice/delete-invoice/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updateinvoice = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/invoice/update-invoice/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
