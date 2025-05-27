# Macro Labs News App - Backend

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
   git clone https://github.com/your-repo/backend-macro-labs-news-app.git
   cd backend-macro-labs-news-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables:

   ```env
   MONGO_URI=mongodb://localhost:27017/news-app
   JWT_SECRET=your_jwt_secret
   CAPTCHA_SECRET=your_captcha_secret
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

---

## API Endpoints

### Authentication

#### **Register**

- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "username": "exampleuser",
    "email": "user@example.com",
    "password": "securepassword",
    "role": "user",
    "captchaToken": "captcha-response-token"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt-token",
    "user": {
      "id": "user-id",
      "username": "exampleuser",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

#### **Login**

- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "identifier": "exampleuser or user@example.com",
    "password": "securepassword",
    "captchaToken": "captcha-response-token"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt-token",
    "user": {
      "id": "user-id",
      "username": "exampleuser",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

---

### Users

#### **Get All Users**

- **GET** `/users`
- **Response**:
  ```json
  [
    {
      "id": "user-id",
      "username": "exampleuser",
      "email": "user@example.com",
      "role": "user",
      "isActive": true
    }
  ]
  ```

#### **Get User by ID**

- **GET** `/users/:id`
- **Response**:
  ```json
  {
    "id": "user-id",
    "username": "exampleuser",
    "email": "user@example.com",
    "role": "user",
    "isActive": true
  }
  ```

---

### Articles

#### **Create Article**

- **POST** `/articles`
- **Body**:
  ```json
  {
    "title": "Article Title",
    "content": "Article content goes here.",
    "summary": "Short summary of the article.",
    "category": "technology",
    "tags": ["tech", "innovation"],
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "id": "article-id",
    "title": "Article Title",
    "content": "Article content goes here.",
    "summary": "Short summary of the article.",
    "category": "technology",
    "tags": ["tech", "innovation"],
    "imageUrl": "https://example.com/image.jpg",
    "author": "user-id",
    "views": 0,
    "likes": 0,
    "isPublished": true
  }
  ```

#### **Get All Articles**

- **GET** `/articles`
- **Response**:
  ```json
  [
    {
      "id": "article-id",
      "title": "Article Title",
      "summary": "Short summary of the article.",
      "category": "technology",
      "author": "user-id",
      "views": 0,
      "likes": 0,
      "isPublished": true
    }
  ]
  ```

#### **Get Article by ID**

- **GET** `/articles/:id`
- **Response**:
  ```json
  {
    "id": "article-id",
    "title": "Article Title",
    "content": "Article content goes here.",
    "summary": "Short summary of the article.",
    "category": "technology",
    "tags": ["tech", "innovation"],
    "imageUrl": "https://example.com/image.jpg",
    "author": "user-id",
    "views": 0,
    "likes": 0,
    "isPublished": true
  }
  ```

#### **Update Article**

- **PUT** `/articles/:id`
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content.",
    "summary": "Updated summary.",
    "category": "business",
    "tags": ["finance", "economy"],
    "imageUrl": "https://example.com/new-image.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "id": "article-id",
    "title": "Updated Title",
    "content": "Updated content.",
    "summary": "Updated summary.",
    "category": "business",
    "tags": ["finance", "economy"],
    "imageUrl": "https://example.com/new-image.jpg",
    "author": "user-id",
    "views": 0,
    "likes": 0,
    "isPublished": true
  }
  ```

#### **Delete Article**

- **DELETE** `/articles/:id`
- **Response**:
  ```json
  {
    "message": "Article deleted successfully."
  }
  ```

---

## Project Structure

```
src/
├── auth/               # Authentication module
├── users/              # User management module
├── articles/           # Article management module
├── captcha/            # Captcha validation module
├── main.ts             # Application entry point
```

---

## Running Tests

Run the tests using:

```bash
npm run test
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
