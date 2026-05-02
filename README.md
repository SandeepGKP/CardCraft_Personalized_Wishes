#  CardCraft - Personalized Wishes

**CardCraft** is a premium, AI-powered greeting card studio that allows users to create, personalize, and share high-fidelity wishes in seconds. Whether it's a birthday, anniversary, or festival, CardCraft provides a seamless experience from design to delivery.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)

---

## 📌 Table of Contents
- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Setup & Installation](#️-setup--installation)
- [📄 License](#-license)


---


## 🚀 Key Features

### 1. **Pro Design Studio**
- **Live Templates**: Fetches 13+ categories of high-quality background images live from the Unsplash API.
- **Smart Overlay**: Automatically overlays your name and profile picture onto the card for a professional, customized look.
- **Internet Stickers**: Search and add real-time transparent stickers powered by Giphy.
- **Typography Engine**: Choose from multiple premium fonts (Modern, Elegant, Artistic) and customize size, color, and alignment.

### 2. **Seamless Sharing**
- **Dynamic Links**: Generate a unique URL for your card that anyone can view in high fidelity.
- **Image Export**: Merges all layers into a single high-resolution image for direct download.
- **Native Share**: Integrated with the system share sheet for one-click sharing to WhatsApp, Instagram, and more.

### 3. **Premium Experience**
- **Multi-Theme Support**: Switch between **Midnight (Dark)**, **Cloud (Light)**, and **Royal (Purple)** themes.
- **Monetization**: Built-in "PRO" content identification and subscription upsell flow.
- **Authentication**: Secure login via Google, Email, or instant Guest access.

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- html2canvas (Image Rendering)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT (Authentication)
- Cloudinary (Image Hosting)
- Giphy & Unsplash API Integrations

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- API Keys for: Unsplash, Giphy, and Google OAuth

### 1. Clone the Repository
```bash
git clone https://github.com/SandeepGKP/CardCraft_Personalized_Wishes.git
cd CardCraft_Personalized_Wishes
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
GIPHY_API_KEY=your_giphy_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```
Run the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```
Create a `.env` file in the `Frontend` folder:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
Run the frontend:
```bash
npm run dev
```

---

## 📄 License
This project is developed as part of a technical assignment. All rights reserved.

**Developed with ❤️ by Sandeep**
