import axios from "axios"

export const Createwidth = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/width/create-width`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetwidthData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/width/get-all-width`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletewidth = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/width/delete-width/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatewidth = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/width/update-width/${id}`, payload);
        return response.data;
   
    } catch (error) {
        return error.message
    }
}
