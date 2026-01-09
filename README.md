
# Roxiler Store Management Systemm (Login System )

A full-stack web application designed for System Administrators, Store Owners, and Users to manage store ratings and performance metrics.

## 🛠️ Features

* **Admin Dashboard**: Manage users and stores, view system-wide stats.
* **Owner Dashboard**: View store performance, average ratings, and customer feedback.
* **User Management**: Direct user creation with role assignments and hashed passwords.
* **Rating System**: Users can rate stores from 1 to 5 stars.

## 🏗️ Project Structure

* **`/frontend`**: React.js with Vite.
* **`/backend`**: Node.js with Express.js and MySQL.

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js**: v16+.
* **MySQL Server**: 8.0+.
* **npm**: v8+.

### 2. Clone the Repository

```bash
git clone <your-repository-url>
cd Roxiler

```

### 3. Backend Setup

1. **Navigate to the backend directory**:
```bash
cd backend

```


2. **Install dependencies**:
Note: Use `bcryptjs` for better compatibility on Windows environments.
```bash
npm install
npm install bcryptjs

```


3. **Create a `.env` file** in the `backend` folder:
```env
PORT=3035
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=roxiler_db
JWT_SECRET=your_super_secret_key

```


4. **Start the server**:
```bash
node index.js

```



### 4. Frontend Setup

1. **Navigate to the frontend directory**:
```bash
cd ../frontend

```


2. **Install dependencies**:
```bash
npm install

```


3. **Create a `.env` file** in the `frontend` folder:
```env
VITE_BACKEND_URL=http://localhost:3035

```


4. **Start the development server**:
```bash
npm run dev

```



---

## 📊 Database Schema Setup

Run these SQL queries in your MySQL terminal or Workbench to set up the necessary tables.

### Create Database

```sql
CREATE DATABASE roxiler_db;
USE roxiler_db;

```

### 1. Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    role ENUM('System Administrator', 'Store Owner', 'Normal User') DEFAULT 'Normal User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 2. Stores Table

```sql
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

```

### 3. Ratings Table

```sql
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    store_id INT,
    rating_value INT CHECK (rating_value BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

```

---

