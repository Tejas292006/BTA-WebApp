import axios from "axios"

export const Createpaymentmode = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/paymentmode/create-paymentmode`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Getpaymentmodedata = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/paymentmode/get-all-paymentmode`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletepaymentmode = async (id) => {
    console.log("calling")

    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/paymentmode/delete-paymentmode/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatepaymentmode = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/paymentmode/update-paymentmode/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
