/**
 * Frontend Validation Simulation Test
 * This simulates how the frontend validation would work
 */

// Import validation functions (simulate frontend imports)
const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  strongPassword:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  namePattern: /^[a-zA-Z\s]+$/,
};

const COMMON_PASSWORDS = [
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

function checkPasswordStrength(password, name = "") {
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
}

function validateEmail(email) {
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

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateName(name) {
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
}

function formatErrorMessage(error) {
  if (!error) return "An unexpected error occurred";

  // Simulate network error
  if (error.code === "NETWORK_ERROR" || !error.response) {
    return "🌐 Network error. Please check your internet connection and try again.";
  }

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
}

// Test scenarios
function testFrontendValidation() {
  console.log("🎨 Testing Frontend Validation Functions\n");

  // Test 1: Name validation
  console.log("1. Testing name validation:");
  const nameTests = [
    { input: "", expected: false, description: "Empty name" },
    { input: "A", expected: false, description: "Too short name" },
    { input: "John123", expected: false, description: "Name with numbers" },
    { input: "John Smith", expected: true, description: "Valid name" },
    {
      input: "María José",
      expected: true,
      description: "Valid name with accents",
    },
  ];

  nameTests.forEach((test) => {
    const result = validateName(test.input);
    const status = result.isValid === test.expected ? "✅" : "❌";
    console.log(
      `   ${status} ${test.description}: "${test.input}" -> ${
        result.isValid ? "Valid" : result.errors.join(", ")
      }`
    );
  });

  console.log("\n2. Testing email validation:");
  const emailTests = [
    { input: "", expected: false, description: "Empty email" },
    { input: "invalid", expected: false, description: "Invalid format" },
    { input: "test@", expected: false, description: "Incomplete email" },
    { input: "test@example.com", expected: true, description: "Valid email" },
    {
      input: "user.name+tag@example.co.uk",
      expected: true,
      description: "Complex valid email",
    },
  ];

  emailTests.forEach((test) => {
    const result = validateEmail(test.input);
    const status = result.isValid === test.expected ? "✅" : "❌";
    console.log(
      `   ${status} ${test.description}: "${test.input}" -> ${
        result.isValid ? "Valid" : result.errors.join(", ")
      }`
    );
  });

  console.log("\n3. Testing password strength:");
  const passwordTests = [
    { input: "weak", name: "", description: "Very weak password" },
    { input: "password123", name: "", description: "Common password" },
    {
      input: "WeakPass",
      name: "",
      description: "Missing numbers and special chars",
    },
    { input: "StrongPass123!", name: "", description: "Strong password" },
    {
      input: "JohnPass123!",
      name: "John Smith",
      description: "Password containing name",
    },
  ];

  passwordTests.forEach((test) => {
    const result = checkPasswordStrength(test.input, test.name);
    console.log(
      `   📊 ${test.description}: "${test.input}" -> ${result.strength} (${
        result.score
      }/7, ${result.percentage.toFixed(0)}%)`
    );
    const failedChecks = Object.entries(result.checks)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    if (failedChecks.length > 0) {
      console.log(`      Missing: ${failedChecks.join(", ")}`);
    }
  });

  console.log("\n4. Testing error message formatting:");
  const errorTests = [
    {
      error: {
        response: { status: 400, data: { message: "Validation failed" } },
      },
      description: "Validation error",
    },
    {
      error: {
        response: { status: 401, data: { message: "Invalid credentials" } },
      },
      description: "Authentication error",
    },
    {
      error: {
        response: { status: 429, data: { message: "Too many attempts" } },
      },
      description: "Rate limit error",
    },
    {
      error: { code: "NETWORK_ERROR" },
      description: "Network error",
    },
  ];

  errorTests.forEach((test) => {
    const formatted = formatErrorMessage(test.error);
    console.log(`   📝 ${test.description}: ${formatted}`);
  });

  console.log("\n🎉 Frontend validation testing complete!");
}

// Run the frontend validation tests
testFrontendValidation();
