import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';
import { Navigate, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { getApiErrorMessage } from '../services/api';
import VoterPortalService from '../services/VoterPortalService';
import { formatDate } from '../utils/format';

const VOTER_STORAGE_KEY = 'voter';

function getStoredVoter() {
  try {
    const raw = localStorage.getItem(VOTER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function VoterElections() {
  const navigate = useNavigate();
  const [voter] = useState(() => getStoredVoter());
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadElections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await VoterPortalService.getElections();
      setElections(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadElections();
  }, [loadElections]);

  const welcomeSubtitle = useMemo(() => {
    if (voter?.fullName) {
      return `Welcome, ${voter.fullName}. Select an election to cast your vote.`;
    }

    return 'Select an election to cast your vote.';
  }, [voter]);

  if (!voter) {
    return <Navigate to="/voter-login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Available Elections" subtitle={welcomeSubtitle} />

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <LoadingSpinner label="Loading elections..." />
          </div>
        ) : elections.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiCalendar size={24} />
            </div>
            <h2 className="text-lg font-semibold text-primary">No elections available</h2>
            <p className="mt-2 text-sm text-gray-600">
              There are no active elections at this time. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {elections.map((election) => (
              <div
                key={election.electionID}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-primary">
                  {election.electionName}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="shrink-0 text-primary" size={16} />
                    <span>
                      <span className="font-medium text-gray-700">Start:</span>{' '}
                      {formatDate(election.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="shrink-0 text-primary" size={16} />
                    <span>
                      <span className="font-medium text-gray-700">End:</span>{' '}
                      {formatDate(election.endDate)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full"
                    icon={FiArrowRight}
                    onClick={() =>
                      navigate(`/voter-candidates/${election.electionID}`)
                    }
                  >
                    Select Election
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoterElections;
