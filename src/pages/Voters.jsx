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
import VoterService from '../services/VoterService';
import { formatDate, toApiDate, toInputDate } from '../utils/format';
import { filterBySearch } from '../utils/search';
import { nationalIdRules, phoneRules, requiredRule } from '../utils/validation';

const defaultValues = {
  nationalID: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  phone: '',
  address: '',
};

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

function Voters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoter, setEditingVoter] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const loadVoters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await VoterService.getAll();
      setVoters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVoters();
  }, [loadVoters]);

  useEffect(() => {
    if (isModalOpen) {
      reset(
        editingVoter
          ? {
              nationalID: editingVoter.nationalID || '',
              fullName: editingVoter.fullName || '',
              gender: editingVoter.gender || '',
              dateOfBirth: toInputDate(editingVoter.dateOfBirth),
              phone: editingVoter.phone || '',
              address: editingVoter.address || '',
              
            }
          : defaultValues
      );
    }
  }, [isModalOpen, editingVoter, reset]);

  const filteredVoters = useMemo(
    () =>
      filterBySearch(voters, searchTerm, [
        'nationalID',
        'fullName',
        'address',
        'phone',
        'gender',
      ]),
    [voters, searchTerm]
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
  } = usePagination(filteredVoters, 5);

  const openCreateModal = () => {
    setEditingVoter(null);
    setIsModalOpen(true);
  };

  const openEditModal = (voter) => {
    setEditingVoter(voter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVoter(null);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      voterID: editingVoter?.voterID ?? 0,
      nationalID: formData.nationalID.trim(),
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      dateOfBirth: toApiDate(formData.dateOfBirth),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    };

    try {
      if (editingVoter) {
        await VoterService.update(editingVoter.voterID, payload);
        setSuccess('Voter updated successfully.');
      } else {
        await VoterService.create(payload);
        setSuccess('Voter registered successfully.');
      }

      closeModal();
      await loadVoters();
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
      await VoterService.delete(deleteTarget.voterID);
      setSuccess('Voter deleted successfully.');
      setDeleteTarget(null);
      await loadVoters();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'voterID', header: 'ID' },
    { key: 'nationalID', header: 'National ID' },
    { key: 'fullName', header: 'Full Name' },
    { key: 'gender', header: 'Gender' },
    {
      key: 'dateOfBirth',
      header: 'Date of Birth',
      render: (row) => formatDate(row.dateOfBirth),
    },
    { key: 'phone', header: 'Phone' },
    { key: 'address', header: 'Address' },
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
        title="Voters"
        subtitle="Register and manage eligible voters."
      />

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search voters by name, ID, address, or phone..."
        />
        <Button icon={FiPlus} onClick={openCreateModal}>
          Add Voter
        </Button>
      </div>

      <Table
        columns={columns}
        data={paginatedItems}
        isLoading={loading}
        rowKey="voterID"
        emptyMessage="No voters found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVoter ? 'Edit Voter' : 'Add Voter'}
        size="lg"
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            label="National ID"
            placeholder="Enter national ID"
            error={errors.nationalID?.message}
            {...register('nationalID', nationalIdRules)}
          />

          <InputField
            label="Full Name"
            placeholder="Enter full name"
            error={errors.fullName?.message}
            {...register('fullName', requiredRule('Full name'))}
          />

          <SelectField
            label="Gender"
            options={genderOptions}
            error={errors.gender?.message}
            {...register('gender', requiredRule('Gender'))}
          />

<InputField
  label="Date of Birth"
  type="date"
  max={new Date().toISOString().split('T')[0]}
  error={errors.dateOfBirth?.message}
  {...register('dateOfBirth', {
    ...requiredRule('Date of birth'),
    validate: (value) => {
      const birthDate = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 18 || 'Voter must be at least 18 years old.';
    },
  })}
/>

          <InputField
            label="Phone"
            type="tel"
            placeholder="Enter phone number"
            error={errors.phone?.message}
            {...register('phone', phoneRules)}
          />

          <InputField
            label="Address"
            placeholder="Enter residential address"
            error={errors.address?.message}
            // containerClassName="sm:col-span-2"
            {...register('address', requiredRule('Address'))}
          />

          

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingVoter ? 'Update Voter' : 'Register Voter'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Voter"
        message={`Are you sure you want to delete "${deleteTarget?.fullName}"?`}
        confirmLabel="Delete"
        isLoading={submitting}
      />
    </div>
  );
}

export default Voters;
