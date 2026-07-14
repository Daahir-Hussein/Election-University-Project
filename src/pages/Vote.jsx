import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import SearchBox from '../components/SearchBox';
import SelectField from '../components/SelectField';
import Table from '../components/Table';
import usePagination from '../hooks/usePagination';
import { getApiErrorMessage } from '../services/api';
import VoteService from '../services/VoteService';
import { formatDate } from '../utils/format';
import { filterBySearch } from '../utils/search';

function Vote() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');

  const loadVotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await VoteService.getAll();
      setVotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVotes();
  }, [loadVotes]);

  const partyOptions = [
    { value: '', label: 'All Parties' },
    ...Array.from(
      new Set(votes.map((vote) => vote.partyName))
    )
      .filter(Boolean)
      .map((party) => ({
        value: party,
        label: party,
      })),
  ];

  const filteredVotes = useMemo(() => {
    let filtered = filterBySearch(votes, searchTerm, [
      'electionName',
      'candidateName',
      'partyName',
      'voterName',
    ]);

    if (selectedParty) {
      filtered = filtered.filter(
        (vote) => vote.partyName === selectedParty
      );
    }

    return filtered;
  }, [votes, searchTerm, selectedParty]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
  } = usePagination(filteredVotes, 10);

  const columns = [
    {
      key: 'voteID',
      header: 'Vote ID',
    },
    {
      key: 'electionName',
      header: 'Election',
    },
    {
      key: 'candidateName',
      header: 'Candidate',
    },
    {
      key: 'partyName',
      header: 'Party',
      render: (row) => (
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {row.partyName}
        </span>
      ),
    },
    {
      key: 'voterName',
      header: 'Voter',
    },
    {
      key: 'voteDate',
      header: 'Vote Date',
      render: (row) => formatDate(row.voteDate),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Vote Records"
          subtitle="View all submitted votes."
        />

        <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <LoadingSpinner label="Loading vote records..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Vote Records"
        subtitle="Monitor all submitted votes across elections."
      />

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Votes</p>
          <h3 className="mt-2 text-3xl font-bold text-primary">
            {votes.length}
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Filtered Records</p>
          <h3 className="mt-2 text-3xl font-bold text-success">
            {filteredVotes.length}
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Political Parties</p>
          <h3 className="mt-2 text-3xl font-bold text-warning">
            {partyOptions.length - 1}
          </h3>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search election, candidate, party or voter..."
        />

        <SelectField
          // label="Filter by Party"
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
          options={partyOptions}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table
          columns={columns}
          data={paginatedItems}
          rowKey="voteID"
          emptyMessage="No vote records found."
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Vote;