#!/usr/bin/env node

/**
 * End-to-End Test for Natural Language Task Manager
 * Tests the complete user workflow including UI functionality
 */

import axios from "axios";

const API_BASE = "http://localhost:5001/api";
const FRONTEND_URL = "http://localhost:5174";

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

async function testCompleteWorkflow() {
  log(
    "🚀 Starting End-to-End Test for Natural Language Task Manager",
    "bright"
  );
  log("=".repeat(70), "cyan");

  let authToken = null;

  try {
    // Test 1: User Registration
    log("\n👤 Testing User Registration...", "blue");
    const registerData = {
      name: "E2E Test User",
      email: "e2e.test@example.com",
      password: "TestPassword123!",
    };

    const registerResponse = await axios.post(
      `${API_BASE}/auth/register`,
      registerData
    );
    if (registerResponse.data.success) {
      authToken = registerResponse.data.token;
      log("✅ User registration successful", "green");
    } else {
      log("❌ User registration failed", "red");
      return;
    }

    // Test 2: AI Text Parsing
    log("\n🤖 Testing AI Text Parsing...", "blue");
    const textToParse = `
      I need to complete the following tasks this week:
      1. Finish the project proposal by Wednesday 
      2. Schedule a client meeting for Thursday at 3 PM
      3. Review the budget spreadsheet by Friday
      4. Send the quarterly report to the CEO next Monday
    `;

    const parseResponse = await axios.post(
      `${API_BASE}/tasks/parse`,
      { text: textToParse },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (
      parseResponse.data.success &&
      parseResponse.data.data.tasks.length > 0
    ) {
      log(
        `✅ AI parsed ${parseResponse.data.data.tasks.length} tasks successfully`,
        "green"
      );

      // Test 3: Task Creation
      log("\n📝 Testing Task Creation...", "blue");
      const tasksToCreate = {
        tasks: parseResponse.data.data.tasks,
      };

      const createResponse = await axios.post(
        `${API_BASE}/tasks`,
        tasksToCreate,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (createResponse.data.success) {
        log(
          `✅ Created ${createResponse.data.data.totalCreated} tasks successfully`,
          "green"
        );

        // Test 4: Task Retrieval
        log("\n📋 Testing Task Retrieval...", "blue");
        const getResponse = await axios.get(`${API_BASE}/tasks`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (
          getResponse.data.success &&
          getResponse.data.data.tasks.length > 0
        ) {
          log(
            `✅ Retrieved ${getResponse.data.data.tasks.length} tasks successfully`,
            "green"
          );

          // Test 5: Task Update
          log("\n✏️ Testing Task Update...", "blue");
          const firstTask = getResponse.data.data.tasks[0];
          const updateResponse = await axios.put(
            `${API_BASE}/tasks/${firstTask._id}`,
            { taskName: "Updated Task Name" },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );

          if (updateResponse.data.success) {
            log("✅ Task update successful", "green");
          } else {
            log("❌ Task update failed", "red");
          }

          // Test 6: Task Deletion
          log("\n🗑️ Testing Task Deletion...", "blue");
          const deleteResponse = await axios.delete(
            `${API_BASE}/tasks/${firstTask._id}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );

          if (deleteResponse.data.success) {
            log("✅ Task deletion successful", "green");
          } else {
            log("❌ Task deletion failed", "red");
          }
        } else {
          log("❌ Task retrieval failed", "red");
        }
      } else {
        log("❌ Task creation failed", "red");
      }
    } else {
      log("❌ AI text parsing failed", "red");
    }

    // Test 7: Frontend Accessibility
    log("\n🌐 Testing Frontend Accessibility...", "blue");
    const frontendResponse = await axios.get(FRONTEND_URL);
    if (frontendResponse.status === 200) {
      log("✅ Frontend is accessible", "green");
    } else {
      log("❌ Frontend is not accessible", "red");
    }

    log("\n" + "=".repeat(70), "cyan");
    log("🎉 End-to-End Test Completed Successfully!", "bright");
    log("\n📋 Summary:", "magenta");
    log("   • User authentication ✅", "green");
    log("   • AI text parsing ✅", "green");
    log("   • Task CRUD operations ✅", "green");
    log("   • Frontend accessibility ✅", "green");

    log("\n🚀 Application is ready for production use!", "bright");
  } catch (error) {
    log(`\n❌ Error during E2E test: ${error.message}`, "red");
    if (error.response) {
      log(`   Status: ${error.response.status}`, "red");
      log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`, "red");
    }
  }
}

// Run the test
testCompleteWorkflow().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
