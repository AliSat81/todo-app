# ToDo App

A full-stack, interactive task management application designed to enhance productivity and task organization. This app allows users to create, update, organize, and track tasks, with features like drag-and-drop sorting, status grouping, and customizable task ordering.

## Features

- **Task Creation & Management**: Create, update, and track task progress.
- **Draggable Interface**: Easily reorder tasks within their own status columns using drag-and-drop functionality.
- **Task Statuses**: Tasks are grouped by status (e.g., `done`, `doing`, `todo`, `extra`).
- **Responsive UI**: The app is designed for smooth usage across different screen sizes.

## Tech Stack

### Frontend
- **Next.js 14**: Frontend framework with the app directory and `src` structure.
- **React Hook Form + Yup**: Simplified form handling and validation.
- **Redux Toolkit**: State management, enabling real-time task updates and interactions.

### Backend
- **Node.js (Express)**: RESTful API setup with CRUD operations for tasks.
- **Static Typing**: TypeScript for static typing throughout the backend.
- **NoSQL Database**: MongoDB for data storage, with object data modeling using Mongoose.
- **Validation**: Data validation with Joi, ensuring robust input handling.
- **Error Handling**: Centralized error handling mechanism for consistent responses.
- **API Documentation**: API documentation generated using `swagger-jsdoc` and presented with `swagger-ui-express`.
- **Process Management**: PM2 is utilized for production process management, handling application clustering, restarts, and load balancing.

### Deployment & DevOps
- **Docker**: Separate `docker-compose.yml` files for development and production environments, allowing isolated configurations.
- **GitHub Actions**: CI/CD setup in the `.github/workflows` directory to automate deployment.
- **PM2 (for non-Docker setups)**: Provides app management and monitoring.

## Project Structure

The project is structured into `frontend` and `backend` folders:
- **Frontend**: Contains all UI-related code and configurations.
    - `.env` file:

        ```plaintext
        # NEXT_PUBLIC_API_URL: Provide the API URL to connect to the server.
        # If a value is provided, the application will connect to that server.
        # If left empty, the application will default to connecting to localhost:3000 for experimental purposes.
        NEXT_PUBLIC_API_URL=
        ```
- **Backend**: Contains API logic, with key services for task swapping, pagination, validation, and more.
    - `.env` file:

        ```plaintext
        # Port number
        PORT=3000

        development | production
        NODE_ENV= 

        # URL of the Mongo DB
        MONGODB_URL=

        # URL of client application
        CLIENT_URL=
        ```

### Folder Structure

```plaintext

├───.github
│   └───workflows
├───backend
│   ├───packages
│   └───src
│       ├───config
│       ├───modules
│       │   ├───errors
│       │   ├───logger
│       │   ├───paginate
│       │   ├───swagger
│       │   ├───task
│       │   ├───toJSON
│       │   ├───utils
│       │   └───validate
│       └───routes
│           └───v1
└───frontend
    ├───public
    │   ├───assets
    │   └───fonts
    └───src
        ├───app
        │   ├───(dashboard)
        │   │   └───task
        │   └───store
        │       └───slices
        ├───components
        │   ├───Card
        │   └───Modal
        ├───hooks
        └───lib
            └───validationSchemas


```
## API Endpoints


### API Documentation
To view the list of available APIs and their specifications, run the server and go to http://localhost:3000/api/v1/docs in your browser. This documentation page is automatically generated using the swagger definitions written as comments in the route files.

### Task Routes

- **Create Task**: `POST /api/v1/task`  
  - Creates a new task with validated data.
  - **Body**: Requires task details according to the `createTask` validation schema.
  
- **Get Tasks**: `GET /api/v1/task`  
  - Retrieves a list of tasks with optional pagination.
  - **Query Parameters** (optional): pagination settings or filters based on the `getTasks` schema.
  
- **Swap Task Order**: `PATCH /api/v1/task/swap`  
  - Swaps the order of two tasks by their IDs.
  - **Body**: Requires task IDs as specified in the `swapTasks` validation schema.
  
- **Get Task by ID**: `GET /api/v1/task/:taskId`  
  - Retrieves details of a specific task by `taskId`.
  - **Params**: `taskId` is required and validated by the `getTask` schema.
  
- **Update Task by ID**: `PATCH /api/v1/task/:taskId`  
  - Updates task details by `taskId`.
  - **Params**: `taskId` is required.
  - **Body**: Fields to update as specified in the `updateTask` validation schema.
  
- **Delete Task by ID**: `DELETE /api/v1/task/:taskId`  
  - Deletes a specific task by `taskId`.
  - **Params**: `taskId` is required and validated by the `deleteTask` schema.

## Usage

### Backend

1. **Docker Commands**:
   - **Run Docker Container in Development Mode**:
     ```bash
     cd ./backend
     yarn docker:dev
     ```
   - **Run Docker Container in Production Mode**:
     ```bash
     cd ./backend
     yarn docker:prod
     ```

2. **Making Changes**:
   To compile TypeScript (.ts) files in watch mode, run:
   ```bash
   cd ./backend
   yarn dev
   ```

Once up and running, access the app in your browser. Use the drag-and-drop feature to reorganize tasks within columns. Create, edit, and delete tasks as needed, with the backend dynamically saving changes.

### Frontend

1. **Development**:
   To start the development server, use:
   ```bash
   cd ./frontend
   yarn dev
   ```

1. **Development**:
   To start the production server, execute:
   ```bash
   cd ./frontend
   yarn start
   ```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

## License
[MIT License](https://github.com/AliSat81/todo-app/blob/main/LICENSE)