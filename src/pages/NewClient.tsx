import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const API_URL = import.meta.env.VITE_API_URL;

// ── Tipos alineados al modelo del back ────────────────────────────────────────
type TenantId = 'whatcem' | 'wabia' | 'leadcem';
type OnboardingStatus = 'active' | 'reviewing' | 'dataloading' | 'baseline';

interface TenantForm {
  tenant: TenantId | '';
  onboardingStatus: OnboardingStatus;
  acquiredAt: string;    // YYYY-MM-DD
  acquiredUntil: string; // YYYY-MM-DD o '' (null en el back)
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  tenants?: string;
  tenantRows?: { tenant?: string }[];
  general?: string;
}

// ── Constantes ────────────────────────────────────────────────────────────────
const TENANT_OPTIONS: { value: TenantId; label: string }[] = [
  { value: 'whatcem', label: 'WhatCEM'  },
  { value: 'wabia',   label: 'Wabia'    },
  { value: 'leadcem', label: 'LeadCEM'  },
];

const ONBOARDING_OPTIONS: { value: OnboardingStatus; label: string; color: string; bg: string }[] = [
  { value: 'baseline',    label: 'Baseline',    color: '#6b7280', bg: '#f3f4f6' },
  { value: 'dataloading', label: 'Data loading', color: '#1d4ed8', bg: '#eff6ff' },
  { value: 'reviewing',   label: 'Reviewing',   color: '#92400e', bg: '#fef3c7' },
  { value: 'active',      label: 'Active',      color: '#166534', bg: '#f0fdf4' },
];

const emptyTenant = (): TenantForm => ({
  tenant: '',
  onboardingStatus: 'baseline',
  acquiredAt: new Date().toISOString().split('T')[0],
  acquiredUntil: '',
});

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1.5 4.5L8 9.5L14.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="4" y="1" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="8" cy="12.5" r="0.75" fill="currentColor"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 13V6l5-3 5 3v7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <rect x="6" y="9" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IconTenant = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 4V3a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ── Sub-componente: divisor de sección ────────────────────────────────────────
const SectionDivider = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '8px',
    margin: '1.5rem 0 1rem', color: '#374151',
  }}>
    <span style={{ color: '#0d5c73' }}>{icon}</span>
    <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
  </div>
);

// ── Sub-componente: fila de tenant ────────────────────────────────────────────
interface TenantRowProps {
  index:     number;
  tenant:    TenantForm;
  error?:    { tenant?: string };
  isLoading: boolean;
  canRemove: boolean;
  onChange:  <K extends keyof TenantForm>(key: K, value: TenantForm[K]) => void;
  onRemove:  () => void;
}

const TenantRow = ({ index, tenant, error, isLoading, canRemove, onChange, onRemove }: TenantRowProps) => {
  const statusInfo = ONBOARDING_OPTIONS.find(o => o.value === tenant.onboardingStatus);

  return (
    <div style={{
      background: '#f8fafc', borderRadius: '10px',
      border: '1px solid #e2e8f0', padding: '1rem',
      marginBottom: '0.75rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.73rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Tenant #{index + 1}
        </span>
        {canRemove && (
          <button
            type="button" onClick={onRemove} disabled={isLoading}
            style={{
              background: 'transparent', border: 'none',
              color: '#ef4444', cursor: 'pointer',
              fontSize: '0.75rem', fontWeight: 600,
              padding: '2px 6px', borderRadius: '4px',
            }}
          >
            ✕ Eliminar
          </button>
        )}
      </div>

      {/* Producto + Estatus */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

        <div className="lf-field" style={{ margin: 0 }}>
          <label htmlFor={`nc-tenant-${index}`}>Producto *</label>
          <div className={`lf-input-wrap ${error?.tenant ? 'is-error' : ''}`} style={{ padding: 0, overflow: 'hidden' }}>
            <select
              id={`nc-tenant-${index}`}
              value={tenant.tenant}
              onChange={e => onChange('tenant', e.target.value as TenantId)}
              disabled={isLoading}
              style={{
                width: '100%', border: 'none', outline: 'none',
                padding: '0.6rem 0.85rem', background: 'transparent',
                fontSize: '0.875rem', color: tenant.tenant ? '#374151' : '#9ca3af',
                cursor: 'pointer', appearance: 'auto',
              }}
            >
              <option value="" disabled>Seleccionar...</option>
              {TENANT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {error?.tenant && <span className="lf-error">{error.tenant}</span>}
        </div>

        <div className="lf-field" style={{ margin: 0 }}>
          <label htmlFor={`nc-onboarding-${index}`}>Estatus onboarding</label>
          <div className="lf-input-wrap" style={{ padding: 0, overflow: 'hidden' }}>
            <select
              id={`nc-onboarding-${index}`}
              value={tenant.onboardingStatus}
              onChange={e => onChange('onboardingStatus', e.target.value as OnboardingStatus)}
              disabled={isLoading}
              style={{
                width: '100%', border: 'none', outline: 'none',
                padding: '0.6rem 0.85rem', background: 'transparent',
                fontSize: '0.875rem', color: '#374151',
                cursor: 'pointer', appearance: 'auto',
              }}
            >
              {ONBOARDING_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {statusInfo && (
            <span style={{
              display: 'inline-block', marginTop: '4px',
              fontSize: '0.68rem', fontWeight: 700,
              padding: '2px 7px', borderRadius: '4px',
              background: statusInfo.bg, color: statusInfo.color,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {statusInfo.label}
            </span>
          )}
        </div>

      </div>

      {/* Fechas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
        <div className="lf-field" style={{ margin: 0 }}>
          <label htmlFor={`nc-acquired-${index}`}>Fecha de adquisición</label>
          <div className="lf-input-wrap">
            <input
              id={`nc-acquired-${index}`}
              type="date" value={tenant.acquiredAt}
              onChange={e => onChange('acquiredAt', e.target.value)}
              disabled={isLoading}
              style={{ fontSize: '0.875rem', color: '#374151' }}
            />
          </div>
        </div>

        <div className="lf-field" style={{ margin: 0 }}>
          <label htmlFor={`nc-until-${index}`}>
            Vigencia hasta{' '}
            <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.76rem' }}>(opcional)</span>
          </label>
          <div className="lf-input-wrap">
            <input
              id={`nc-until-${index}`}
              type="date" value={tenant.acquiredUntil}
              onChange={e => onChange('acquiredUntil', e.target.value)}
              disabled={isLoading}
              style={{ fontSize: '0.875rem', color: tenant.acquiredUntil ? '#374151' : '#9ca3af' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
const NewClient = () => {
  const { token } = useAuth();

  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [ownerName,  setOwnerName]  = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  const [tenants, setTenants] = useState<TenantForm[]>([emptyTenant()]);

  const [errors,     setErrors]     = useState<FormErrors>({});
  const [isLoading,  setIsLoading]  = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // ── Helpers de tenants ──────────────────────────────────────────────────────
  const addTenant = () => setTenants(prev => [...prev, emptyTenant()]);

  const removeTenant = (i: number) =>
    setTenants(prev => prev.filter((_, idx) => idx !== i));

  const updateTenant = <K extends keyof TenantForm>(
    i: number, key: K, value: TenantForm[K]
  ) => setTenants(prev =>
    prev.map((t, idx) => idx === i ? { ...t, [key]: value } : t)
  );

  // ── Validación ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!name.trim())  e.name  = 'El nombre del cliente es obligatorio';
    if (!email.trim()) e.email = 'El correo del cliente es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Correo inválido';
    if (!phone.trim()) e.phone = 'El teléfono del cliente es obligatorio';

    if (!ownerName.trim())  e.ownerName  = 'El nombre del contacto es obligatorio';
    if (!ownerEmail.trim()) e.ownerEmail = 'El correo del contacto es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) e.ownerEmail = 'Correo inválido';
    if (!ownerPhone.trim()) e.ownerPhone = 'El teléfono del contacto es obligatorio';

    if (tenants.length === 0) {
      e.tenants = 'Agrega al menos un tenant';
    } else {
      const rows = tenants.map(t => ({
        ...(t.tenant ? {} : { tenant: 'Selecciona un producto' }),
      }));
      if (rows.some(r => r.tenant)) e.tenantRows = rows;
    }

    setErrors(e);

    const topLevelOk = !e.name && !e.email && !e.phone
      && !e.ownerName && !e.ownerEmail && !e.ownerPhone
      && !e.tenants;
    const rowsOk = !e.tenantRows?.some(r => r.tenant);
    return topLevelOk && rowsOk;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMsg('');

    try {
      const body = {
        name:  name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        owner: {
          name:  ownerName.trim(),
          email: ownerEmail.trim(),
          phone: ownerPhone.trim(),
        },
        // soldBy es inyectado por el controller desde req.uid
        tenants: tenants.map(t => ({
          tenant:           t.tenant,
          onboardingStatus: t.onboardingStatus,
          acquiredAt:       t.acquiredAt  || undefined,
          acquiredUntil:    t.acquiredUntil || null,
        })),
      };

      const res = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token ?? '',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.msg || 'Error al registrar el cliente' });
        return;
      }

      setSuccessMsg(`Cliente "${data.client?.name ?? name}" registrado correctamente`);
      setName(''); setEmail(''); setPhone('');
      setOwnerName(''); setOwnerEmail(''); setOwnerPhone('');
      setTenants([emptyTenant()]);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch {
      setErrors({ general: 'Error de red. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{
        width: '100%', maxWidth: '580px',
        background: '#fff', borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        padding: '2.5rem',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{
            background: '#fef3c7', color: '#92400e',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '2px 8px', borderRadius: '4px',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            display: 'inline-block', marginBottom: '8px',
          }}>
            Admin
          </span>
          <h2 className="login-card__title" style={{ fontSize: '1.5rem' }}>
            Registrar nuevo cliente
          </h2>
          <p className="login-card__sub">
            Los campos marcados con * son obligatorios.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">

          {/* ══ Datos del cliente ══ */}
          <SectionDivider label="Datos del cliente" icon={<IconBuilding />} />

          <div className="lf-field">
            <label htmlFor="nc-name">Nombre del cliente *</label>
            <div className={`lf-input-wrap ${errors.name ? 'is-error' : ''}`}>
              <input id="nc-name" type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Empresa S.A. de C.V."
                autoComplete="organization" disabled={isLoading} />
              <span className="lf-icon"><IconBuilding /></span>
            </div>
            {errors.name && <span className="lf-error">{errors.name}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="lf-field" style={{ margin: 0 }}>
              <label htmlFor="nc-email">Correo del cliente *</label>
              <div className={`lf-input-wrap ${errors.email ? 'is-error' : ''}`}>
                <input id="nc-email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contacto@empresa.com"
                  autoComplete="off" disabled={isLoading} />
                <span className="lf-icon"><IconMail /></span>
              </div>
              {errors.email && <span className="lf-error">{errors.email}</span>}
            </div>

            <div className="lf-field" style={{ margin: 0 }}>
              <label htmlFor="nc-phone">Teléfono del cliente *</label>
              <div className={`lf-input-wrap ${errors.phone ? 'is-error' : ''}`}>
                <input id="nc-phone" type="tel" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+52 55 0000 0000"
                  autoComplete="tel" disabled={isLoading} />
                <span className="lf-icon"><IconPhone /></span>
              </div>
              {errors.phone && <span className="lf-error">{errors.phone}</span>}
            </div>
          </div>

          {/* ══ Contacto principal (owner) ══ */}
          <SectionDivider label="Contacto principal" icon={<IconUser />} />

          <div className="lf-field">
            <label htmlFor="nc-owner-name">Nombre del contacto *</label>
            <div className={`lf-input-wrap ${errors.ownerName ? 'is-error' : ''}`}>
              <input id="nc-owner-name" type="text" value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="Juan Pérez"
                autoComplete="name" disabled={isLoading} />
              <span className="lf-icon"><IconUser /></span>
            </div>
            {errors.ownerName && <span className="lf-error">{errors.ownerName}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="lf-field" style={{ margin: 0 }}>
              <label htmlFor="nc-owner-email">Correo del contacto *</label>
              <div className={`lf-input-wrap ${errors.ownerEmail ? 'is-error' : ''}`}>
                <input id="nc-owner-email" type="email" value={ownerEmail}
                  onChange={e => setOwnerEmail(e.target.value)}
                  placeholder="juan@empresa.com"
                  autoComplete="off" disabled={isLoading} />
                <span className="lf-icon"><IconMail /></span>
              </div>
              {errors.ownerEmail && <span className="lf-error">{errors.ownerEmail}</span>}
            </div>

            <div className="lf-field" style={{ margin: 0 }}>
              <label htmlFor="nc-owner-phone">Teléfono del contacto *</label>
              <div className={`lf-input-wrap ${errors.ownerPhone ? 'is-error' : ''}`}>
                <input id="nc-owner-phone" type="tel" value={ownerPhone}
                  onChange={e => setOwnerPhone(e.target.value)}
                  placeholder="+52 55 0000 0000"
                  autoComplete="tel" disabled={isLoading} />
                <span className="lf-icon"><IconPhone /></span>
              </div>
              {errors.ownerPhone && <span className="lf-error">{errors.ownerPhone}</span>}
            </div>
          </div>

          {/* ══ Tenants ══ */}
          <SectionDivider label="Tenants contratados" icon={<IconTenant />} />

          {errors.tenants && (
            <span className="lf-error" style={{ marginBottom: '0.75rem', display: 'block' }}>
              {errors.tenants}
            </span>
          )}

          {tenants.map((t, i) => (
            <TenantRow
              key={i}
              index={i}
              tenant={t}
              error={errors.tenantRows?.[i]}
              isLoading={isLoading}
              canRemove={tenants.length > 1}
              onChange={(key, val) => updateTenant(i, key, val)}
              onRemove={() => removeTenant(i)}
            />
          ))}

          <button
            type="button"
            disabled={isLoading}
            onClick={addTenant}
            style={{
              width: '100%', marginTop: '0.25rem', marginBottom: '0.25rem',
              background: 'transparent', border: '1.5px dashed #cbd5e1',
              color: '#64748b', borderRadius: '10px',
              padding: '0.55rem', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#0d5c73';
              (e.currentTarget as HTMLButtonElement).style.color = '#0d5c73';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1';
              (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Agregar otro tenant
          </button>

          {/* Mensajes */}
          {errors.general && (
            <div className="lf-general-error">{errors.general}</div>
          )}
          {successMsg && (
            <div style={{
              padding: '0.6rem 0.85rem', borderRadius: '8px',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#166534', fontSize: '0.82rem',
            }}>
              ✓ {successMsg}
            </div>
          )}

          <button
            type="submit"
            className="lf-submit"
            disabled={isLoading}
            style={{ marginTop: '0.75rem' }}
          >
            {isLoading ? 'Registrando cliente...' : 'Registrar cliente →'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NewClient;