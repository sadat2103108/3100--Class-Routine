# Routine Planner

Routine Planner is a web-based system designed for universities.
It allows authorities to create and manage class routines, while students and teachers can view personalized, filtered schedules.

## Features

- **Authorities**
  - Create and edit full routines
  - Assign courses, teachers, and rooms to time slots
  - Manage available teachers, rooms, and courses from the Settings page

- **Students**
  - View filtered routines for their own batch/section
  - Export routine as PDF

- **Teachers**
  - View their own teaching schedule with locations and times

- **General Features**
  - Click any routine cell to add a class
  - Choose from dropdowns for available course, teacher, and room
  - Ctrl + Drag & Drop → duplicate a class
  - Drag & Drop → move a class
  - Settings page → edit/update teacher, course, and room lists
  - Download button → export PDF copy of routine
  - Ctrl + S → save current routine
  - Auto-save after every 5 seconds

## Project Structure

Routine-Planner/
├── client/   # React frontend
│   ├── .env.example
│   └── ...
├── server/   # Node.js + Express backend
│   ├── .env.example
│   └── ...

Both `client` and `server` require their own `.env` file.

## Environment Setup

### Client (.env)
Copy `.env.example` inside the `client/` folder and rename it to `.env`.
Fill in the values as needed (example: backend API URL).

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
npm start
```

4. Open browser at: http://localhost:3000

## Usage Guide

- Click a cell → Add a class
- Select from dropdowns → Course, Teacher, Room
- Ctrl + Drag & Drop → Duplicate class
- Drag & Drop → Move class
- Settings page → Manage teachers, courses, and rooms
- Download → Export PDF of routine
- Ctrl + S → Save routine
- Auto-save → Every 5 seconds

## Future Integration

The project is designed to be integrated with the university’s official website:
- Authorities → full access to routine creation and updates
- Students → view only their own section’s routine
- Teachers → view only their assigned classes
