# Routine Planner

Routine Planner is a web-based system designed for universities.
It allows authorities to create and manage class routines, while students and teachers can view personalized, filtered schedules.







## Environment Setup

Both `client` and `server` require their own `.env` file.

### Client (.env)
Copy `.env.example` inside the `client/` folder and rename it to `.env`.

### Server (.env)
Copy `.env.example` inside the `server/` folder and rename it to `.env`.
Set up MongoDB connection:

```
MONGODB_URL=your_mongodb_connection_string
```

To get the connection string from MongoDB Atlas:
1. Create an account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Get your connection string (e.g. `mongodb+srv://<username>:<password>@cluster.mongodb.net/routineplanner`)
4. Replace `<username>` and `<password>` with your credentials
5. Paste it into the `.env` file

## Running the App

1. Install dependencies:
```
cd client && npm install
cd ../server && npm install
```

2. Start backend:
```
cd server
npm run dev
```

3. Start frontend:
```
cd client
npm run dev
```

4. Open browser at: http://localhost:5173


## General Features
  - Click any routine cell to add a class
  - Choose from dropdowns for available course, teacher, and room
  - Ctrl + Drag & Drop → duplicate a class
  - Drag & Drop → move a class
  - Settings page → edit/update teacher, course, and room lists
  - Download button → export PDF copy of routine
  - Ctrl + S → save current routine
  - Auto-save after every 5 seconds

