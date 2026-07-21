import axios from "axios"

export const Createsupplier = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/supplier/create-supplier`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetsupplierData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/supplier/get-all-supplier`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletesupplier = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/supplier/delete-supplier/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatesupplier = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/supplier/update-supplier/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
