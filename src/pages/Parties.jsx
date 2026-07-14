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
import Table from '../components/Table';
import usePagination from '../hooks/usePagination';
import { getApiErrorMessage } from '../services/api';
import PartyService from '../services/PartyService';
import { filterBySearch } from '../utils/search';
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  getPartyLogoUrl,
  validateImageFile,
} from '../utils/uploads';
import { requiredRule } from '../utils/validation';

const defaultValues = {
  partyName: '',
  leaderName: '',
  logo: '',
};

function ImageThumbnail({ src, alt, fallback = 'No Logo' }) {
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

function Parties() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const clearLogoPreview = useCallback(() => {
    setLogoPreview((current) => {
      if (current?.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }, []);

  const loadParties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await PartyService.getAll();
      setParties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParties();
  }, [loadParties]);

  useEffect(() => {
    if (isModalOpen) {
      reset(
        editingParty
          ? {
              partyName: editingParty.partyName || '',
              leaderName: editingParty.leaderName || '',
              logo: editingParty.logo || '',
            }
          : defaultValues
      );

      setUploadError(null);
      setUploadingLogo(false);
      clearLogoPreview();
      setLogoPreview(
        editingParty?.logo ? getPartyLogoUrl(editingParty.logo) : null
      );
    }
  }, [isModalOpen, editingParty, reset, clearLogoPreview]);

  const filteredParties = useMemo(
    () =>
      filterBySearch(parties, searchTerm, ['partyName', 'leaderName']),
    [parties, searchTerm]
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
  } = usePagination(filteredParties, 5);

  const openCreateModal = () => {
    setEditingParty(null);
    setIsModalOpen(true);
  };

  const openEditModal = (party) => {
    setEditingParty(party);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingParty(null);
    setUploadError(null);
    setUploadingLogo(false);
    clearLogoPreview();
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationMessage = validateImageFile(file);
    if (validationMessage) {
      setUploadError(validationMessage);
      event.target.value = '';
      return;
    }

    setUploadError(null);
    setUploadingLogo(true);

    clearLogoPreview();
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    try {
      const { data } = await PartyService.upload(file);
      setValue('logo', data.fileName, { shouldDirty: true });
    } catch (err) {
      setUploadError(getApiErrorMessage(err));
      setValue('logo', editingParty?.logo || '', { shouldDirty: true });
      clearLogoPreview();
      setLogoPreview(
        editingParty?.logo ? getPartyLogoUrl(editingParty.logo) : null
      );
    } finally {
      setUploadingLogo(false);
      event.target.value = '';
    }
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      partyID: editingParty?.partyID ?? 0,
      partyName: formData.partyName.trim(),
      leaderName: formData.leaderName.trim(),
      logo: formData.logo?.trim() || '',
    };

    try {
      if (editingParty) {
        await PartyService.update(editingParty.partyID, payload);
        setSuccess('Political party updated successfully.');
      } else {
        await PartyService.create(payload);
        setSuccess('Political party created successfully.');
      }

      closeModal();
      await loadParties();
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
      await PartyService.delete(deleteTarget.partyID);
      setSuccess('Political party deleted successfully.');
      setDeleteTarget(null);
      await loadParties();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'partyID', header: 'ID' },
    { key: 'partyName', header: 'Party Name' },
    { key: 'leaderName', header: 'Leader Name' },
    {
      key: 'logo',
      header: 'Logo',
      render: (row) => (
        <ImageThumbnail
          src={getPartyLogoUrl(row.logo)}
          alt={row.partyName}
          fallback="No Logo"
        />
      ),
    },
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

  const isFormBusy = submitting || uploadingLogo;

  return (
    <div>
      <PageHeader
        title="Political Parties"
        subtitle="Manage registered political parties."
      />

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search parties by name or leader..."
        />
        <Button icon={FiPlus} onClick={openCreateModal}>
          Add Party
        </Button>
      </div>

      <Table
        columns={columns}
        data={paginatedItems}
        isLoading={loading}
        rowKey="partyID"
        emptyMessage="No political parties found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingParty ? 'Edit Political Party' : 'Add Political Party'}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            label="Party Name"
            placeholder="Enter party name"
            error={errors.partyName?.message}
            {...register('partyName', requiredRule('Party name'))}
          />

          <InputField
            label="Leader Name"
            placeholder="Enter leader name"
            error={errors.leaderName?.message}
            {...register('leaderName', requiredRule('Leader name'))}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              accept={ACCEPTED_IMAGE_EXTENSIONS}
              disabled={uploadingLogo}
              onChange={handleLogoChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: .jpg, .jpeg, .png
            </p>
            {uploadError && (
              <p className="mt-1 text-xs text-danger">{uploadError}</p>
            )}
            {uploadingLogo && (
              <div className="mt-3">
                <LoadingSpinner size="sm" label="Uploading logo..." />
              </div>
            )}
            {logoPreview && !uploadingLogo && (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="mt-3 h-24 w-24 rounded-lg border border-gray-200 object-cover"
              />
            )}
            <input type="hidden" 
               {...register('logo', {
                required: 'Logo is required',
              })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting} disabled={isFormBusy}>
              {editingParty ? 'Update Party' : 'Create Party'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Political Party"
        message={`Are you sure you want to delete "${deleteTarget?.partyName}"?`}
        confirmLabel="Delete"
        isLoading={submitting}
      />
    </div>
  );
}

export default Parties;
