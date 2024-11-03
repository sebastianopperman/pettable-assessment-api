type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type FieldValidation = {
  value: unknown;
  name: string;
  type: "string" | "integer";
  required?: boolean;
};

export const validateFields = (fields: FieldValidation[]): ValidationResult => {
  const errors: string[] = [];

  for (const field of fields) {
    if (field.required && !field.value) {
      errors.push(field.name);
      continue;
    }

    if (field.value) {
      if (field.type === "string" && typeof field.value !== "string") {
        errors.push(`${field.name} must be a string`);
      } else if (field.type === "integer") {
        if (!Number.isInteger(Number(field.value))) {
          errors.push(`${field.name} must be an integer`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
