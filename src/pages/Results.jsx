import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiAward, FiBarChart2, FiTrendingUp, FiUsers } from 'react-icons/fi';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import SelectField from '../components/SelectField';
import { getApiErrorMessage } from '../services/api';
import ElectionService from '../services/ElectionService';
import ResultService from '../services/ResultService';
import { sortResultsByVotes } from '../utils/search';

function Results() {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [results, setResults] = useState([]);
  const [loadingElections, setLoadingElections] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  const loadElections = useCallback(async () => {
    try {
      const { data } = await ElectionService.getAll();

      const electionList = Array.isArray(data) ? data : [];

      setElections(electionList);

      if (electionList.length > 0) {
        setSelectedElectionId(String(electionList[0].electionID));
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoadingElections(false);
    }
  }, []);

  const loadResults = useCallback(async (electionId) => {
    if (!electionId) return;

    setLoadingResults(true);

    try {
      const { data } = await ResultService.getByElectionId(electionId);

      setResults(
        sortResultsByVotes(
          Array.isArray(data) ? data : []
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    loadElections();
  }, [loadElections]);

  useEffect(() => {
    if (selectedElectionId) {
      loadResults(selectedElectionId);
    }
  }, [selectedElectionId, loadResults]);

  const electionOptions = elections.map((election) => ({
    value: String(election.electionID),
    label: election.electionName,
  }));

  const winner = results[0];

  const totalVotes = useMemo(
    () =>
      results.reduce(
        (sum, candidate) => sum + (candidate.totalVotes || 0),
        0
      ),
    [results]
  );

  const winnerPercentage =
    winner && totalVotes > 0
      ? ((winner.totalVotes / totalVotes) * 100).toFixed(1)
      : 0;

  if (loadingElections) {
    return (
      <div>
        <PageHeader
          title="Election Results"
          subtitle="View election outcomes and winning candidates."
        />

        <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white">
          <LoadingSpinner label="Loading elections..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Election Results"
        subtitle="View election outcomes and winning candidates."
      />

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="mb-6 max-w-md">
        <SelectField
          label="Select Election"
          options={electionOptions}
          value={selectedElectionId}
          onChange={(e) =>
            setSelectedElectionId(e.target.value)
          }
        />
      </div>

      {loadingResults ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white">
          <LoadingSpinner label="Loading results..." />
        </div>
      ) : (
        <>
          {/* Statistics */}

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">

            <div className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Total Votes
                  </p>
                  <h2 className="text-3xl font-bold text-primary">
                    {totalVotes}
                  </h2>
                </div>
                <FiBarChart2 size={30} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Candidates
                  </p>
                  <h2 className="text-3xl font-bold text-primary">
                    {results.length}
                  </h2>
                </div>
                <FiUsers size={30} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Winner Votes
                  </p>
                  <h2 className="text-3xl font-bold text-green-600">
                    {winner?.totalVotes || 0}
                  </h2>
                </div>
                <FiAward size={30} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Winning %
                  </p>
                  <h2 className="text-3xl font-bold text-green-600">
                    {winnerPercentage}%
                  </h2>
                </div>
                <FiTrendingUp size={30} />
              </div>
            </div>

          </div>

          {/* Winner Card */}

          {winner && (
            <div className="mb-8 rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 to-white p-8 shadow">

              <div className="flex items-center gap-6">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-white">
                  <FiAward size={40} />
                </div>

                <div>

                  <p className="font-semibold uppercase tracking-wider text-green-600">
                    Official Winner
                  </p>

                  <h2 className="text-4xl font-bold text-primary">
                    {winner.candidateName}
                  </h2>

                  <p className="mt-2 text-lg text-gray-600">
                    {winner.partyName}
                  </p>

                  <p className="font-semibold text-green-600">
                    {winner.totalVotes} Votes
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Ranking */}

          <div className="space-y-4">

            {results.map((candidate, index) => {

              const percentage =
                totalVotes > 0
                  ? (
                      (candidate.totalVotes /
                        totalVotes) *
                      100
                    ).toFixed(1)
                  : 0;

              return (
                <div
                  key={candidate.candidateName}
                  className={`rounded-2xl bg-white p-6 shadow ${
                    index === 0
                      ? 'border-2 border-green-300'
                      : 'border border-gray-200'
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                        Rank #{index + 1}
                      </div>

                      <h3 className="text-2xl font-bold text-primary">
                        {candidate.candidateName}
                      </h3>

                      <p className="text-gray-600">
                        {candidate.partyName}
                      </p>

                    </div>

                    <div className="text-right">

                      <h2 className="text-4xl font-bold text-primary">
                        {candidate.totalVotes}
                      </h2>

                      <p className="text-gray-500">
                        Votes
                      </p>

                    </div>

                  </div>

                  <div className="mt-5">

                    <div className="mb-2 flex justify-between text-sm">
                      <span>{percentage}%</span>
                      <span>
                        {candidate.totalVotes} votes
                      </span>
                    </div>

                    <div className="h-4 rounded-full bg-gray-200">

                      <div
                        className="h-4 rounded-full bg-green-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {results.length === 0 && (
            <Alert
              type="info"
              message="No results available for this election."
            />
          )}
        </>
      )}
    </div>
  );
}

export default Results;