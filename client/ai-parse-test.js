#!/usr/bin/env node

/**
 * Test AI Parsing and Task Creation
 */

import axios from "axios";

const API_BASE = "http://localhost:5001/api";

async function testAIParsing() {
  console.log("🤖 Testing AI Parsing and Task Creation...\n");

  try {
    // 1. Register a new user
    console.log("1. Registering test user...");
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      name: "AI Test User",
      email: "ai.test@example.com",
      password: "TestPassword123!",
    });

    const token = registerResponse.data.token;
    console.log("✅ User registered successfully");

    // 2. Test AI text parsing
    console.log("\n2. Testing AI text parsing...");
    const testText = `
      I need to complete the following tasks this week:
      1. Complete database migration by Thursday
      2. Review security documentation with Sarah by tomorrow
      3. Schedule team meeting for Monday at 9 AM
      4. Code review session today
      5. Deploy to staging environment today
    `;

    const parseResponse = await axios.post(
      `${API_BASE}/tasks/parse`,
      { text: testText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Parse Response:", JSON.stringify(parseResponse.data, null, 2));

    if (
      parseResponse.data.success &&
      parseResponse.data.data.tasks.length > 0
    ) {
      console.log(
        `✅ AI parsed ${parseResponse.data.data.tasks.length} tasks successfully`
      );

      // 3. Create tasks in database
      console.log("\n3. Creating tasks in database...");
      const createResponse = await axios.post(
        `${API_BASE}/tasks`,
        { tasks: parseResponse.data.data.tasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(
        "Create Response:",
        JSON.stringify(createResponse.data, null, 2)
      );

      if (createResponse.data.success) {
        console.log(
          `✅ Created ${createResponse.data.data.totalCreated} tasks in database`
        );

        // 4. Retrieve tasks to verify they were saved
        console.log("\n4. Retrieving tasks from database...");
        const getResponse = await axios.get(`${API_BASE}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Get Response:", JSON.stringify(getResponse.data, null, 2));

        if (
          getResponse.data.success &&
          getResponse.data.data.tasks.length > 0
        ) {
          console.log(
            `✅ Retrieved ${getResponse.data.data.tasks.length} tasks from database`
          );
          console.log(
            "\n🎉 AI Parsing and Task Creation test completed successfully!"
          );
        } else {
          console.log("❌ No tasks found in database");
        }
      } else {
        console.log("❌ Failed to create tasks in database");
      }
    } else {
      console.log("❌ AI parsing failed or returned no tasks");
    }
  } catch (error) {
    console.error("❌ Error during test:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

testAIParsing();
