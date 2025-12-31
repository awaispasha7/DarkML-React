import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: string | number;
  step?: string | number;
  max?: string | number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options,
  min,
  step,
  max,
}) => {
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          className="input"
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={4}
        />
      );
    }

    if (type === 'select' && options) {
      return (
        <select
          id={name}
          name={name}
          className="input"
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        className="input"
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        max={max}
      />
    );
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="label">
        {label}
        {required && <span style={{ color: 'var(--danger-color)' }}> *</span>}
      </label>
      {renderInput()}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

