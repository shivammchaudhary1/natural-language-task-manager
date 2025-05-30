/**
 * Enhanced Authentication Validation Test Suite
 * Tests all the validation improvements for signup and login
 */

const API_BASE_URL = "http://localhost:5001/api";

class ValidationTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, status = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${status.toUpperCase()}: ${message}`;
    console.log(logMessage);

    if (status === "pass") this.passed++;
    if (status === "fail") this.failed++;

    this.results.push({ timestamp, message, status });
  }

  async testSignupValidation() {
    this.log("🧪 Testing Signup Validation", "info");

    // Test 1: Empty fields
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.status === 400) {
        this.log("✅ Empty fields validation works", "pass");
      } else {
        this.log("❌ Empty fields validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Empty fields test error: ${error.message}`, "fail");
    }

    // Test 2: Invalid email format
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "invalid-email",
          password: "ValidPass123!",
        }),
      });

      if (response.status === 400) {
        this.log("✅ Invalid email format validation works", "pass");
      } else {
        this.log("❌ Invalid email format validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Invalid email test error: ${error.message}`, "fail");
    }

    // Test 3: Weak password
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "weak",
        }),
      });

      if (response.status === 400) {
        this.log("✅ Weak password validation works", "pass");
      } else {
        this.log("❌ Weak password validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Weak password test error: ${error.message}`, "fail");
    }

    // Test 4: Common password
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        }),
      });

      if (response.status === 400) {
        this.log("✅ Common password validation works", "pass");
      } else {
        this.log("❌ Common password validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Common password test error: ${error.message}`, "fail");
    }

    // Test 5: Invalid name (numbers/special chars)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test123!",
          email: "test@example.com",
          password: "ValidPass123!",
        }),
      });

      if (response.status === 400) {
        this.log("✅ Invalid name validation works", "pass");
      } else {
        this.log("❌ Invalid name validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Invalid name test error: ${error.message}`, "fail");
    }

    // Test 6: Valid signup data
    const testEmail = `test.user.${Date.now()}@example.com`;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Valid Test User",
          email: testEmail,
          password: "ValidPass123!",
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        if (data.success && data.token && data.user) {
          this.log("✅ Valid signup works correctly", "pass");
          return { email: testEmail, token: data.token };
        } else {
          this.log("❌ Valid signup response format incorrect", "fail");
        }
      } else {
        this.log(
          `❌ Valid signup failed with status: ${response.status}`,
          "fail"
        );
      }
    } catch (error) {
      this.log(`❌ Valid signup test error: ${error.message}`, "fail");
    }

    return null;
  }

  async testLoginValidation() {
    this.log("🔐 Testing Login Validation", "info");

    // Test 1: Empty credentials
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.status === 400) {
        this.log("✅ Empty credentials validation works", "pass");
      } else {
        this.log("❌ Empty credentials validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Empty credentials test error: ${error.message}`, "fail");
    }

    // Test 2: Invalid email format
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "invalid-email",
          password: "somepassword",
        }),
      });

      if (response.status === 400) {
        this.log("✅ Invalid email format in login validation works", "pass");
      } else {
        this.log("❌ Invalid email format in login validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Invalid email login test error: ${error.message}`, "fail");
    }

    // Test 3: Non-existent user
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "ValidPass123!",
        }),
      });

      if (response.status === 401) {
        this.log("✅ Non-existent user validation works", "pass");
      } else {
        this.log("❌ Non-existent user validation failed", "fail");
      }
    } catch (error) {
      this.log(`❌ Non-existent user test error: ${error.message}`, "fail");
    }
  }

  async testDuplicateEmailValidation() {
    this.log("📧 Testing Duplicate Email Validation", "info");

    const testEmail = `duplicate.test.${Date.now()}@example.com`;

    // First, create a user
    try {
      const response1 = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "First User",
          email: testEmail,
          password: "ValidPass123!",
        }),
      });

      if (response1.status === 201) {
        // Now try to create another user with the same email
        const response2 = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Second User",
            email: testEmail,
            password: "AnotherValidPass123!",
          }),
        });

        if (response2.status === 400) {
          const data = await response2.json();
          if (data.message && data.message.toLowerCase().includes("email")) {
            this.log("✅ Duplicate email validation works", "pass");
          } else {
            this.log("❌ Duplicate email validation message incorrect", "fail");
          }
        } else {
          this.log("❌ Duplicate email validation failed", "fail");
        }
      } else {
        this.log("❌ Could not create first user for duplicate test", "fail");
      }
    } catch (error) {
      this.log(`❌ Duplicate email test error: ${error.message}`, "fail");
    }
  }

  async testRateLimiting() {
    this.log("⏰ Testing Rate Limiting", "info");

    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "wrongpassword",
          }),
        })
      );
    }

    try {
      const responses = await Promise.all(promises);
      const rateLimited = responses.some((response) => response.status === 429);

      if (rateLimited) {
        this.log("✅ Rate limiting is working", "pass");
      } else {
        this.log(
          "⚠️ Rate limiting might not be working (or limit is high)",
          "info"
        );
      }
    } catch (error) {
      this.log(`❌ Rate limiting test error: ${error.message}`, "fail");
    }
  }

  async runAllTests() {
    this.log("🚀 Starting Enhanced Authentication Validation Tests", "info");

    await this.testSignupValidation();
    await this.testLoginValidation();
    await this.testDuplicateEmailValidation();
    await this.testRateLimiting();

    this.log(
      `📊 Test Results: ${this.passed} passed, ${this.failed} failed`,
      "info"
    );

    if (this.failed === 0) {
      this.log("🎉 All validation tests passed!", "pass");
    } else {
      this.log(
        `⚠️ ${this.failed} tests failed. Please review the validation implementation.`,
        "fail"
      );
    }

    return {
      passed: this.passed,
      failed: this.failed,
      total: this.passed + this.failed,
      results: this.results,
    };
  }
}

// Run the tests
const tester = new ValidationTester();
tester
  .runAllTests()
  .then((results) => {
    console.log("\n=== FINAL RESULTS ===");
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(
      `Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`
    );
  })
  .catch((error) => {
    console.error("Test suite error:", error);
  });
