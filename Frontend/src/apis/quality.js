import axios from "axios"

export const Createquality = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/quality/create-quality`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetqualityData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/quality/get-all-quality`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletequality = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/quality/delete-quality/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatequality = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/quality/update-quality/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
