import axios from "axios"

export const Createcustomer = async (payload) => {
    try {
        console.log(payload,'pppppppppppppppppppppp')
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/customer/create-customer`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Getcustomerdata = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/customer/get-all-customers`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletecustomer = async (id) => {
   

    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/customer/delete-customer/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatecustomer = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/customer/update-customer/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
