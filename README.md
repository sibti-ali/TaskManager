# Task Manager

A simple Task manager system built with React, Express, Node.js, and SQL.

## Table of Contents
- [Cloning the Repository](#cloning-the-repository)
- [Installing Dependencies](#installing-dependencies)
- [Importing the Database](#importing-the-database)
- [Running the Application Locally](#running-the-application-locally)
- [Deploying to Production](#deploying-to-production)

## Cloning the Repository

To get started, clone the repository using the following command:

```sh
git clone https://github.com/sibti-ali/TaskManager.git
```
#Importing the attached MySQL Database using MySQL workbench or CLI:
1. Create the database:
 ```sh
  mysql -u root -p -e "CREATE DATABASE taskmanager;"
   ```
2. Import the database:
 ```sh
  mysql -u root -p taskmanager < dumpfile.sql
   ```
Note:
Replace root with your MySQL username.
Replace taskmanager with your database name.
You'll be prompted to enter your MySQL password.

Or simply just run this query:
```sh
  CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('pending','committed','completed') NOT NULL DEFAULT 'pending',
  `dueDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
   ```


## Installing Dependencies

Ensure you have Node.js and npm installed. Then, install dependencies for both the client and server:

```sh
cd frontend
npm install
cd ../backend
npm install
```


## Running the Application Locally

To run the application locally, follow these steps:

0. Connect to the database: Setup the .env files inside the backend folder:
 example .env in backend:

 ```sh
   DB_HOST= localhost
   DB_USER= root
   DB_PASSWORD= password
   DB_NAME=myapplication
   PORT= 5000
   ```

Please make sure that the port numbers match!

1. Start the backend server
   ```sh
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```sh
   cd frontend
   npm start
   ```

The frontend/webapp will be accessible at `http://localhost:3000`.
The Backend/api will be accessible at `http://localhost:5000` route: (http://localhost:5000/api/tasks).
All done!

Additional steps for deployment:
## Deploying to Production

To deploy this application to a production environment, follow these high-level steps:

1. Choose a cloud provider:
   - **Recommended:** AWS (EC2 for backend, S3 for frontend, RDS for SQL database)
   - Alternative: DigitalOcean, Vercel (frontend), Railway (backend + DB)
2. Configure the production database.
3. Build the frontend for production:

```sh
cd frontend
npm run build
```

4. Deploy the frontend to a static hosting service (AWS S3, Vercel, Netlify, etc.).
5. Deploy the backend to a cloud server (EC2, DigitalOcean Droplet, or Railway).
6. Set up environment variables in production.

### AWS Deployment (EC2 + RDS)

1. Create an EC2 instance and SSH into it.
2. Install Node.js and required dependencies.
3. Pull the repository and install dependencies.
4. Set up a process manager like PM2:
   ```sh
   pm2 start server/server.js --name task-app
   ```
5. Configure Nginx or another reverse proxy.
6. Deploy the frontend to an S3 bucket and serve via CloudFront.

For further details, refer to the official AWS, Vercel, or DigitalOcean documentation.

---

For any issues, feel free to open an issue on the [GitHub repository](https://github.com/sibti-ali/ContactsApplication/issues).

