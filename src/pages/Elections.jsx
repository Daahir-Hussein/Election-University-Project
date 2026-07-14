import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import Alert from '../components/Alert';
import Button from '../components/Button';
import ConfirmationDialog from '../components/ConfirmationDialog';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import SearchBox from '../components/SearchBox';
import SelectField from '../components/SelectField';
import Table from '../components/Table';
import usePagination from '../hooks/usePagination';
import { getApiErrorMessage } from '../services/api';
import ElectionService from '../services/ElectionService';
import { formatDate, toApiDate, toInputDate } from '../utils/format';
import { filterBySearch } from '../utils/search';
import {
  createEndDateRules,
  getTodayInputDate,
  requiredRule,
  startDateRules,
} from '../utils/validation';

const defaultValues = {
  electionName: '',
  startDate: '',
  endDate: '',
  status: 'Open',
};

const statusOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
  // { value: 'Upcoming', label: 'Upcoming' },
];

function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({ defaultValues, mode: 'onChange' });

  const startDate = watch('startDate');
  const today = useMemo(() => getTodayInputDate(), []);

  const loadElections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await ElectionService.getAll();
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

  useEffect(() => {
    if (isModalOpen) {
      reset(
        editingElection
          ? {
              electionName: editingElection.electionName || '',
              startDate: toInputDate(editingElection.startDate),
              endDate: toInputDate(editingElection.endDate),
              status: editingElection.status || 'Open',
            }
          : defaultValues
      );
      void trigger(['electionName', 'startDate', 'endDate', 'status']);
    }
  }, [isModalOpen, editingElection, reset, trigger]);

  useEffect(() => {
    if (startDate) {
      void trigger('endDate');
    }
  }, [startDate, trigger]);

  const filteredElections = useMemo(
    () =>
      filterBySearch(elections, searchTerm, [
        'electionName',
        'status',
      ]),
    [elections, searchTerm]
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
  } = usePagination(filteredElections, 5);

  const openCreateModal = () => {
    setEditingElection(null);
    setIsModalOpen(true);
  };

  const openEditModal = (election) => {
    setEditingElection(election);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingElection(null);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      electionID: editingElection?.electionID ?? 0,
      electionName: formData.electionName.trim(),
      startDate: toApiDate(formData.startDate),
      endDate: toApiDate(formData.endDate),
      status: formData.status,
    };

    try {
      if (editingElection) {
        await ElectionService.update(editingElection.electionID, payload);
        setSuccess('Election updated successfully.');
      } else {
        await ElectionService.create(payload);
        setSuccess('Election created successfully.');
      }

      closeModal();
      await loadElections();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    setError(null);

    try {
      await ElectionService.delete(deleteTarget.electionID);
      setSuccess('Election deleted successfully.');
      setDeleteTarget(null);
      await loadElections();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'electionID', header: 'ID' },
    { key: 'electionName', header: 'Election Name' },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (row) => formatDate(row.startDate),
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (row) => formatDate(row.endDate),
    },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={FiEdit2}
            onClick={() => openEditModal(row)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={FiTrash2}
            onClick={() => setDeleteTarget(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Election Management"
        subtitle="Create, search, update, and delete elections."
      />

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search elections by name or status..."
        />
        <Button icon={FiPlus} onClick={openCreateModal}>
          Add Election
        </Button>
      </div>

      <Table
        columns={columns}
        data={paginatedItems}
        isLoading={loading}
        rowKey="electionID"
        emptyMessage="No elections found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingElection ? 'Edit Election' : 'Add Election'}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            label="Election Name"
            placeholder="Enter election name"
            error={errors.electionName?.message}
            {...register('electionName', requiredRule('Election name'))}
          />

          <InputField
            label="Start Date"
            type="date"
            min={today}
            error={errors.startDate?.message}
            {...register('startDate', startDateRules)}
          />

          <InputField
            label="End Date"
            type="date"
            min={startDate || today}
            error={errors.endDate?.message}
            {...register('endDate', createEndDateRules(startDate))}
          />

          <SelectField
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status', requiredRule('Status'))}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting} disabled={!isValid}>
              {editingElection ? 'Update Election' : 'Create Election'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Election"
        message={`Are you sure you want to delete "${deleteTarget?.electionName}"?`}
        confirmLabel="Delete"
        isLoading={submitting}
      />
    </div>
  );
}

export default Elections;
