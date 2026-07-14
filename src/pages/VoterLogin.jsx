import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCreditCard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { getApiErrorMessage } from '../services/api';
import VoterPortalService from '../services/VoterPortalService';
import { nationalIdRules } from '../utils/validation';

const VOTER_STORAGE_KEY = 'voter';

function VoterLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nationalID: '',
    },
  });

  useEffect(() => {
    localStorage.removeItem(VOTER_STORAGE_KEY);
  }, []);

  const onSubmit = async (formData) => {
    setError(null);
    setSubmitting(true);

    try {
      const { data } = await VoterPortalService.login(formData.nationalID.trim());
      localStorage.setItem(VOTER_STORAGE_KEY, JSON.stringify(data));
      navigate('/voter-elections', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
      <h2 className="text-xl font-bold text-primary">Voter Login</h2>
      <p className="mt-1 text-sm text-gray-600">
        Enter your National ID to access the voter portal.
      </p>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          label="National ID"
          type="text"
          autoComplete="off"
          placeholder="Enter your national ID"
          icon={FiCreditCard}
          error={errors.nationalID?.message}
          {...register('nationalID', nationalIdRules)}
        />

        <Button type="submit" className="w-full" isLoading={submitting}>
          Continue
        </Button>
      </form>
    </div>
  );
}

export default VoterLogin;
