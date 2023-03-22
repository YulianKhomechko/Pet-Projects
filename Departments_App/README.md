# Departments and Employees App.

---

## Available Scripts

In the project directory, you can run:

### `npm run start:all`

Run the app in development mode: start both frontend and backend.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.\
Backend will run on http://localhost:3030.

### `start:frontend`

Run *frontend* in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `start:backend`

Run *backend*.\
Backend will run on http://localhost:3030.

### `build:frontend`

Builds frontend for production to the build folder.

### `build:backend`

Builds backend for production to the build folder.

### `build:all`

Builds both frontend and backend to the build folders.

### `docker-compose up -d` 

Run Docker containers in detached mode. Will start MySQL database, backend server, and React application which will be available on localhost:3000. 

### `docker-compose up -d --build`

Build images before running Docker containers (in detached mode). Should be used is changes in the code were made.

### `DOCKERFILE=Dockerfile.prod.dockerfile docker-compose up --build -d`

Production build of React application. Build images before running Docker containers (in detached mode).

### `docker-compose down`

Stop and remove all Docker containers.

### `docker-compose down -v`

Stop and remove all Docker containers and remove associated volumes. Use to erase all stored information (e.g. logs, database).

### `docker exec -it departments-app_backend npm run db:seed`

Run this command to seed database with test entities.

## Technologies
- TypeScript
- React.js
- Tailwind
- Axios
- Node.js
- Express
- Sequelize
- JWT
- Socket.io
- Jest
- Docker

## Features

### Authorization

In this app authorization is implemented via JSON web tokens(access and refresh tokens).\
You must be authorized to perform any actions.\
Unauthorized user will be automatically redirected to the login page when he can log in, restore his password or
register.

### User roles and permissions

**Common permissions**: Any authorized user, regardless his role, is able to see list of departments, departments
details,
own profile, list of employees and can start chat with another employee.

There are three different roles in this app: ***admin***, ***head*** and ***user***.

**Admin** is allowed to create, edit and delete departments as well as employees.

**Head** is allowed to create, edit and delete employees.

**User** doesn't have any special permissions.

### Real-time chat

Any authorized user can start chat with another employee. Chat is implemented using web sockets and specifically
socket.io.\
To navigate to chat page press chat icon in left corner of the header. On the chat page you will see the list of all
chats you are participating in
(on the left side). You can select any chat by clicking on it. Then you will see list of all messages related to
selected chat.

### Docker 
This app is Dockerized.  
