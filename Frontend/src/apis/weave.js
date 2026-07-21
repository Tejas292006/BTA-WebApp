import axios from "axios"

export const Createweave = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/weave/create-weave`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetweaveData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/weave/get-all-weave`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deleteweave = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/weave/delete-weave/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updateweave = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/weave/update-weave/${id}`, payload);

        return response.data;
      
    } catch (error) {
        return error.message
    }
}
