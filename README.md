# 📌 Task Management Subsystem - Productivity Web App

## Overview
The **Task Management Subsystem** is part of the Student Productivity Web Application.  
It provides a **Kanban-style dashboard** for managing academic tasks with intelligent prioritization based on urgency, importance, effort, and feasibility.  

Students can:
- Add, edit, and delete tasks
- Track progress visually across **ToDo → In Progress → Done**
- Use a calendar to control daily task views
- Benefit from smart workload balancing and Eisenhower Matrix recommendations

---

## ✨ Features
- **Kanban Board** with drag-and-drop task workflow
- **Priority Calculation Algorithm** (importance, urgency, effort, deadline)
- **Eisenhower Matrix Visualization** (Do Now, Schedule, Delegate, Eliminate)
- **Smart Task Creation** with guided questions
- **Calendar Integration** for date-based task filtering
- **Real-time UI Updates** with global state management
- **Light/Dark Theme Support**

---

## 🛠️ Technology Stack

### Frontend
- **React** (CRA)
- **Material UI (@mui/material, @mui/icons-material, @mui/x-date-pickers)**
- **Zustand** (global state management)
- **React Query (@tanstack/react-query, react-query)** (data fetching)
- **React Router DOM** (navigation)
- **Axios** (API calls)
- **Day.js** (date handling)
- **Emotion** (styling)
- **Testing Libraries**:  
  - @testing-library/react  
  - @testing-library/jest-dom  
  - @testing-library/user-event  
  - @testing-library/dom  
- **Web Vitals** (performance monitoring)
- **React Scripts** (build and dev server)

### Backend
- **Spring Boot**
- **SQL Database**
- REST APIs for task CRUD operations
- Authentication & Authorization via `SecurityConfig`
- CORS configuration for frontend-backend integration

---


---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/rehanbandara/Productivity_web_APP_Group_15.git
cd Productivity_web_APP_Group_15/frontend

### 2. Install Dependencies
npm install react react-dom @mui/material @mui/icons-material @mui/x-date-pickers \
@emotion/react @emotion/styled react-router-dom @tanstack/react-query react-query \
zustand axios dayjs web-vitals @testing-library/react @testing-library/jest-dom \
@testing-library/user-event @testing-library/dom react-scripts

### 3. Run the Frontend
npm start

### 4. Run the Backend
cd ../backend
mvn spring-boot:run








