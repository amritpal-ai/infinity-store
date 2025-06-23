# INFINITE STORE – Cloud-Based Shopping Platform

This project is a full-stack e-commerce web application built as part of a cloud computing course. It demonstrates usage of multiple cloud services across storage, deployment, and hosting.

---

## 🌍 Live URLs:

* **Frontend (Netlify):** [https://comfy-peony-b9f9ef.netlify.app](https://comfy-peony-b9f9ef.netlify.app)
* **Backend (Render):** [https://infinity-backend-eopv.onrender.com](https://infinity-backend-eopv.onrender.com)

---

## 🛠️ Features:

* Signup & Login system
* Add to Cart and Shop Pages
* Payment Data collection
* Responsive UI
* Images stored securely in the cloud

---

## ☁️ Cloud Services Used:

* **Netlify** – Hosting the frontend (HTML/CSS/JS)
* **Render** – Hosting the backend (Node.js/Express server)
* **Neon.tech** – Cloud PostgreSQL database to store users and payment info
* **Cloudinary** – Cloud storage for product images

---

## 🧠 How Everything Connects:

* The frontend is hosted on Netlify and makes API calls to the Render backend.
* The backend is deployed on Render and uses Neon.tech for the PostgreSQL database.
* Product images or uploads are stored in Cloudinary and retrieved via secure URLs.

---

## 📝 How to Run Locally:

1. Clone this repo and run `npm install` inside the `/backend` folder.
2. Create a `.env` file in `/backend` with:

   ```
   DATABASE_URL=... (your Neon DB URL)  
   CLOUDINARY_URL=... (your Cloudinary API string)
   ```
3. Start the backend server with:

   ```
   node server.js
   ```
4. Open `signup.html` or `index.html` in a browser from the `/frontend` folder.

---

## 📁 Folder Structure:

```
/frontend     → Static frontend files (HTML/CSS/JS)
 /backend      → Backend logic and API endpoints
 .env          → Environment variables for backend
 .gitignore    → Ignored files list
 package.json  → Backend dependencies and scripts
```

---

## ✅ Project Guidelines Compliance:

* ✅ 4+ cloud services used
* ✅ Mixed cloud vendors
* ✅ Public GitHub repository
* ✅ Clear README with full explanation
* ✅ Project flow and service usage documented
