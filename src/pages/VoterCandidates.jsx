import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiUser,
} from 'react-icons/fi';
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
      const { data } =
        await VoterPortalService.getCandidates(parsedElectionId);

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
    if (
      !selectedCandidateId ||
      hasVoted ||
      submitting ||
      !voter?.voterID
    ) {
      return;
    }

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

      setSuccess(
        typeof data === 'string'
          ? data
          : 'Vote submitted successfully.',
      );

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
      <div className="mx-auto max-w-5xl">
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

        <PageHeader
          title="Select a Candidate"
          subtitle={pageSubtitle}
        />

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
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

            <h2 className="text-lg font-semibold text-primary">
              No candidates found
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              There are no candidates registered for this election.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Professional candidate cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {candidates.map((candidate, index) => {
                const isSelected =
                  selectedCandidateId === candidate.candidateID;

                return (
                  <label
                    key={candidate.candidateID}
                    className={`group relative block overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                      hasVoted || submitting
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg'
                    } ${
                      isSelected
                        ? 'border-primary shadow-md ring-2 ring-primary/15'
                        : 'border-gray-200 shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate.candidateID}
                      checked={isSelected}
                      disabled={hasVoted || submitting}
                      onChange={() =>
                        setSelectedCandidateId(candidate.candidateID)
                      }
                      className="sr-only"
                    />

                    <div
                      className={`absolute inset-y-0 left-0 w-1 transition-colors ${
                        isSelected ? 'bg-primary' : 'bg-transparent'
                      }`}
                    />

                    <div className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          Candidate {index + 1}
                        </span>

                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 bg-white text-transparent group-hover:border-primary/50'
                          }`}
                        >
                          <FiCheck size={15} strokeWidth={3} />
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          {candidate.photo ? (
                            <img
                              src={`https://localhost:7202/uploads/candidates/${candidate.photo}`}
                              alt={candidate.candidateName}
                              className="h-20 w-20 rounded-xl border border-gray-200 bg-gray-100 object-cover shadow-sm"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <FiUser size={28} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold text-gray-900">
                            {candidate.candidateName}
                          </h3>

                          <div className="mt-2 flex items-center gap-2">
                            {candidate.partyLogo ? (
                              <img
                                src={`https://localhost:7202/uploads/parties/${candidate.partyLogo}`}
                                alt={candidate.partyName || 'Party logo'}
                                className="h-8 w-8 shrink-0 rounded-lg border border-gray-200 bg-white object-contain p-1"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                <FiUser size={14} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                Political Party
                              </p>

                              <p className="truncate text-xs font-semibold text-gray-700">
                                {candidate.partyName || 'Independent'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {candidate.biography && (
                        <div className="mt-4 border-t border-gray-100 pt-3">
                          <p className="line-clamp-3 text-xs leading-5 text-gray-600">
                            {candidate.biography}
                          </p>
                        </div>
                      )}

                      <div
                        className={`mt-4 flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-gray-50 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
                        }`}
                      >
                        {isSelected
                          ? 'Candidate Selected'
                          : 'Select Candidate'}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Submit vote section */}
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
                  Your vote has been recorded. You cannot vote again in this
                  election.
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