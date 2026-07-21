import axios from "axios"
import toast from 'react-hot-toast'


export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/login`, payload);
    return response.data;
  } catch (error) {
    return error.message
  }
}


export const GetCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      // Handle the case where the token is not available
      throw new Error("Token not available");
    }
      //  console.log(import.meta.env.VITE_SERVER)
    const response = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/get-current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return error.message;
  }
};





export const UploadProfileImage = async(payload) =>{
  try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/uploadprofileimage`,payload);
      return response.data;
      
  } catch (error) {
      return error.message;
  }
}

export const updateUser = async (payload,id) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/updateuser/${id}`,
   payload);
    return response.data;
    
  } catch (error) {
    return error.message
  }
}
