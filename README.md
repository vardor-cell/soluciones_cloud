# soluciones_cloud
Repositorio donde van a estar todos los proyectos realizados durante el curso de Desarrollo de soluciones cloud

## API Endpoints

### Home
- **GET /**: Returns a welcome message.

### User Management
- **GET /list_users**: Retrieves a list of all users. Requires a valid token.
- **POST /usuario**: Creates a new user.

### Authentication
- **POST /login**: Authenticates a user and returns a token.

### Task Management
- **GET /usuarios/<id>/tareas**: Retrieves all tasks for a specific user. Requires a valid token.
- **POST /tareas**: Creates a new task. Requires a valid token.
- **PUT /tareas/<id>**: Updates the state and text of a task. Requires a valid token.
- **DELETE /tareas/<id>**: Deletes a task. Requires a valid token.
- **GET /tareas/<id>**: Retrieves a specific task. Requires a valid token.

### Category Management
- **POST /categorias**: Creates a new category. Requires a valid token.
- **GET /categorias**: Retrieves all categories. Requires a valid token.
- **DELETE /categorias/<id>**: Deletes a category. Requires a valid token.
  
## Running the Project

To run the project, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your machine.
2. Navigate to the project directory (project0).
3. Run the following command to start the services:

```sh
docker-compose up



