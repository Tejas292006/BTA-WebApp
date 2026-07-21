import axios from "axios"

export const Createdesign = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/design/create-design`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetdesignData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/design/get-all-design`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletedesign = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/design/delete-design/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatedesign = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/design/update-design/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
