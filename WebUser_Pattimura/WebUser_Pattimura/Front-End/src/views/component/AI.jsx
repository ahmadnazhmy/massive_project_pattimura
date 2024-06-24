// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AI = ({ file }) => {
//   const [response, setResponse] = useState(null);

//   // Function to handle image upload and then call postData
//   const handleImageUpload = async (imageFile) => {
//     const formData = new FormData();
//     formData.append('image', imageFile);

//     try {
//       const response = await axios.post('http://localhost:3002/reports', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (!response.data.imageUrl) {
//         throw new Error('Failed to upload image');
//       }

//       const imageUrl = response.data.imageUrl;
//       return imageUrl; // Return the imageUrl to be used in postData
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       return null;
//     }
//   };

//   // Function to send POST request to AI prediction endpoint
//   const postData = async (imageUrl) => {
//     const url = 'https://pothole-detection.1iev9smru8jl.us-south.codeengine.appdomain.cloud/predict';
//     const data = { imageUrl };
  
//     try {
//       const result = await axios.post(url, data, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       const predictions = result.data;
  
//       // Menghitung jumlah lubang berdasarkan prediksi
//       const numberOfPotholes = predictions.length;
  
//       // Menyimpan jumlah lubang ke dalam state response
//       setResponse(numberOfPotholes);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };  

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (file) {
//       const imageUrl = await handleImageUpload(file);
//       if (imageUrl) {
//         await postData(imageUrl);
//       }
//     } else {
//       console.error('No file selected');
//     }
//   };

//   // Call handleSubmit whenever the file changes
//   useEffect(() => {
//     if (file) {
//       handleSubmit();
//     }
//   }, [file]);

//   return (
//     <div>
//       {response && (
//         <div>
//           <ul>
//             {response.map((category, index) => (
//               <li key={index}>{category}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AI;
