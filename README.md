# Task Management API Documentation

## Description

This API facilitates CRUD (Create, Read, Update, Delete) operations on tasks. Each task includes essential attributes such as a title, description, due date, and status  (pending, In Progress, completed).

### User Authentication

User authentication in this Task Management API is implemented using JSON Web Tokens (JWT). The process involves user token-based verification for subsequent API requests.

when a user/admin logs in a token is generated with jwt.sign() method which contains the username and password and a secret key, i have stored the secret key in environment variables so when a user tries to fetch the taks or update or delete or add new taks the token is verified in backend with same username, password and secret key if token is valid the particular operations are executed else returns unauthorized.

The Admin details are already stored in database so when a admin logs in theirs details are compared with the values in database and if found the token is generated and all the taks irrespective of users will be displayed.

### Task Operations

- Establish an API endpoint for adding new tasks.
- Create an API endpoint to retrieve a list of tasks for a specific user (Admin users can access all tasks).
- Implement features to update task details and mark tasks as completed or delete them.

### Frontend

I have used React.js as frontend development using CRA template.

### Database

Database used is mongodb Atlas.
backend is made using node.js express.

### Available endpoints

- User Signup :
    api endpoint      : '/api/usersignup'
    details           : when a user signups the details are stored in database.
    expected request  : the user details such as name, email, password etc.
    expected response : successful signup with status codes or error message if any error occurs with status codes.

- User Login :
    api endpoint      : '/api/userlogin'
    details           : when a user logs in, the user is authorized and if found the user is able to perform task 
                        operations.
    expected request  : user details such as username and password.
    expected response : if authorized successful login message with relevant status code else error message showcasing 
                        unauthorized.

- Admin Login :
    api endpoint      : '/api/adminlogin'
    details           : when admin logs in, the admin is authorized and if found the admin can view all the tasks 
                        irrespective of users. 
                        operations.
    expected request  : admin details such as username and password.
    expected response : if authorized successful login message with relevant status code else error message showcasing 
                        unauthorized.

- Fetch Tasks :
    api endpoint      : '/api/taskdetails/:userId'
    details           : the authorized users tasks will be displayed as soon as they log in, with a userId for displaying 
                        the tasks which belongs particular user only. But the Admin can access all tasks irrespective of user.
    expected request  : respective userId of user.
    expected response : list of all tasks available for user with status code and error message if any error occur.

- Add Tasks :
    api endpoint      : '/api/tasks/:userId'
    details           : the authorized users can add new tasks to their account with a userId for adding tasks to the 
                        particular user only.
    expected request  : task list such as title, description, due date and status.
    expected response : successful task added message with status codes or error message if any error occurs.

- Updating Tasks :
    api endpoint      : '/api/updatetasks/:userId'
    details           : the authorized users can add update any tasks with a userId for updating tasks to the 
                        particular user only.
    expected request  : task list such as title, description, due date and status.
    expected response : successful update task message with status codes or error message if any error occurs.

- Deleting Tasks :
    api endpoint      : '/api/deletetasks'
    details           : the authorized users can delete any tasks with a userId for deleting tasks to the 
                        particular user only.
    expected request  : task id which is required to delete.
    expected response : successful delete task message with status codes or error message if any error occurs.

### Prerequisites

- requires node.js installed.

### Installation

1. Clone the repository: `git clone https://github.com/your-username/task-management-api.git`
2. Navigate to the project directory: `cd task-management-api`
3. Install dependencies: `install neccessary dependencies using [npm install] command`
4. Create a .env file : `add the backend connection details mentioned in server.js file in .env file.`

### Usage

1. Start the API: `use command [npm run demon]`
2. Start Frontend: `use command [npm start]`