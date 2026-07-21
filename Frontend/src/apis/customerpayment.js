import axios from "axios"

export const Createcustomerpayment = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/customerpayment/create-customerpayment`, payload);
        return response.data;

    } catch (error) {
        return error
    }
}

export const GetcustomerpaymentData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/customerpayment/get-all-customerpayment`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

// export const GetcustomerpaymentDataByID = async () => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/customerpayment/get-all-customerpayment`);
//         return response.data;

//     } catch (error) {
//         return error.message
//     }
// }
export const Deletecustomerpayment = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/customerpayment/delete-customerpayment/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatecustomerpayment = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/customerpayment/update-customerpayment/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
