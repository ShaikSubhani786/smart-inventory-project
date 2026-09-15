# Smart Inventory Management System

A full-stack inventory management application built with **FastAPI, React, PostgreSQL, SQLAlchemy, Alembic, JWT Authentication, Docker, and Cloudinary**.

The system provides secure inventory operations with **role-based access control**, product management, stock tracking, suppliers, purchases, sales, reports, and cloud-based product image storage.

---

## 📌 Project Overview

The **Smart Inventory Management System** is a full-stack web application designed to manage inventory operations efficiently and securely.

The system provides features for managing products, categories, suppliers, stock transactions, purchases, sales, and inventory reports through a centralized dashboard.

It includes secure **JWT-based authentication** and **Role-Based Access Control (RBAC)** with separate permissions for Admin and User accounts. Administrators can manage inventory data and perform stock operations, while regular users can access inventory information and perform permitted sales-related operations.

The backend is developed using **FastAPI** with **PostgreSQL**, **SQLAlchemy**, and **Alembic**, while the frontend is built using **React with Vite**. Product images are stored using **Cloudinary** for persistent cloud-based image storage.

The application is deployed to the cloud, with the backend hosted on **Render** and the frontend hosted on **Vercel**.

---

## ✨ Key Features

- 🔐 **Secure Authentication**
  - User registration and login
  - JWT-based authentication
  - Password hashing
  - Protected frontend and backend routes

- 👥 **Role-Based Access Control**
  - Separate Admin and User roles
  - Backend-enforced permissions
  - Admin-only inventory management operations
  - Role verification during login

- 📦 **Product Management**
  - Create, view, update, and delete products
  - Product search, filtering, sorting, and pagination
  - Product image upload using Cloudinary

- 🗂️ **Category Management**
  - View product categories
  - Admin-controlled category creation and deletion

- 🚚 **Supplier Management**
  - View supplier information
  - Admin-controlled supplier management

- 📊 **Stock Management**
  - Track inventory transactions
  - Stock In and Stock Out operations
  - View stock transaction history

- 🛒 **Sales Management**
  - Create sales transactions
  - View sales records

- 📥 **Purchase Management**
  - Record inventory purchases
  - View purchase history
  - Admin-controlled purchase creation

- 📈 **Dashboard & Reports**
  - Centralized inventory dashboard
  - Inventory and transaction information
  - Sales, purchase, and stock reporting

- ☁️ **Cloud Image Storage**
  - Product images stored using Cloudinary
  - Persistent images across backend deployments

- 🚀 **Cloud Deployment**
  - React frontend deployed on Vercel
  - FastAPI backend deployed on Render
  - PostgreSQL production database
  - Automatic Alembic migrations during backend startup

---
## 📸 Application Screenshots

### Dashboard

The dashboard provides a quick overview of products, categories, stock levels, and low-stock information.

![Smart Inventory Dashboard](screenshots/dashboard.png)

### Product Management

Administrators can manage products, inventory information, pricing, categories, and cloud-hosted product images.

![Product Management](screenshots/products.png)

### Category Management

Product categories can be viewed by authenticated users and managed by administrators.

![Category Management](screenshots/categories.png)

### Stock Management

The stock management module records Stock In and Stock Out transactions and maintains inventory movement history.

![Stock Management](screenshots/stock.png)

### Sales Management

Authenticated users can create sales transactions and view existing sales records.

![Sales Management](screenshots/sales.png)

### Purchase Management

Administrators can record inventory purchases while authenticated users can view purchase history.

![Purchase Management](screenshots/purchases.png)

### Reports

The reports module provides inventory summaries, stock information, and low-stock product reporting.

![Inventory Reports](screenshots/reports.png)

---
## 🛠️ Technology Stack

### Frontend

- **React.js**
- **Vite**
- **JavaScript (ES6+)**
- **HTML5 & CSS3**
- **React Router**
- **Fetch API**

### Backend

- **Python**
- **FastAPI**
- **Uvicorn**
- **Pydantic**
- **JWT**
- **Passlib & bcrypt**

### Database

- **PostgreSQL**
- **SQLAlchemy**
- **Alembic**

### Cloud & Deployment

- **Cloudinary**
- **Render**
- **Vercel**
- **Docker**

### Development & Testing

- **Git & GitHub**
- **Swagger UI / OpenAPI**
- **Pytest**
- **VS Code**

---
---



## 🏗️ Project Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│        Vite + React          │
│                              │
│ Login | Dashboard | Products │
│ Categories | Stock | Sales   │
│ Suppliers | Purchases        │
│ Reports                      │
└──────────────┬───────────────┘
               │
               │ HTTP / REST API
               │ JWT Authentication
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│                              │
│ Authentication & RBAC        │
│ Business Logic               │
│ REST API Endpoints           │
│ Request Validation           │
└──────────┬───────────┬───────┘
           │           │
           ▼           ▼
┌─────────────────┐  ┌─────────────────┐
│   PostgreSQL    │  │   Cloudinary    │
│                 │  │                 │
│ Inventory Data  │  │ Product Images  │
└────────┬────────┘  └─────────────────┘
         │
         ▼
   ┌───────────┐
   │  Alembic  │
   │ Migrations│
   └───────────┘
```

### Application Flow

1. The user accesses the **React frontend**.
2. Registration and login requests are sent to the **FastAPI REST API**.
3. After successful authentication, the backend generates a **JWT access token**.
4. Protected requests use the JWT token for authentication.
5. **RBAC** determines whether the authenticated User or Admin can perform the requested operation.
6. **SQLAlchemy** communicates with PostgreSQL.
7. Product images are uploaded to **Cloudinary**, while their URLs are stored with product data.
8. **Alembic** manages database schema migrations.

---

## 👥 Role-Based Access Control

| Feature | Admin | User |
|---|:---:|:---:|
| View Dashboard | ✅ | ✅ |
| View Products | ✅ | ✅ |
| Search / Filter Products | ✅ | ✅ |
| Add / Update / Delete Products | ✅ | ❌ |
| Upload Product Images | ✅ | ❌ |
| View Categories | ✅ | ✅ |
| Add / Delete Categories | ✅ | ❌ |
| View Suppliers | ✅ | ✅ |
| Manage Suppliers | ✅ | ❌ |
| View Stock History | ✅ | ✅ |
| Stock In / Stock Out | ✅ | ❌ |
| Create Sales | ✅ | ✅ |
| View Sales | ✅ | ✅ |
| View Purchases | ✅ | ✅ |
| Add Purchases | ✅ | ❌ |
| View Reports | ✅ | ✅ |

### Authentication & Authorization Flow

- New registrations are created as **User** accounts by default.
- The login page allows selection of **User** or **Admin**.
- Selecting Admin does not grant administrator privileges.
- The backend verifies the selected role against the account's database role.
- A role mismatch causes the login request to be rejected.
- The authenticated user's database role is included in the JWT.
- Backend authorization checks protect administrative operations.

---

## 📁 Project Structure

```text
smart-inventory-project/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dependencies.py
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── category.py
│   │   │       ├── dashboard.py
│   │   │       ├── products.py
│   │   │       ├── purchase.py
│   │   │       ├── reports.py
│   │   │       ├── sales.py
│   │   │       ├── stock_transaction.py
│   │   │       └── supplier.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── exceptions.py
│   │   │   ├── logger.py
│   │   │   └── security.py
│   │   │
│   │   ├── crud/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Categories.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Purchases.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Sales.jsx
│   │   │   ├── Stock.jsx
│   │   │   └── Suppliers.jsx
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ShaikSubhani786/smart-inventory-project.git
cd smart-inventory-project
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env` using `.env.example` as a template.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
SECRET_KEY=your_secure_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create the PostgreSQL database and apply migrations:

```bash
alembic upgrade head
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

> Never commit real `.env` files, database passwords, JWT secrets, or Cloudinary credentials.

---

## 🌐 Live Demo

### Frontend

https://smart-inventory-project-sigma.vercel.app

### Backend API

https://smart-inventory-project.onrender.com

### Swagger API Documentation

https://smart-inventory-project.onrender.com/docs

> The backend is hosted on Render's free service, so the first request may take additional time if the service has been inactive.

---

## 🔗 Main API Endpoints

The main API modules are organized under `/api/v1`.

| Module | Base Endpoint |
|---|---|
| Authentication | `/api/v1/auth` |
| Products | `/api/v1/products` |
| Categories | `/api/v1/categories` |
| Suppliers | `/api/v1/suppliers` |
| Stock | `/api/v1/stock` |
| Sales | `/api/v1/sales` |
| Purchases | `/api/v1/purchases` |
| Dashboard | `/api/v1/dashboard` |
| Reports | `/api/v1/reports` |

Important authentication endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

Protected API requests use:

```text
Authorization: Bearer <access_token>
```

The complete API can be explored through Swagger:

https://smart-inventory-project.onrender.com/docs

---

## 🗄️ Database Design

The application uses **PostgreSQL**, **SQLAlchemy ORM**, and **Alembic**.

### Main Tables

| Table | Purpose |
|---|---|
| `users` | User accounts, authentication information, roles, and status |
| `categories` | Product categories |
| `products` | Product details, prices, quantities, and image URLs |
| `suppliers` | Supplier contact information |
| `stock_transactions` | Stock In and Stock Out operations |
| `sales` | Product sales |
| `purchases` | Inventory purchases |

### Relationships

```text
Category  ────────< Product
                       │
                       ├────< Stock Transaction
                       ├────< Sale
                       └────< Purchase >──── Supplier

User ─────────────< Stock Transaction
User ─────────────< Sale
User ─────────────< Purchase
```

The `products` table includes:

```text
id
name
description
sku
barcode
price
quantity
minimum_stock
image_url
category_id
created_at
```

Stock transactions support:

```text
STOCK_IN
STOCK_OUT
```

Each stock transaction records the product, user, transaction type, quantity, remarks, and creation time.

---

## 🚀 Deployment Architecture

```text
                 ┌─────────────────┐
                 │      User       │
                 │   Web Browser   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     Vercel      │
                 │ React Frontend  │
                 └────────┬────────┘
                          │
                    HTTPS / REST
                          │
                          ▼
                 ┌─────────────────┐
                 │     Render      │
                 │ FastAPI Backend │
                 │    + Docker     │
                 └──────┬────┬─────┘
                        │    │
                        ▼    ▼
              ┌───────────┐ ┌───────────┐
              │PostgreSQL │ │Cloudinary │
              │ Database  │ │  Images   │
              └───────────┘ └───────────┘
```

The production architecture consists of:

- **Vercel** for the React frontend
- **Render** for the FastAPI backend
- **PostgreSQL** for persistent application data
- **Cloudinary** for product images
- **Docker** for backend containerization
- **Alembic** for database migrations

Alembic migrations are automatically applied when the backend container starts.

---

## 🔒 Security Features

The project includes multiple security measures:

- **JWT authentication**
- **Password hashing with Passlib and bcrypt**
- **Backend-enforced Role-Based Access Control**
- **Protected React routes**
- **Protected FastAPI endpoints**
- **CORS configuration**
- **Pydantic request validation**
- **Environment-variable based secret management**
- **Restricted product image file types**

Newly registered accounts receive the **User** role by default.

Administrative operations require an authenticated account with the appropriate database role. Selecting Admin on the frontend does not grant administrator permissions.

Real `.env` files are excluded from Git and sensitive credentials are not intended to be stored directly in the source code.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Low-stock notifications
- Email alerts
- Advanced dashboard analytics and charts
- PDF and Excel report export
- Invoice generation
- Administrative user management
- Audit logging
- Improved mobile responsiveness
- Expanded automated testing
- Database and API performance optimization
- Caching
- CI/CD automation

---

## 👨‍💻 Author

### Shaik Subhani

B.Tech Computer Science graduate interested in **Python Development, Full Stack Development, Cloud, and DevOps**.

This project demonstrates practical experience with:

- Python and FastAPI
- REST API development
- PostgreSQL
- SQLAlchemy and Alembic
- JWT authentication
- Role-Based Access Control
- React
- API integration
- Docker
- Cloud deployment
- Git and GitHub

### GitHub

https://github.com/ShaikSubhani786

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a **star**.

Suggestions and feedback are welcome.
