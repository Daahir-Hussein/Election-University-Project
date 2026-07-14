import { useCallback, useEffect, useState } from 'react';
import {
  FiAward,
  FiBarChart2,
  FiFlag,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';
import Alert from '../components/Alert';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { getApiErrorMessage } from '../services/api';
import DashboardService from '../services/DashboardService';

const defaultStats = {
  totalElections: 0,
  totalParties: 0,
  totalCandidates: 0,
  totalVoters: 0,
  totalVotes: 0,
};

function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await DashboardService.getStats();
      setStats({ ...defaultStats, ...data });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle="Overview of the national election system."
        />
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <LoadingSpinner label="Loading dashboard statistics..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of the national election system."
      />

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard
          title="Total Elections"
          value={stats.totalElections}
          icon={FiFlag}
          accent="primary"
        />
        <DashboardCard
          title="Total Parties"
          value={stats.totalParties}
          icon={FiAward}
          accent="accent"
        />
        <DashboardCard
          title="Total Candidates"
          value={stats.totalCandidates}
          icon={FiUserCheck}
          accent="success"
        />
        <DashboardCard
          title="Total Voters"
          value={stats.totalVoters}
          icon={FiUsers}
          accent="gray"
        />
        <DashboardCard
          title="Total Votes"
          value={stats.totalVotes}
          icon={FiBarChart2}
          accent="danger"
        />
      </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-primary">Quick Actions</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Manage elections, parties, and candidates</li>
              <li>Register voters and process votes securely</li>
              <li>View official results with winner highlighting</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-primary">Live Statistics</h3>
            <p className="mt-3 text-sm text-gray-600">
              All counts above are loaded in real time from{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
                GET /api/Dashboard
              </code>
              .
            </p>
          </div>
        </div>
    </div>
  );
}

export default Dashboard;
