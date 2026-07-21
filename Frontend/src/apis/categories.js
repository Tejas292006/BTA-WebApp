import axios from "axios"

export const Createcategory = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/category/create-category`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetcategoryData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/category/get-all-category`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletecategory = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/category/delete-category/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatecategory = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/category/update-category/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
