type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type FieldValidation = {
  value: unknown;
  name: string;
  type: "string";
  required?: boolean;
};

export const validateFields = (fields: FieldValidation[]): ValidationResult => {
  const errors: string[] = [];

  for (const field of fields) {
    if (field.required && !field.value) {
      errors.push(field.name);
      continue;
    }

    if (field.value && typeof field.value !== field.type) {
      errors.push(`${field.name} must be a ${field.type}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
