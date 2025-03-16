# Secure Access Management Platform API Documentation

## Overview

This documentation provides an overview of the API endpoints available in the Secure Access Management Platform. Each endpoint is described with its purpose, request parameters, response object, and authentication requirements.

## Endpoints

### User Endpoints

#### 1. Register User

- **Endpoint:** `/api/users/register`
- **Method:** POST
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "phone": "string",
    "location": "string",
    "role": "string"
  }
  ```
- **Response:**
  - **Status:** 201 Created
  - **Body:**
    ```json
    {
      "accessToken": "string",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "role": "string"
      }
    }
    ```

#### 2. Login User

- **Endpoint:** `/api/users/login`
- **Method:** POST
- **Description:** Logs in a user.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "accessToken": "string",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "role": "string"
      }
    }
    ```

#### 3. Logout User

- **Endpoint:** `/api/users/logout`
- **Method:** GET
- **Description:** Logs out a user.
- **Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

#### 4. Get User Details

- **Endpoint:** `/api/users/me`
- **Method:** GET
- **Description:** Fetches details of the logged-in user.
- **Authentication:** Requires access token.
- **Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "role": "string"
    }
    ```

#### 5. Refresh Access Token

- **Endpoint:** `/api/users/refresh`
- **Method:** POST
- **Description:** Generates a new access token using the refresh token.
- **Authentication:** Requires refresh token.
- **Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "accessToken": "string"
    }
    ```

### Admin Endpoints

#### 1. Get All Users

- **Endpoint:** `/api/admin/users`
- **Method:** GET
- **Description:** Fetches a list of all users.
- **Authentication:** Requires access token and admin role.
- **Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "role": "string"
      }
    ]
    ```

## Error Handling

All endpoints may return the following error responses:

### 400 Bad Request

- **Description:** The request could not be understood or was missing required parameters.
- **Body:**
  ```json
  {
    "error": "string"
  }
  ```

### 403 Forbidden

- **Description:** The request is understood, but it has been refused or access is not allowed.
- **Body:**
  ```json
  {
    "error": "string"
  }
  ```

### 404 Not Found

- **Description:** The requested resource could not be found.
- **Body:**
  ```json
  {
    "error": "string"
  }
  ```

### 500 Internal Server Error

- **Description:** An error occurred on the server.
- **Body:**
  ```json
  {
    "error": "string"
  }
  ```

## Conclusion

This documentation provides a comprehensive overview of the API endpoints available in the Secure Access Management Platform. For further assistance, please contact the development team.
