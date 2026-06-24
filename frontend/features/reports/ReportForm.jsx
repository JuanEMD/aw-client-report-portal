import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ACCOUNT_TYPES = ['retirement', 'non-retirement', 'joint', 'trust'];

function getAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function emptyAcc() {
  return { last4: '', type: 'retirement', current_amount: '', amount_to_invest: '' };
}

function dbToFormEntry(acc, client) {
  let type = 'non-retirement';
  if (acc.category === 'retirement') type = 'retirement';
  else if (acc.owner === 'Joint') type = 'joint';
  else if (acc.category === 'trust') type = 'trust';

  return {
    id: `db_${acc.id}`,
    dbId: acc.id,
    last4: acc.account_last4 || '',
    type,
    current_amount: acc.balance || 0,
    amount_to_invest: 0,
  };
}

export default function ReportForm({ client, accounts: _unused, onSubmit, calculated, existingAccounts, existingLiabilities, clientId, onSaveAccount, onSaveLiability }) {
  const { register, handleSubmit, watch } = useForm();
  const [deductibles, setDeductibles] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [tccAccountsC1, setTccAccountsC1] = useState([]);
  const [tccAccountsC2, setTccAccountsC2] = useState([]);
  const [formC1, setFormC1] = useState({ open: false, data: emptyAcc(), editing: null });
  const [formC2, setFormC2] = useState({ open: false, data: emptyAcc(), editing: null });
  const initialized = useRef(false);

  useEffect(() => {
    if (!existingLiabilities?.length) return;
    setLiabilities(
      existingLiabilities.map((l) => ({
        id: `db_${l.id}`,
        dbId: l.id,
        name: l.owner || '',
        interestRate: l.interest_rate || '',
        amount: l.balance || '',
      }))
    );
  }, [existingLiabilities]);

  useEffect(() => {
    if (initialized.current || !existingAccounts?.length) return;
    const c1 = [];
    const c2 = [];
    for (const acc of existingAccounts) {
      const entry = dbToFormEntry(acc, client);
      if (acc.owner === client.spouse_name) c2.push(entry);
      else c1.push(entry);
    }
    setTccAccountsC1(c1);
    setTccAccountsC2(c2);
    initialized.current = true;
  }, [existingAccounts]);

  const inflow = watch('inflow') || 0;
  const outflow = watch('outflow') || 0;
  const excess = Number(inflow) - Number(outflow);

  const totalDeductibles = deductibles.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const ficaBalance = (Number(outflow) * 6) + totalDeductibles;

  const addDeductible = () => {
    setDeductibles([...deductibles, { id: Date.now().toString(), name: '', amount: '' }]);
  };

  const updateDeductible = (index, field, value) => {
    const updated = [...deductibles];
    updated[index][field] = value;
    setDeductibles(updated);
  };

  const removeDeductible = (index) => {
    setDeductibles(deductibles.filter((_, i) => i !== index));
  };

  const addLiability = () => {
    setLiabilities([...liabilities, { id: Date.now().toString(), name: '', interestRate: '', amount: '' }]);
  };

  const updateLiability = (index, field, value) => {
    const updated = [...liabilities];
    updated[index][field] = value;
    setLiabilities(updated);
  };

  const removeLiability = (index) => {
    setLiabilities(liabilities.filter((_, i) => i !== index));
  };

  const openAddForm = (owner) => {
    const setter = owner === 'c1' ? setFormC1 : setFormC2;
    setter({ open: true, data: emptyAcc(), editing: null });
  };

  const openEditForm = (owner, acc) => {
    const setter = owner === 'c1' ? setFormC1 : setFormC2;
    setter({ open: true, data: { ...acc }, editing: acc.id });
  };

  const closeForm = (owner) => {
    const setter = owner === 'c1' ? setFormC1 : setFormC2;
    setter({ open: false, data: emptyAcc(), editing: null });
  };

  const updateFormData = (owner, field, value) => {
    const setter = owner === 'c1' ? setFormC1 : setFormC2;
    setter((prev) => ({ ...prev, data: { ...prev.data, [field]: value } }));
  };

  const saveAccount = async (owner) => {
    const form = owner === 'c1' ? formC1 : formC2;
    const { data, editing } = form;
    if (!data.last4 && !data.current_amount) return;

    const entry = {
      ...data,
      current_amount: Number(data.current_amount) || 0,
      amount_to_invest: Number(data.amount_to_invest) || 0,
    };

    let dbId;
    if (!editing && onSaveAccount) {
      try {
        const saved = await onSaveAccount(owner, entry);
        if (saved?.id) dbId = saved.id;
      } catch {}
    }

    const setter = owner === 'c1' ? setTccAccountsC1 : setTccAccountsC2;

    if (editing) {
      setter((prev) => prev.map((a) => (a.id === editing ? { ...a, ...entry, id: editing } : a)));
    } else {
      const id = dbId ? `db_${dbId}` : `local_${Date.now()}`;
      setter((prev) => [...prev, { ...entry, id, dbId }]);
    }

    closeForm(owner);
  };

  const removeAccount = (owner, id) => {
    const setter = owner === 'c1' ? setTccAccountsC1 : setTccAccountsC2;
    setter((prev) => prev.filter((a) => a.id !== id));
  };

  const onFormSubmit = (data) => {
    data.deductibles = JSON.stringify(deductibles);
    data.fica_account_balance = ficaBalance;
    data.liabilities = JSON.stringify(liabilities);
    data.tcc_accounts_client_1 = JSON.stringify(tccAccountsC1);
    data.tcc_accounts_client_2 = JSON.stringify(tccAccountsC2);
    onSubmit(data);
  };

  const renderTccBlock = (owner) => {
    const isC1 = owner === 'c1';
    const name = isC1 ? client.full_name : (client.spouse_name || 'Spouse');
    const dob = isC1 ? client.dob : client.spouse_dob;
    const ssn = isC1 ? client.ssn_last4 : client.spouse_ssn_last4;
    const accounts = isC1 ? tccAccountsC1 : tccAccountsC2;
    const form = isC1 ? formC1 : formC2;

    return (
      <div className="tcc-block">
        <div className="tcc-block__header">
          <h4 className="tcc-block__name">{name}</h4>
          <span className="tcc-block__info">Age: {getAge(dob)}</span>
          <span className="tcc-block__info">SSN: ****{ssn || '----'}</span>
        </div>

        <div className="tcc-block__accounts">
          {accounts.length === 0 && <p className="tcc-block__empty">No accounts added</p>}
          {accounts.map((acc) => (
            <div key={acc.id} className="tcc-block__account-row" onClick={() => openEditForm(owner, acc)}>
              <span className="tcc-block__edit-icon">&#9998;</span>
              <span className="tcc-block__acc-last4">****{acc.last4}</span>
              <span className="tcc-block__acc-type">{acc.type}</span>
              <span className="tcc-block__acc-amount">${(acc.current_amount || 0).toLocaleString()}</span>
              <span className="tcc-block__acc-invest">Invest: ${(acc.amount_to_invest || 0).toLocaleString()}</span>
              <button type="button" className="button button--small button--danger"
                onClick={(e) => { e.stopPropagation(); removeAccount(owner, acc.id); }}>&times;</button>
            </div>
          ))}
        </div>

        {form.open && (
          <div className="tcc-block__add-form">
            <div className="tcc-block__form-row">
              <label className="tcc-block__form-label">Last 4</label>
              <input className="input" placeholder="Account number (last 4)" maxLength={4}
                value={form.data.last4}
                onChange={(e) => updateFormData(owner, 'last4', e.target.value)} />
            </div>
            <div className="tcc-block__form-row">
              <label className="tcc-block__form-label">Type</label>
              <select className="input" value={form.data.type}
                onChange={(e) => updateFormData(owner, 'type', e.target.value)}>
                {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="tcc-block__form-row">
              <label className="tcc-block__form-label">Current amount</label>
              <input className="input" type="number" step="0.01" placeholder="Current amount"
                value={form.data.current_amount}
                onChange={(e) => updateFormData(owner, 'current_amount', e.target.value)} />
            </div>
            <div className="tcc-block__form-row">
              <label className="tcc-block__form-label">Amount to invest</label>
              <input className="input" type="number" step="0.01" placeholder="Amount to invest"
                value={form.data.amount_to_invest}
                onChange={(e) => updateFormData(owner, 'amount_to_invest', e.target.value)} />
            </div>
            <div className="tcc-block__add-actions">
              <Button type="button" variant="primary" onClick={() => saveAccount(owner)}>
                {form.editing ? 'Update' : 'Add'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => closeForm(owner)}>Cancel</Button>
            </div>
          </div>
        )}

        {!form.open && (
          <Button type="button" variant="secondary" onClick={() => openAddForm(owner)}>+ Add</Button>
        )}
      </div>
    );
  };

  return (
    <form className="report-form" onSubmit={handleSubmit(onFormSubmit)}>
      <h3 className="report-form__title">Quarterly Report — {client.full_name}</h3>

      <fieldset className="report-form__section">
        <legend>SACS — Cashflow</legend>

        <Input label="Inflow (monthly)" name="inflow" type="number" step="0.01"
          placeholder={client.monthly_salary} register={register} />

        <Input label="Floor" name="floor" type="number" step="0.01"
          placeholder="Amount extracted from inflow to private reserve" register={register} />

        <Input label="Outflow (monthly expense budget)" name="outflow" type="number" step="0.01"
          placeholder={client.expense_budget} register={register} />

        <div className="report-form__calculated">
          Excess: ${excess.toFixed(2)}
        </div>

        <div className="report-form__static">
          Private reserve
        </div>

        <div className="report-form__deductibles">
          <label className="report-form__label">Deductibles</label>
          {deductibles.map((d, i) => (
            <div key={d.id} className="report-form__deductible-row">
              <input type="hidden" name={`deductible_${i}_id`} value={d.id} />
              <input className="input" placeholder="Name"
                value={d.name}
                onChange={(e) => updateDeductible(i, 'name', e.target.value)} />
              <input className="input" type="number" step="0.01" placeholder="Amount"
                value={d.amount}
                onChange={(e) => updateDeductible(i, 'amount', e.target.value)} />
              <button type="button" className="button button--small button--danger" onClick={() => removeDeductible(i)}>
                &times;
              </button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addDeductible}>+ Add</Button>
        </div>

        <div className="report-form__calculated">
          FICA account balance: ${ficaBalance.toFixed(2)}
        </div>

        <Input label="Investment account balance" name="investment_balance" type="number" step="0.01" register={register} />
      </fieldset>

      <fieldset className="report-form__section">
        <legend>TCC — Account Balances</legend>
        {renderTccBlock('c1')}
        {client.spouse_name && renderTccBlock('c2')}

        <div className="report-form__static">
          <label className="report-form__label">Trust — House Value</label>
          <input className="input" type="number" step="0.01" placeholder="Estimated home value"
            {...register('trust_amount')} />
        </div>

        <div className="report-form__liabilities">
          <label className="report-form__label">Liabilities</label>
          {liabilities.map((l, i) => (
            <div key={l.id} className="report-form__liability-row">
              <input className="input" placeholder="Name"
                value={l.name}
                onChange={(e) => updateLiability(i, 'name', e.target.value)} />
              <input className="input" type="number" step="0.01" placeholder="Interest rate"
                value={l.interestRate}
                onChange={(e) => updateLiability(i, 'interestRate', e.target.value)} />
              <input className="input" type="number" step="0.01" placeholder="Amount"
                value={l.amount}
                onChange={(e) => updateLiability(i, 'amount', e.target.value)} />
              <button type="button" className="button button--small button--danger" onClick={() => removeLiability(i)}>
                &times;
              </button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addLiability}>+ Add</Button>
        </div>
      </fieldset>

      {calculated && (
        <div className="report-form__calculated">
          <p>Grand Total Net Worth: ${calculated.grand_total?.toLocaleString()}</p>
        </div>
      )}

      <Button type="submit" variant="primary">Save & Calculate</Button>
    </form>
  );
}
