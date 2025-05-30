/**
 * Test valid registration with proper data
 */

const API_BASE_URL = "http://localhost:5001/api";

async function testValidRegistration() {
  console.log("Testing valid registration with proper data...\n");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John Smith",
        email: `john.smith.${Date.now()}@example.com`,
        password: "SecurePass123!",
      }),
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

    if (response.status === 201 && data.success && data.token && data.user) {
      console.log("✅ PASS - Valid registration works!");

      // Test login with the created user
      console.log("\nTesting login with created user...");
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.user.email,
          password: "SecurePass123!",
        }),
      });

      const loginData = await loginResponse.json();
      console.log(`Login Status: ${loginResponse.status}`);
      console.log(`Login Response:`, JSON.stringify(loginData, null, 2));

      if (
        loginResponse.status === 200 &&
        loginData.success &&
        loginData.token
      ) {
        console.log("✅ PASS - Login works!");
      } else {
        console.log("❌ FAIL - Login failed");
      }
    } else {
      console.log("❌ FAIL - Registration failed");
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
}

testValidRegistration();
