MedTrack - Personal Health Record & Reminder App

Welcome to **MedTrack**, a full-stack web application designed to help users manage their medical records and reminders effortlessly. Whether you want to store your health documents securely, get notified about regular checkups or medications, or even share your data with doctors through OTP-based access – MedTrack has you covered.



## 🌟 What is MedTrack?

**MedTrack** is your digital health assistant. Users can:
- Upload and organize medical records (e.g., prescriptions, lab reports)
- Set reminders for medications and checkups with smart repeat options
- Receive email reminders at the right time (based on type)
- Share their records securely with doctors using OTP-based access
- Export their data as a PDF for offline storage



## 🔧 Technologies Used

### 📦 Backend:
- Node.js + Express
- MongoDB (via Mongoose)
- JWT Authentication
- Nodemailer (for sending OTPs and reminders)

### 💻 Frontend:
- React.js (with React Router)
- Axios for API calls
- Bootstrap for styling


## ⚙️ Setup Instructions

Follow the steps below to run MedTrack on your local machine.

### 1️⃣ Clone the Repo

git clone https://github.com/Raniyaaaa/medtrack.git
cd medtrack
2️⃣ Backend Setup
cd backend
npm install
Create a .env file in the /backend folder and add:

MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_access_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

EMAIL=youremail@gmail.com
EMAIL_PASSWORD=your_email_password_or_app_pass
PORT=8000
Then start the server:
node server.js

3️⃣ Frontend Setup
cd ../frontend
npm install
Create a .env file in the /frontend folder and add:
REACT_APP_API_BASE=http://localhost:8000/api
Then start the frontend:
npm start

✅ Frontend runs on: http://localhost:3000
✅ Backend runs on: http://localhost:8000
