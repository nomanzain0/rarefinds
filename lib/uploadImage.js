import axios from 'axios';

const IMGUR_CLIENT_ID = '66b3df88e8bd81b'; // Replace with your Imgur Client ID

export const uploadImage = async (imageUri,mimeType) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: mimeType, // or your image type
      name: `rarefinds-${Date.now()}`, // or your image name
    });

    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data,"checking image upload response")
    if (response.status===200) {
      return response.data.data.link; // The URL of the uploaded image
    } else {
      throw new Error('Failed to upload image to Imgur');
    }
  } catch (error) {
    alert(error)
    console.error('Error uploading image:', error);
    throw error;
  }
};
