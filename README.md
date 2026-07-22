# Election Management System — Frontend

React frontend for the **National Election Management System** university final assessment project.

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 | ASP.NET Core Web API |
| Vite | SQL Server |
| React Router DOM | ADO.NET |
| Axios | Swagger |
| Tailwind CSS | |
| React Hook Form | |
| React Icons | |
| Context API | |

## Prerequisites

- Node.js 18+
- ASP.NET Core Web API running at `https://localhost:7202`

## Setup

```bash
cd election-frontend
npm install
cp .env
npm run dev
```

Ensure your backend API is running before using the app.

## Login Credentials

| Username | Password |
|----------|----------|
| `admin` | `admin123` |

## Pages

| Route | Page | Features |
|-------|------|----------|
| `/login` | Login | Auth with React Hook Form validation |
| `/` | Dashboard | Live stats from API |
| `/elections` | Elections | CRUD + Search + Pagination |
| `/parties` | Political Parties | CRUD + Search + Pagination |
| `/candidates` | Candidates | CRUD + Search + Pagination |
| `/voters` | Voters | CRUD + Search + Email/Phone/ID validation |
| `/vote` | Cast Vote | Dropdowns + Full validation |
| `/results` | Election Results | Winner first, sorted by votes |
| `/about` | About | Project documentation |
| `*` | 404 | Not found page |

## API Services

All data comes from the ASP.NET Core Web API:

- `ElectionService` — `/api/Elections`
- `PartyService` — `/api/PoliticalParties`
- `CandidateService` — `/api/Candidates`
- `VoterService` — `/api/Voters`
- `VoteService` — `/api/Votes`
- `DashboardService` — `/api/Dashboard`
- `ResultService` — `/api/Results/{electionId}`

## Environment

Development uses Vite proxy to avoid CORS/SSL issues:

```
VITE_API_BASE_URL=/api
```

For production builds without proxy:

```
VITE_API_BASE_URL=https://localhost:7202/api
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── assets/
├── components/     # 15 reusable components
├── pages/          # 10 pages
├── services/       # 7 API service files
├── context/        # AuthContext
├── hooks/          # useApi, usePagination
├── layouts/        # MainLayout, AuthLayout
├── utils/          # format, search, validation
├── App.jsx
└── main.jsx
```

## Assessment Checklist

- [x] React Router with 10 pages
- [x] 10+ reusable components
- [x] Context API for authentication
- [x] Axios for all API communication
- [x] React Hook Form validation
- [x] Search on Election, Party, Candidate, Voter pages
- [x] Responsive layout (desktop, tablet, mobile)
- [x] CRUD connected to ASP.NET Core Web API
- [x] Dashboard with stat cards
- [x] Voting with validation rules
- [x] Results with winner displayed first
