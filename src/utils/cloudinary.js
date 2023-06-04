import * as dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary';




cloudinary.config({ 
    cloud_name: 'dxmo3ijlq', 
    api_key: '152298584562871', 
    api_secret: 'R7TbSyf36oz9Pe-KYTfvzNt6LpY',
    secure:true 
  });

export default cloudinary;
