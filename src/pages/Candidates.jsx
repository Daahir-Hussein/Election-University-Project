import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import Alert from '../components/Alert';
import Button from '../components/Button';
import ConfirmationDialog from '../components/ConfirmationDialog';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import SearchBox from '../components/SearchBox';
import SelectField from '../components/SelectField';
import Table from '../components/Table';
import usePagination from '../hooks/usePagination';
import { getApiErrorMessage } from '../services/api';
import CandidateService from '../services/CandidateService';
import ElectionService from '../services/ElectionService';
import PartyService from '../services/PartyService';
import { filterBySearch } from '../utils/search';
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  getCandidatePhotoUrl,
  validateImageFile,
} from '../utils/uploads';
import { requiredRule } from '../utils/validation';

const defaultValues = {
  electionID: '',
  partyID: '',
  fullName: '',
  gender: '',
  photo: '',
  biography: '',
};

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

function ImageThumbnail({ src, alt, fallback = 'No Photo' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span className="text-xs text-gray-500">{fallback}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-12 w-12 rounded object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const electionOptions = elections.map((election) => ({
    value: String(election.electionID),
    label: election.electionName,
  }));

  const partyOptions = parties.map((party) => ({
    value: String(party.partyID),
    label: party.partyName,
  }));

  const getElectionName = (id) =>
    elections.find((item) => item.electionID === id)?.electionName || id;

  const getPartyName = (id) =>
    parties.find((item) => item.partyID === id)?.partyName || id;

  const clearPhotoPreview = useCallback(() => {
    setPhotoPreview((current) => {
      if (current?.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [candidatesRes, electionsRes, partiesRes] = await Promise.all([
        CandidateService.getAll(),
        ElectionService.getAll(),
        PartyService.getAll(),
      ]);

      setCandidates(Array.isArray(candidatesRes.data) ? candidatesRes.data : []);
      setElections(Array.isArray(electionsRes.data) ? electionsRes.data : []);
      setParties(Array.isArray(partiesRes.data) ? partiesRes.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isModalOpen) {
      reset(
        editingCandidate
          ? {
              electionID: String(editingCandidate.electionID ?? ''),
              partyID: String(editingCandidate.partyID ?? ''),
              fullName: editingCandidate.fullName || '',
              gender: editingCandidate.gender || '',
              photo: editingCandidate.photo || '',
              biography: editingCandidate.biography || '',
            }
          : defaultValues
      );

      setUploadError(null);
      setUploadingPhoto(false);
      clearPhotoPreview();
      setPhotoPreview(
        editingCandidate?.photo
          ? getCandidatePhotoUrl(editingCandidate.photo)
          : null
      );
    }
  }, [isModalOpen, editingCandidate, reset, clearPhotoPreview]);

  const filteredCandidates = useMemo(() => {
    const enriched = candidates.map((candidate) => ({
      ...candidate,
      electionName: getElectionName(candidate.electionID),
      partyName: getPartyName(candidate.partyID),
    }));

    return filterBySearch(enriched, searchTerm, [
      'fullName',
      'gender',
      'biography',
      'electionName',
      'partyName',
    ]);
  }, [candidates, searchTerm, elections, parties]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
  } = usePagination(filteredCandidates, 5);

  const openCreateModal = () => {
    setEditingCandidate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCandidate(null);
    setUploadError(null);
    setUploadingPhoto(false);
    clearPhotoPreview();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationMessage = validateImageFile(file);
    if (validationMessage) {
      setUploadError(validationMessage);
      event.target.value = '';
      return;
    }

    setUploadError(null);
    setUploadingPhoto(true);

    clearPhotoPreview();
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);

    try {
      const { data } = await CandidateService.upload(file);
      setValue('photo', data.fileName, { shouldDirty: true });
    } catch (err) {
      setUploadError(getApiErrorMessage(err));
      setValue('photo', editingCandidate?.photo || '', { shouldDirty: true });
      clearPhotoPreview();
      setPhotoPreview(
        editingCandidate?.photo
          ? getCandidatePhotoUrl(editingCandidate.photo)
          : null
      );
    } finally {
      setUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      candidateID: editingCandidate?.candidateID ?? 0,
      electionID: Number(formData.electionID),
      partyID: Number(formData.partyID),
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      photo: formData.photo?.trim() || '',
      biography: formData.biography.trim(),
    };

    try {
      if (editingCandidate) {
        await CandidateService.update(editingCandidate.candidateID, payload);
        setSuccess('Candidate updated successfully.');
      } else {
        await CandidateService.create(payload);
        setSuccess('Candidate created successfully.');
      }

      closeModal();
      await loadData();
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
      await CandidateService.delete(deleteTarget.candidateID);
      setSuccess('Candidate deleted successfully.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'candidateID', header: 'ID' },
    {
      key: 'photo',
      header: 'Photo',
      render: (row) => (
        <ImageThumbnail
          src={getCandidatePhotoUrl(row.photo)}
          alt={row.fullName}
          fallback="No Photo"
        />
      ),
    },
    { key: 'fullName', header: 'Full Name' },
    {
      key: 'electionID',
      header: 'Election',
      render: (row) => getElectionName(row.electionID),
    },
    {
      key: 'partyID',
      header: 'Party',
      render: (row) => getPartyName(row.partyID),
    },
    { key: 'gender', header: 'Gender' },
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

  const isFormBusy = submitting || uploadingPhoto;

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle="Manage election candidates and party affiliations."
      />

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search candidates by name or gender..."
        />
        <Button icon={FiPlus} onClick={openCreateModal}>
          Add Candidate
        </Button>
      </div>

      <Table
        columns={columns}
        data={paginatedItems}
        isLoading={loading}
        rowKey="candidateID"
        emptyMessage="No candidates found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
        size="lg"
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <SelectField
            label="Election"
            options={electionOptions}
            error={errors.electionID?.message}
            containerClassName="sm:col-span-2"
            {...register('electionID', {
              ...requiredRule('Election'),
              validate: (value) =>
                elections.some((item) => item.electionID === Number(value)) ||
                'Selected election does not exist.',
            })}
          />

          <SelectField
            label="Political Party"
            options={partyOptions}
            error={errors.partyID?.message}
            containerClassName="sm:col-span-2"
            {...register('partyID', {
              ...requiredRule('Political party'),
              validate: (value) =>
                parties.some((item) => item.partyID === Number(value)) ||
                'Selected party does not exist.',
            })}
          />

          <InputField
            label="Full Name"
            placeholder="Enter candidate full name"
            error={errors.fullName?.message}
            containerClassName="sm:col-span-2"
            {...register('fullName', requiredRule('Full name'))}
          />

          <SelectField
            label="Gender"
            options={genderOptions}
            error={errors.gender?.message}
            {...register('gender', requiredRule('Gender'))}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Photo
            </label>
            <input
              type="file"
              accept={ACCEPTED_IMAGE_EXTENSIONS}
              disabled={uploadingPhoto}
              onChange={handlePhotoChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: .jpg, .jpeg, .png
            </p>
            {uploadError && (
              <p className="mt-1 text-xs text-danger">{uploadError}</p>
            )}
            {uploadingPhoto && (
              <div className="mt-3">
                <LoadingSpinner size="sm" label="Uploading image..." />
              </div>
            )}
            {photoPreview && !uploadingPhoto && (
              <img
                src={photoPreview}
                alt="Candidate preview"
                className="mt-3 h-24 w-24 rounded-lg border border-gray-200 object-cover"
              />
            )}
            <input type="hidden" {...register('photo')} />
          </div>

          <InputField
            label="Biography"
            placeholder="Enter candidate biography"
            containerClassName="sm:col-span-2"
            {...register('biography')}
          />

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting} disabled={isFormBusy}>
              {editingCandidate ? 'Update Candidate' : 'Create Candidate'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Candidate"
        message={`Are you sure you want to delete "${deleteTarget?.fullName}"?`}
        confirmLabel="Delete"
        isLoading={submitting}
      />
    </div>
  );
}

export default Candidates;
