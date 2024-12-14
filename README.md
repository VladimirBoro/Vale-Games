# Vale Games

**Vale Games** is a multi-game web platform built with React, Spring Boot, and PostgreSQL, where users can enjoy a variety of games, including classic games like Snake, Frogger, Minesweeper, Cardmatch, FlappyBird, and Doodle Jump. The platform supports features like leaderboards, Google OAuth2 authentication, and user profiles with custom avatars.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Games](#games)
- [Tech Stack](#tech-stack)
- [Usage](#usage)

## Demo
https://valegames.online

## Features
- **Multiple Games**: Play a variety of games, each with unique mechanics.
- **Google OAuth2 Authentication**: Log in with Google and track your progress.
- **Leaderboards**: Compete with other players for high scores or best times, depending on the game.
- **Custom Profiles**: Set a custom username and upload a profile picture.

## Installation
To set up Vale Games locally, follow these steps:

### Prerequisites
- **Node.js** (v18+)
- **Java 21** (for Spring Boot backend)
- **PostgreSQL** (v12+)
- **Docker Desktop**

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/valegames.git
2. **Backend Setup**:
   - Create a new PostgreSQL database and name it vale_games_db.
   - Navigate to the backend directory:
     ```bash
     cd path_to/spring
     ```
   - Create and set up your `.env` file in the top level of the spring directory.
     Update the `.env` file with your PostgreSQL credentials and Google OAuth2 settings.

   - Run the dev version Spring Boot application by hitting run from the main file Application.java.
     - Be sure that Docker Desktop is running before trying to start up the backend.

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd path_to/vale-games
     ```
   - Install the necessary dependencies and start the React development server:
     ```bash
     npm install
     npm start
     ```
## Tech Stack
- **Frontend**: React, HTML5 Canvas (for rendering games)
- **Backend**: Spring Boot (Java), Spring Session, Spring Security (OAuth2)
- **Database**: PostgreSQL
- **Authentication**: Google OAuth2
- **Session Management**: Spring Session using Redis
- **Deployment**: Docker
