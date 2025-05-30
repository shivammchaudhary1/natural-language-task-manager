import { useState, useEffect } from "react";
import {
  validateEmail,
  validateName,
  checkPasswordStrength,
} from "@/lib/validation";

export const useFormValidation = (formData, formType = "signup") => {
  const [validationState, setValidationState] = useState({
    name: { isValid: null, errors: [] },
    email: { isValid: null, errors: [] },
    password: { isValid: null, errors: [], strength: null },
    confirmPassword: { isValid: null, errors: [] },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const newValidationState = { ...validationState };
    let formValid = true;

    // Validate name (for signup only)
    if (formType === "signup" && formData.name !== undefined) {
      const nameValidation = validateName(formData.name);
      newValidationState.name = nameValidation;
      if (!nameValidation.isValid) formValid = false;
    }

    // Validate email
    if (formData.email !== undefined) {
      const emailValidation = validateEmail(formData.email);
      newValidationState.email = emailValidation;
      if (!emailValidation.isValid) formValid = false;
    }

    // Validate password
    if (formData.password !== undefined) {
      const passwordStrength = checkPasswordStrength(
        formData.password,
        formData.name
      );
      const passwordErrors = [];

      if (formData.password && passwordStrength.score < 4) {
        if (!passwordStrength.checks.length)
          passwordErrors.push("Password must be at least 8 characters");
        if (!passwordStrength.checks.uppercase)
          passwordErrors.push("Add an uppercase letter");
        if (!passwordStrength.checks.lowercase)
          passwordErrors.push("Add a lowercase letter");
        if (!passwordStrength.checks.number)
          passwordErrors.push("Add a number");
        if (!passwordStrength.checks.special)
          passwordErrors.push("Add a special character");
        if (!passwordStrength.checks.notCommon)
          passwordErrors.push("Choose a less common password");
        if (!passwordStrength.checks.notName)
          passwordErrors.push("Password should not contain your name");
      }

      newValidationState.password = {
        isValid: formData.password ? passwordStrength.score >= 4 : null,
        errors: passwordErrors,
        strength: passwordStrength,
      };

      if (formData.password && passwordStrength.score < 4) formValid = false;
    }

    // Validate confirm password (for signup only)
    if (formType === "signup" && formData.confirmPassword !== undefined) {
      const passwordsMatch = formData.password === formData.confirmPassword;
      newValidationState.confirmPassword = {
        isValid: formData.confirmPassword ? passwordsMatch : null,
        errors: passwordsMatch ? [] : ["Passwords do not match"],
      };

      if (formData.confirmPassword && !passwordsMatch) formValid = false;
    }

    // Check if all required fields are filled
    if (formType === "signup") {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        formValid = false;
      }
    } else {
      if (!formData.email || !formData.password) {
        formValid = false;
      }
    }

    setValidationState(newValidationState);
    setIsFormValid(formValid);
  }, [formData, formType]);

  return {
    validationState,
    isFormValid,
  };
};
