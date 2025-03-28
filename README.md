# Khel-Mitra

Khel-Mitra is a real-time multiplayer gaming platform where users can play classic games like Checkers and Tic-Tac-Toe. The platform supports live gameplay, matchmaking, and player stats tracking.

## Features

- **Real-time Multiplayer Gaming**: Play against friends or random players.
- **Available Games**:
    - Checkers
    - Tic-Tac-Toe
- **Live Matchmaking**: Automatically pair players in real-time.
- **Authentication**: Sign in as a register an account.
- **Leaderboard & Stats**: Track wins, losses, and rankings.

## Tech Stack

- **Monorepo Setup**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Apps**:

    - **Web**: [Next.js](https://nextjs.org/), UI with [shadcn](https://ui.shadcn.com/)
    - **API**: [Nest.js](https://nestjs.com/) (Handles authentication, game logic, leaderboard, and matchmaking)
    - **Socket**: [Nest.js](https://nestjs.com/) (Manages real-time player interactions and game events)

- **Packages**:
    - **DB**: [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/)
    - **Shared**: Common utilities, game logic, and types

## Architecture Overview

Khel-Mitra follows a modular monorepo architecture using **Turborepo**, ensuring efficient development and code sharing.

- **Web App (Next.js)**: Provides the frontend UI for players.
- **API Service (Nest.js)**: Handles authentication, matchmaking, and database interactions.
- **Socket Service (Nest.js & Socket.io)**: Ensures real-time communication between players.
- **Database (PostgreSQL & Prisma)**: Stores user data, game history, and leaderboards.
- **Shared Package**: Contains common utilities, game logic, and TypeScript types shared across all services.

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (Package Manager)
- [PostgreSQL](https://www.postgresql.org/)

### Steps to Run Locally

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/khel-mitra.git
    cd khel-mitra
    ```

2. Install dependencies using pnpm:

    ```sh
    pnpm install
    ```

3. Set up environment variables:
   change file name `.env.example` to `.env`
4. Start the development servers:

    ```sh
    pnpm run dev
    ```

This will start all apps and services in parallel.

## How to Play

1. Register an account or play as a guest.
2. Choose a game from the available options.
3. Match with an opponent through the matchmaking system.
4. Play the game in real-time with live updates.

### Happy coding!

#### Contact

Email Address - subhop.me@gmail.com
