# Project Specification

Our goal is to create an engaging, gamified learning platform where users can track their progress, compete with friends, and improve their knowledge through community-driven study materials. The platform will allow users to create accounts, save courses, share study questions, and get feedback on their weak points. Additional AI-powered features for question generation may be explored if time permits.

## Features
- Gamify learning coursework
- Each user should be able to create an account and save his/hers courses.
- Community-driven study site where users can upload and share study questions.
- Add friends, have leadersboards, compete with eachother
- Get feedback and practice your weakpoints.

## Extra features (if time)
- Add a 1v1 or (1v1v1... limited to 10 users) gamemode, where users compete against each other in a fast-paced. Quickest to anser x amount of questions correctly wins.
- Use AI models to classify/generate questions for different subjects, e.g from pdfs.
- Add resources tab for each courses that points to useful course resources.

# Technical Specification

## Frontend
- Next.js with TypeScript for a modular, scalable frontend. 
- Tailwind CSS will provide a clean, responsive UI.
- The frontend will communicate with the backend via REST APIs
- Node.js may be used for some minor additional services.

## Backend
- The backend will be built with Django and Django REST Framework, handling user authentication, data storage, and API endpoints.
- The database will be SQL-based since the application involves user accounts, courses, study questions, leaderboards, and progress tracking—all of which fit well into a structured relational model with clear relationships. 
- If a 1v1 gamemode is created django channels will also be used, to connect players and update scores in real time.
- AI-based question generation (if implemented) will run as a separate background service, probably based on the smallest deepseek model.
