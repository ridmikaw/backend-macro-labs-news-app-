# Macro Labs News App - Backend

[![Postman API Documentation](https://documenter.getpostman.com/view/42955753/2sB2qdgfFN)](https://documenter.getpostman.com/view/42955753/2sB2qdgfFN)

This is the backend service for the Macro Labs News App, built using NestJS. It provides APIs for authentication, user management, article management, and other features required for the application.

---

## Features

- **Authentication**: User registration and login with role-based access control.
- **Captcha Validation**: Protects endpoints from automated abuse using Google reCAPTCHA.
- **User Management**: Create, retrieve, and manage users.
- **Role Management**: Supports roles like admin, editor, and user.
- **Article Management**: Create, update, delete, and retrieve articles with categories and tags.

---

## Technologies Used

- **Framework**: NestJS
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: `class-validator`
- **Password Hashing**: `bcryptjs`
- **Captcha**: Google reCAPTCHA

---

## Prerequisites

- **Node.js** (v16 or later)
- **MongoDB** (running instance)
- **npm** or **yarn**

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ridmikaw/backend-macro-labs-news-app-.git
   cd backend-macro-labs-news-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables:

   ```env
   MONGO_URI=mongodb+srv://ridmi:ridmi123@derana.svw3rzi.mongodb.net/?retryWrites=true&w=majority&appName=Derana
   JWT_SECRET=your_jwt_secret
   CAPTCHA_SECRET=your_captcha_secret
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```



