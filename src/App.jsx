import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import About from './pages/About';
import Candidates from './pages/Candidates';
import Dashboard from './pages/Dashboard';
import Elections from './pages/Elections';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Parties from './pages/Parties';
import Results from './pages/Results';
import Vote from './pages/Vote';
import Voters from './pages/Voters';
import VoterCandidates from './pages/VoterCandidates';
import VoterElections from './pages/VoterElections';
import VoterLogin from './pages/VoterLogin';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>

      <Route path="/voter-login" element={<AuthLayout />}>
        <Route index element={<VoterLogin />} />
      </Route>

      <Route path="/voter-elections" element={<VoterElections />} />
      <Route path="/voter-candidates/:electionId" element={<VoterCandidates />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="elections" element={<Elections />} />
        <Route path="parties" element={<Parties />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="voters" element={<Voters />} />
        <Route path="vote" element={<Vote />} />
        <Route path="results" element={<Results />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
