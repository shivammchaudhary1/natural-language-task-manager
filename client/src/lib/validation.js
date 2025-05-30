// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  strongPassword:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  namePattern: /^[a-zA-ZÀ-ÿ\s]+$/, // Updated to support accented characters
};

// Common weak passwords to check against
export const COMMON_PASSWORDS = [
  "password",
  "123456",
  "12345678",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "1234567890",
  "football",
  "iloveyou",
  "sunshine",
  "master",
  "123123",
  "654321",
  "batman",
  "trustno1",
];

// Password strength checker
export const checkPasswordStrength = (password, name = "") => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    notCommon: !COMMON_PASSWORDS.includes(password.toLowerCase()),
    notName: name
      ? !password.toLowerCase().includes(name.toLowerCase().split(" ")[0])
      : true,
  };

  const score = Object.values(checks).filter(Boolean).length;

  let strength = "Very Weak";
  let color = "red";

  if (score >= 6) {
    strength = "Very Strong";
    color = "green";
  } else if (score >= 5) {
    strength = "Strong";
    color = "green";
  } else if (score >= 4) {
    strength = "Good";
    color = "yellow";
  } else if (score >= 3) {
    strength = "Fair";
    color = "orange";
  } else if (score >= 2) {
    strength = "Weak";
    color = "orange";
  }

  return {
    score,
    strength,
    color,
    checks,
    percentage: Math.min((score / 7) * 100, 100),
  };
};

// Email validation with additional checks
export const validateEmail = (email) => {
  const errors = [];

  if (!email) {
    errors.push("Email is required");
    return { isValid: false, errors };
  }

  if (email.length > 100) {
    errors.push("Email must be less than 100 characters");
  }

  if (!ValidationPatterns.email.test(email)) {
    errors.push("Please enter a valid email address");
  }

  // Check for common typos in email domains
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
  ];
  const domain = email.split("@")[1];
  if (domain) {
    const suggestions = commonDomains.filter(
      (d) => d.includes(domain) || domain.includes(d.slice(0, -4))
    );
    if (suggestions.length > 0 && !commonDomains.includes(domain)) {
      errors.push(`Did you mean ${suggestions[0]}?`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Name validation
export const validateName = (name) => {
  const errors = [];

  if (!name || !name.trim()) {
    errors.push("Name is required");
    return { isValid: false, errors };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (trimmedName.length > 50) {
    errors.push("Name must be less than 50 characters");
  }

  if (!ValidationPatterns.namePattern.test(trimmedName)) {
    errors.push("Name can only contain letters and spaces");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: trimmedName,
  };
};

// Format error messages for better UX
export const formatErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred";

  // Handle network errors
  if (error.code === "NETWORK_ERROR" || !error.response) {
    return "🌐 Network error. Please check your internet connection and try again.";
  }

  // Handle specific HTTP status codes
  const status = error.response?.status;
  const message = error.response?.data?.message || error.message;

  switch (status) {
    case 400:
      return `❌ ${message}`;
    case 401:
      return `🔐 ${message}`;
    case 403:
      return `🚫 Access denied. ${message}`;
    case 404:
      return `🔍 ${message}`;
    case 409:
      return `⚠️ ${message}`;
    case 429:
      return `⏰ ${message}`;
    case 500:
    case 502:
    case 503:
      return "🔧 Server error. Please try again later.";
    default:
      return `❌ ${message || "Something went wrong. Please try again."}`;
  }
};
