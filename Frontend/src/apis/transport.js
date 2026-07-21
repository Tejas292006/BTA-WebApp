import axios from "axios"

export const Createtransport = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/transport/create-transport`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Gettransportdata = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/transport/get-all-transport`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletetransport = async (id) => {
    console.log("calling")

    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/transport/delete-transport/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatetransport = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/transport/update-transport/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
