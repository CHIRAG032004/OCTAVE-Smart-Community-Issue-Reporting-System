import axios from 'axios';
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(`${BASE_API_URL}/api/upload`, formData, {
      timeout: 30000
    });

    return res.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};  


export default uploadImage;
