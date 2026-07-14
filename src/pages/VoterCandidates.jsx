import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiUser } from 'react-icons/fi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { getApiErrorMessage } from '../services/api';
import VoterPortalService from '../services/VoterPortalService';

const VOTER_STORAGE_KEY = 'voter';

function getStoredVoter() {
  try {
    const raw = localStorage.getItem(VOTER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function VoterCandidates() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [voter] = useState(() => getStoredVoter());
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const parsedElectionId = Number(electionId);

  const loadCandidates = useCallback(async () => {
    if (!Number.isFinite(parsedElectionId) || parsedElectionId <= 0) {
      setError('Invalid election selected.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await VoterPortalService.getCandidates(parsedElectionId);
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [parsedElectionId]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const pageSubtitle = useMemo(() => {
    if (voter?.fullName) {
      return `Voting as ${voter.fullName}. Select one candidate and submit your vote.`;
    }

    return 'Select one candidate and submit your vote.';
  }, [voter]);

  const handleVote = async () => {
    if (!selectedCandidateId || hasVoted || !voter?.voterID) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      voterID: voter.voterID,
      electionID: parsedElectionId,
      candidateID: selectedCandidateId,
    };

    try {
      const { data } = await VoterPortalService.vote(payload);
      setSuccess(typeof data === 'string' ? data : 'Vote submitted successfully.');
      setSelectedCandidateId(null);
      setHasVoted(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!voter) {
    return <Navigate to="/voter-login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            icon={FiArrowLeft}
            onClick={() => navigate('/voter-elections')}
          >
            Back to Elections
          </Button>
        </div>

        <PageHeader title="Select a Candidate" subtitle={pageSubtitle} />

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <LoadingSpinner label="Loading candidates..." />
          </div>
        ) : candidates.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiUser size={24} />
            </div>
            <h2 className="text-lg font-semibold text-primary">No candidates found</h2>
            <p className="mt-2 text-sm text-gray-600">
              There are no candidates registered for this election.
            </p>
          </div>
        ) : (
        <div className="space-y-4">
            <div className="space-y-3">
              {candidates.map((candidate) => {
                const isSelected =
                  selectedCandidateId === candidate.candidateID;

                return (
                  <label
                    key={candidate.candidateID}
                    className={`block cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-gray-200'
                    } ${hasVoted ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="candidate"
                        value={candidate.candidateID}
                        checked={isSelected}
                        disabled={hasVoted || submitting}
                        onChange={() =>
                          setSelectedCandidateId(candidate.candidateID)
                        }
                        className="mt-2 h-4 w-4 shrink-0 accent-primary"
                      />

                      <div className="flex-1">
                        {/* Candidate Photo */}
                        {candidate.photo && (
                          <img
                            src={`https://localhost:7202/uploads/candidates/${candidate.photo}`}
                            alt={candidate.candidateName}
                            className="mb-4 h-28 w-28 rounded-full border object-cover"
                          />
                        )}

                        {/* Candidate Name */}
                        <h3 className="text-lg font-bold text-primary">
                          {candidate.candidateName}
                        </h3>

                        {/* Biography */}
                        {candidate.biography && (
                          <p className="mt-2 text-sm text-gray-600">
                            {candidate.biography}
                          </p>
                        )}

                        {/* Party Information */}
                        <div className="mt-4 flex items-center gap-3">
                          {candidate.partyLogo && (
                            <img
                              src={`https://localhost:7202/uploads/parties/${candidate.partyLogo}`}
                              alt={candidate.partyName}
                              className="h-12 w-12 rounded border object-contain"
                            />
                          )}

                          <div>
                            <p className="text-xs text-gray-500">
                              Political Party
                            </p>
                            <p className="font-semibold">
                              {candidate.partyName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <Button
                  icon={FiCheckCircle}
                  className="w-full sm:w-auto"
                  disabled={!selectedCandidateId || hasVoted}
                  isLoading={submitting}
                  onClick={handleVote}
                >
                  {hasVoted ? 'Vote Submitted' : 'Submit Vote'}
                </Button>

                {hasVoted && (
                  <p className="mt-3 text-sm text-gray-600">
                    Your vote has been recorded. You cannot vote again in this election.
                  </p>
                )}
              </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default VoterCandidates;
