import axios from 'axios';

export const CreateProduct = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/products/create-product`, payload);
        return response.data;

    } catch (error) {
        return error.message;
    }
};

export const GetAllProducts = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/products/get-all-products`);
        return response.data;

    } catch (error) {
        return error.message;
    }
};

export const UploadImage = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/products/upload-product-chart`, payload);
        return response.data;

    } catch (error) {
        return error.message;
    }
}
export const UploadImageChallan = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/products/upload-challan-chart`, payload);
        return response.data;

    } catch (error) {
        return error.message;
    }
}

export const GetProductById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/products/get-product-by-id/${id}`);
        return response.data;

    } catch (error) {
        return error.message;
    }
};

export const UpdateProduct = async (id, payload) => {
    try {
        const response = await axios.patch(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/products/edit-product/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message;
    }
};

export const DeleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/products/delete-product/${id}`);

        if (response.status === 204) {
            return { success: true, message: 'Product deleted successfully' };
        } else {
            return { success: false, message: `Failed to delete product - ${response.statusText}` };
        }
    } catch (error) {
        return { success: false, message: `Failed to delete product - ${error.message}` };
    }
};

