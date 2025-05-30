#!/usr/bin/env node

/**
 * Frontend Test Suite for Natural Language Task Manager
 * Tests client-side functionality including services, stores, and API integration
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const API_BASE = "http://localhost:5001/api";
const FRONTEND_URL = "http://localhost:5174";
const TEST_EMAIL = "testuser@example.com";
const TEST_PASSWORD = "TestPassword123!";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test Results Tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function addTestResult(name, passed, message = "") {
  testResults.tests.push({ name, passed, message });
  if (passed) {
    testResults.passed++;
    log(`✅ ${name}`, "green");
  } else {
    testResults.failed++;
    log(`❌ ${name}: ${message}`, "red");
  }
  if (message && passed) {
    log(`   ${message}`, "cyan");
  }
}

let authToken = null;

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    const errorMessage = error.response?.data
      ? typeof error.response.data === "object"
        ? JSON.stringify(error.response.data)
        : error.response.data
      : error.message;

    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
    };
  }
}

// Test 1: Frontend Build Artifacts
async function testFrontendFiles() {
  log("\n🏗️ Testing Frontend File Structure...", "blue");

  const requiredFiles = [
    "src/App.jsx",
    "src/main.jsx",
    "src/index.css",
    "package.json",
    "vite.config.js",
    "tailwind.config.js",
    "src/pages/Home.jsx",
    "src/pages/Login.jsx",
    "src/pages/Signup.jsx",
    "src/pages/Dashboard.jsx",
    "src/store/authStore.js",
    "src/store/taskStore.js",
    "src/services/api.js",
    "src/services/authService.js",
    "src/services/taskService.js",
  ];

  let allFilesExist = true;
  const missingFiles = [];

  for (const file of requiredFiles) {
    const filePath = path.join(path.dirname(__filename), file);
    if (!fs.existsSync(filePath)) {
      allFilesExist = false;
      missingFiles.push(file);
    }
  }

  if (allFilesExist) {
    addTestResult(
      "Frontend File Structure",
      true,
      `All ${requiredFiles.length} required files found`
    );
  } else {
    addTestResult(
      "Frontend File Structure",
      false,
      `Missing files: ${missingFiles.join(", ")}`
    );
  }
}

// Test 2: Environment Configuration
async function testEnvironmentConfig() {
  log("\n🔧 Testing Environment Configuration...", "blue");

  const envPath = path.join(path.dirname(__filename), ".env");
  if (!fs.existsSync(envPath)) {
    addTestResult("Environment Configuration", false, ".env file not found");
    return;
  }

  try {
    const envContent = fs.readFileSync(envPath, "utf8");
    const requiredVars = [
      "VITE_API_URL",
      "VITE_FRONTEND_URL",
      "VITE_BACKEND_URL",
    ];
    const missingVars = [];

    for (const varName of requiredVars) {
      if (!envContent.includes(varName)) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length === 0) {
      addTestResult(
        "Environment Configuration",
        true,
        "All required environment variables found"
      );
    } else {
      addTestResult(
        "Environment Configuration",
        false,
        `Missing variables: ${missingVars.join(", ")}`
      );
    }
  } catch (error) {
    addTestResult(
      "Environment Configuration",
      false,
      `Error reading .env: ${error.message}`
    );
  }
}

// Test 3: Package Dependencies
async function testPackageDependencies() {
  log("\n📦 Testing Package Dependencies...", "blue");

  try {
    const packagePath = path.join(path.dirname(__filename), "package.json");
    const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    const requiredDeps = [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "zustand",
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
      "tailwindcss",
      "lucide-react",
      "sonner",
      "date-fns",
    ];

    const allDeps = {
      ...packageContent.dependencies,
      ...packageContent.devDependencies,
    };
    const missingDeps = requiredDeps.filter((dep) => !allDeps[dep]);

    if (missingDeps.length === 0) {
      addTestResult(
        "Package Dependencies",
        true,
        `All ${requiredDeps.length} required dependencies found`
      );
    } else {
      addTestResult(
        "Package Dependencies",
        false,
        `Missing dependencies: ${missingDeps.join(", ")}`
      );
    }
  } catch (error) {
    addTestResult(
      "Package Dependencies",
      false,
      `Error reading package.json: ${error.message}`
    );
  }
}

// Test 4: Frontend Server Accessibility
async function testFrontendServer() {
  log("\n🌐 Testing Frontend Server Accessibility...", "blue");

  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    if (response.status === 200) {
      addTestResult(
        "Frontend Server",
        true,
        `Server responding on ${FRONTEND_URL}`
      );
    } else {
      addTestResult(
        "Frontend Server",
        false,
        `Unexpected status: ${response.status}`
      );
    }
  } catch (error) {
    addTestResult(
      "Frontend Server",
      false,
      `Cannot reach frontend: ${error.message}`
    );
  }
}

// Test 5: Backend API Connectivity
async function testBackendConnectivity() {
  log("\n🔗 Testing Backend API Connectivity...", "blue");

  const result = await apiRequest("GET", "http://localhost:5001/");
  if (result.success) {
    addTestResult(
      "Backend API Connectivity",
      true,
      "Backend API is accessible"
    );
  } else {
    addTestResult(
      "Backend API Connectivity",
      false,
      `Backend not accessible: ${result.error}`
    );
  }
}

// Test 6: Auth Service Functions
async function testAuthService() {
  log("\n🔐 Testing Auth Service...", "blue");

  // Test user registration
  const registerData = {
    name: "Frontend Test User",
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  };

  const registerResult = await apiRequest(
    "POST",
    "/auth/register",
    registerData
  );

  if (registerResult.success || registerResult.status === 400) {
    // Test user login
    const loginData = {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    };

    const loginResult = await apiRequest("POST", "/auth/login", loginData);

    if (loginResult.success && loginResult.data.token) {
      authToken = loginResult.data.token;
      addTestResult("Auth Service - Login", true, "Authentication successful");

      // Test profile retrieval
      const profileResult = await apiRequest("GET", "/auth/me");
      if (profileResult.success && profileResult.data.user) {
        addTestResult(
          "Auth Service - Profile",
          true,
          "Profile retrieval successful"
        );
      } else {
        addTestResult(
          "Auth Service - Profile",
          false,
          "Profile retrieval failed"
        );
      }
    } else {
      addTestResult(
        "Auth Service - Login",
        false,
        `Login failed: ${loginResult.error}`
      );
    }
  } else {
    addTestResult(
      "Auth Service - Registration",
      false,
      `Registration failed: ${registerResult.error}`
    );
  }
}

// Test 7: Task Service Functions
async function testTaskService() {
  log("\n📝 Testing Task Service...", "blue");

  if (!authToken) {
    addTestResult("Task Service", false, "No authentication token available");
    return;
  }

  // Test task creation
  const taskData = {
    tasks: [
      {
        taskName: "Frontend Test Task",
        assignee: "Test User",
        priority: "P2",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  const createResult = await apiRequest("POST", "/tasks", taskData);

  if (
    createResult.success &&
    createResult.data &&
    createResult.data.data &&
    createResult.data.data.tasks &&
    createResult.data.data.tasks.length > 0
  ) {
    const taskId = createResult.data.data.tasks[0]._id;
    addTestResult("Task Service - Create", true, "Task creation successful");

    // Test task retrieval
    const getResult = await apiRequest("GET", "/tasks");
    if (
      getResult.success &&
      getResult.data.data &&
      Array.isArray(getResult.data.data.tasks)
    ) {
      addTestResult(
        "Task Service - Get All",
        true,
        `Retrieved ${getResult.data.data.tasks.length} tasks`
      );

      // Test task update
      const updateData = { taskName: "Updated Frontend Test Task" };
      const updateResult = await apiRequest(
        "PUT",
        `/tasks/${taskId}`,
        updateData
      );

      if (updateResult.success) {
        addTestResult("Task Service - Update", true, "Task update successful");
      } else {
        addTestResult(
          "Task Service - Update",
          false,
          `Update failed: ${updateResult.error}`
        );
      }

      // Test task deletion
      const deleteResult = await apiRequest("DELETE", `/tasks/${taskId}`);
      if (deleteResult.success) {
        addTestResult(
          "Task Service - Delete",
          true,
          "Task deletion successful"
        );
      } else {
        addTestResult(
          "Task Service - Delete",
          false,
          `Delete failed: ${deleteResult.error}`
        );
      }
    } else {
      addTestResult(
        "Task Service - Get All",
        false,
        "Failed to retrieve tasks"
      );
    }
  } else {
    addTestResult(
      "Task Service - Create",
      false,
      `Task creation failed: ${createResult.error || "Unknown error"}`
    );
  }
}

// Test 8: AI Text Parsing
async function testAITextParsing() {
  log("\n🤖 Testing AI Text Parsing...", "blue");

  if (!authToken) {
    addTestResult(
      "AI Text Parsing",
      false,
      "No authentication token available"
    );
    return;
  }

  const testText =
    "I need to finish the quarterly report by Friday and schedule a team meeting for next Monday at 2 PM. Also, don't forget to review the budget proposals by end of week.";

  const parseResult = await apiRequest("POST", "/tasks/parse", {
    text: testText,
  });

  if (
    parseResult.success &&
    parseResult.data.data &&
    parseResult.data.data.tasks &&
    parseResult.data.data.tasks.length > 0
  ) {
    addTestResult(
      "AI Text Parsing",
      true,
      `Parsed ${parseResult.data.data.tasks.length} tasks from text`
    );
  } else {
    addTestResult(
      "AI Text Parsing",
      false,
      `Parsing failed: ${parseResult.error || "Unknown error"}`
    );
  }
}

// Test 9: Component Syntax Validation
async function testComponentSyntax() {
  log("\n⚛️ Testing Component Syntax...", "blue");

  const componentFiles = [
    "src/App.jsx",
    "src/pages/Home.jsx",
    "src/pages/Login.jsx",
    "src/pages/Signup.jsx",
    "src/pages/Dashboard.jsx",
    "src/components/TaskList.jsx",
    "src/components/CreateTaskDialog.jsx",
    "src/components/ParseTextDialog.jsx",
    "src/components/ProtectedRoute.jsx",
  ];

  let syntaxErrors = [];

  for (const file of componentFiles) {
    const filePath = path.join(path.dirname(__filename), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf8");

        // Basic syntax checks
        const issues = [];

        // Check for common React issues
        if (
          content.includes("import React") &&
          !content.includes('from "react"')
        ) {
          issues.push("Invalid React import");
        }

        // Check for unterminated strings
        const singleQuotes = (content.match(/'/g) || []).length;
        const doubleQuotes = (content.match(/"/g) || []).length;
        const backticks = (content.match(/`/g) || []).length;

        if (
          singleQuotes % 2 !== 0 ||
          doubleQuotes % 2 !== 0 ||
          backticks % 2 !== 0
        ) {
          issues.push("Unterminated strings detected");
        }

        if (issues.length > 0) {
          syntaxErrors.push(`${file}: ${issues.join(", ")}`);
        }
      } catch (error) {
        syntaxErrors.push(`${file}: ${error.message}`);
      }
    }
  }

  if (syntaxErrors.length === 0) {
    addTestResult(
      "Component Syntax",
      true,
      `All ${componentFiles.length} components passed basic syntax checks`
    );
  } else {
    addTestResult(
      "Component Syntax",
      false,
      `Syntax issues found: ${syntaxErrors.join("; ")}`
    );
  }
}

// Test 10: Store Configuration
async function testStoreConfiguration() {
  log("\n🗄️ Testing Store Configuration...", "blue");

  const stores = ["src/store/authStore.js", "src/store/taskStore.js"];
  let storeIssues = [];

  for (const store of stores) {
    const storePath = path.join(path.dirname(__filename), store);
    if (fs.existsSync(storePath)) {
      try {
        const content = fs.readFileSync(storePath, "utf8");

        // Check for Zustand import
        if (!content.includes("zustand")) {
          storeIssues.push(`${store}: Missing Zustand import`);
        }

        // Check for create function
        if (!content.includes("create(")) {
          storeIssues.push(`${store}: Missing create function`);
        }

        // Check for export
        if (!content.includes("export")) {
          storeIssues.push(`${store}: Missing export`);
        }
      } catch (error) {
        storeIssues.push(`${store}: ${error.message}`);
      }
    } else {
      storeIssues.push(`${store}: File not found`);
    }
  }

  if (storeIssues.length === 0) {
    addTestResult(
      "Store Configuration",
      true,
      "All stores properly configured"
    );
  } else {
    addTestResult("Store Configuration", false, storeIssues.join("; "));
  }
}

// Test 11: CSS and Styling
async function testStyling() {
  log("\n🎨 Testing CSS and Styling...", "blue");

  const cssPath = path.join(path.dirname(__filename), "src/index.css");
  const tailwindPath = path.join(
    path.dirname(__filename),
    "tailwind.config.js"
  );

  let stylingIssues = [];

  // Check main CSS file
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, "utf8");
    if (!cssContent.includes("@tailwind")) {
      stylingIssues.push("Missing Tailwind CSS directives in index.css");
    }
    if (
      !cssContent.includes("--midnight-blue") ||
      !cssContent.includes("--teal")
    ) {
      stylingIssues.push("Missing custom CSS variables");
    }
  } else {
    stylingIssues.push("index.css not found");
  }

  // Check Tailwind config
  if (fs.existsSync(tailwindPath)) {
    const tailwindContent = fs.readFileSync(tailwindPath, "utf8");
    if (
      !tailwindContent.includes("midnight-blue") ||
      !tailwindContent.includes("teal")
    ) {
      stylingIssues.push("Missing custom colors in Tailwind config");
    }
  } else {
    stylingIssues.push("tailwind.config.js not found");
  }

  if (stylingIssues.length === 0) {
    addTestResult("CSS and Styling", true, "Styling configuration is correct");
  } else {
    addTestResult("CSS and Styling", false, stylingIssues.join("; "));
  }
}

// Main test runner
async function runFrontendTests() {
  log(
    "🚀 Starting Frontend Test Suite for Natural Language Task Manager",
    "bright"
  );
  log("=".repeat(80), "cyan");

  const startTime = Date.now();

  try {
    // Infrastructure tests
    await testFrontendFiles();
    await testEnvironmentConfig();
    await testPackageDependencies();
    await testComponentSyntax();
    await testStoreConfiguration();
    await testStyling();

    // Server connectivity tests
    await testFrontendServer();
    await testBackendConnectivity();

    // Functional tests (only if backend is accessible)
    if (
      testResults.tests.find((t) => t.name === "Backend API Connectivity")
        ?.passed
    ) {
      await testAuthService();
      await testTaskService();
      await testAITextParsing();
    } else {
      log(
        "\n⚠️ Skipping functional tests due to backend connectivity issues",
        "yellow"
      );
    }
  } catch (error) {
    log(`\n💥 Unexpected error during testing: ${error.message}`, "red");
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  // Final Results
  log("\n" + "=".repeat(80), "cyan");
  log("📊 FRONTEND TEST RESULTS SUMMARY", "bright");
  log("=".repeat(80), "cyan");

  log(`✅ Passed: ${testResults.passed}`, "green");
  log(`❌ Failed: ${testResults.failed}`, "red");
  log(`⏱️  Duration: ${duration.toFixed(2)}s`, "blue");

  const successRate =
    testResults.passed + testResults.failed > 0
      ? (testResults.passed / (testResults.passed + testResults.failed)) * 100
      : 0;
  log(`📈 Success Rate: ${successRate.toFixed(1)}%`, "magenta");

  if (testResults.failed > 0) {
    log("\n💡 Failed Tests:", "yellow");
    testResults.tests
      .filter((test) => !test.passed)
      .forEach((test) => log(`   • ${test.name}: ${test.message}`, "yellow"));

    log("\n🔧 Recommendations:", "cyan");
    log("   • Check console for any JavaScript errors", "cyan");
    log("   • Verify all imports are correct", "cyan");
    log("   • Ensure backend server is running on port 5001", "cyan");
    log("   • Check network connectivity between frontend and backend", "cyan");
  }

  log("\n🎉 Frontend testing completed!", "bright");

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFrontendTests().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { runFrontendTests, testResults };
