/**
 * Quick validation test to check specific scenarios
 */

const API_BASE_URL = "http://localhost:5001/api";

async function testSpecificValidations() {
  console.log("🧪 Testing specific validation scenarios...\n");

  // Test 1: Common password validation
  console.log("1. Testing common password validation...");
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `test.${Date.now()}@example.com`,
        password: "password123",
      }),
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(response.status === 400 ? "✅ PASS" : "❌ FAIL");
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }

  console.log("\n---\n");

  // Test 2: Invalid name validation
  console.log("2. Testing invalid name validation...");
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test123!",
        email: `test.${Date.now()}@example.com`,
        password: "ValidPass123!",
      }),
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(response.status === 400 ? "✅ PASS" : "❌ FAIL");
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }

  console.log("\n---\n");

  // Test 3: Valid registration
  console.log("3. Testing valid registration...");
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Valid Test User",
        email: `valid.test.${Date.now()}@example.com`,
        password: "ValidPass123!",
      }),
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(response.status === 201 ? "✅ PASS" : "❌ FAIL");
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
}

testSpecificValidations();
