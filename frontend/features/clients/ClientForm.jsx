import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function ClientForm({ defaultValues, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal__body">
        <fieldset className="client-form__section">
          <legend>Client 1</legend>
          <Input label="Full name" name="full_name" register={register} error={errors.full_name} required />
          <Input label="Date of birth" name="dob" type="date" register={register} />
          <Input label="SSN last 4" name="ssn_last4" register={register} />
        </fieldset>

        <fieldset className="client-form__section">
          <legend>Client 2 (Spouse)</legend>
          <Input label="Spouse name" name="spouse_name" register={register} />
          <Input label="Spouse date of birth" name="spouse_dob" type="date" register={register} />
          <Input label="Spouse SSN last 4" name="spouse_ssn_last4" register={register} />
        </fieldset>

        <fieldset className="client-form__section">
          <legend>Financial Data — Client 1</legend>
          <Input label="Monthly salary (after tax)" name="monthly_salary" type="number" step="0.01" register={register} />
          <Input label="Monthly expense budget" name="expense_budget" type="number" step="0.01" register={register} />
          <Input label="Insurance deductibles (total)" name="insurance_deductibles" type="number" step="0.01" register={register} />
          <Input label="Private reserve target" name="private_reserve_target" type="number" step="0.01" register={register} />
        </fieldset>

        <fieldset className="client-form__section">
          <legend>Financial Data — Client 2 (Spouse)</legend>
          <Input label="Monthly salary (after tax)" name="spouse_monthly_salary" type="number" step="0.01" register={register} />
          <Input label="Monthly expense budget" name="spouse_expense_budget" type="number" step="0.01" register={register} />
          <Input label="Insurance deductibles (total)" name="spouse_insurance_deductibles" type="number" step="0.01" register={register} />
          <Input label="Private reserve target" name="spouse_private_reserve_target" type="number" step="0.01" register={register} />
        </fieldset>
      </div>

      <div className="modal__footer">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  );
}
