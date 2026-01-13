# fitgram

Technology Used for building Fitgram is MERN Stack

Overview of Website is given below :

Frontend (React.js)

The frontend is built using React.js and Redux Toolkit for state
management. It provides the user interface and handles user
interactions like registration, login, creating posts, liking posts, and
commenting.

Frontend Highlights :

1. State Management with Redux Toolkit:
 
 - Redux Toolkit simplifies managing the app's state.
 - The state for user authentication, profile data, and posts is managed centrally in the Redux store.

2. Authentication:

 - JWT is used for authentication, with tokens stored in HTTP-only cookies for added security.
 - The app checks if the user is authenticated before displaying protected routes.

3. Features:

 - User Actions: Users can register, log in, and log out.
 - Post Actions: Users can create posts with image uploads, view posts, like posts, and comment on them.
 - Profile Management: Users can update their profile picture and view their posts.
 
4. API Integration:

 - APIs are called using fetch or Axios in frontend components.
 - Example:
     Fetching all posts: GET /api/posts
     Liking a post: PUT /api/posts/:id/like

Backend (Node.js with Express)

The backend is built using Node.js and Express.js, handling all API
endpoints, business logic, and database interactions.

Middleware and Tools Used:

1. JWT:

 - Used for user authentication.
 - Tokens are stored in HTTP-only cookies to reduce security risks.
 - Middleware verifies JWT and attaches the authenticated user's details.

2. Multer:

 - Used for handling file uploads.
 - Uploaded files are saved to the server, and their paths are stored in the database.

3. Express Router:

 - Routes are organized into modules for maintainability.

4. Database Interactions (MongoDB via Mongoose):

 - User details, posts, comments, and likes are stored in MongoDB.

 Backend Routes :

    Authentication (/api/auth)
        - POST /register: Registers a new user.
        - POST /login: Authenticates the user and issues a JWT.
        - POST /logout: Clears the cookie, logging the user out.

    Posts (/api/posts)
        - POST /: Creates a new post.
        - GET /: Retrieves all posts for the feed.
        - PUT /:id/like: Likes or unlikes a specific post.
        - POST /:id/comment: Adds a comment to a specific post.

How the Frontend and Backend Work Together

 Registration
    - Frontend sends a POST request to /api/auth/register.
    - Backend validates the data and creates a new user.

 Login
    - Frontend sends a POST request to /api/auth/login.
    - Backend verifies credentials and sets an HTTP-only cookie.

 Create Post
    - Frontend sends a POST request to /api/posts with text content and/or an image.

 Like a Post
    - Frontend sends a PUT request to /api/posts/:id/like.

 Comment on a Post
    - Frontend sends a POST request to /api/posts/:id/comment



