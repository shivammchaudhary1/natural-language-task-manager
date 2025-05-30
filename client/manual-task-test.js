#!/usr/bin/env node

/**
 * Quick test for manual task creation fix
 */

import axios from "axios";

const API_BASE = "http://localhost:5001/api";

async function testManualTaskCreation() {
  console.log("🧪 Testing Manual Task Creation Fix...\n");

  try {
    // 1. Register/Login to get token
    console.log("1. Getting authentication token...");
    const loginData = {
      email: "manual.test@example.com",
      password: "TestPassword123!",
    };

    let authToken;
    try {
      // Try to register first
      const registerData = {
        name: "Manual Test User",
        ...loginData,
      };
      const registerResponse = await axios.post(
        `${API_BASE}/auth/register`,
        registerData
      );
      authToken = registerResponse.data.token;
      console.log("✅ New user registered");
    } catch (error) {
      // If user exists, login instead
      const loginResponse = await axios.post(
        `${API_BASE}/auth/login`,
        loginData
      );
      authToken = loginResponse.data.token;
      console.log("✅ User logged in");
    }

    // 2. Test the OLD format (should fail)
    console.log("\n2. Testing old format (should fail)...");
    try {
      const oldFormatData = {
        title: "Test Task",
        description: "This is a test task",
        priority: "P2",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await axios.post(`${API_BASE}/tasks`, oldFormatData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("❌ Old format should have failed but didn't");
    } catch (error) {
      console.log(
        "✅ Old format correctly failed:",
        error.response.data.message
      );
    }

    // 3. Test the NEW format (should work)
    console.log("\n3. Testing new format (should work)...");
    try {
      const newFormatData = {
        tasks: [
          {
            taskName: "Fixed Format Test Task",
            assignee: "Manual Test User",
            priority: "P2",
            dueDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            confidence: 1.0,
          },
        ],
      };

      const response = await axios.post(`${API_BASE}/tasks`, newFormatData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("✅ New format works:", response.data.message);
      console.log("   Created tasks:", response.data.data.totalCreated);
    } catch (error) {
      console.log(
        "❌ New format failed:",
        error.response?.data?.message || error.message
      );
    }

    // 4. Test our taskService transformation
    console.log("\n4. Testing taskService transformation...");
    try {
      // Simulate what CreateTaskDialog sends
      const frontendData = {
        title: "Frontend Test Task",
        description: "This comes from the frontend form",
        priority: "P1",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        assignee: "Test Assignee",
      };

      // Transform it like our fixed taskService does
      const formattedTask = {
        taskName: frontendData.title || frontendData.taskName,
        assignee: frontendData.assignee || "Current User",
        dueDate: frontendData.dueDate,
        priority: frontendData.priority || "P3",
        confidence: frontendData.confidence || 1.0,
      };

      const requestBody = {
        tasks: [formattedTask],
      };

      const response = await axios.post(`${API_BASE}/tasks`, requestBody, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(
        "✅ TaskService transformation works:",
        response.data.message
      );
      console.log("   Task name:", response.data.data.tasks[0].taskName);
      console.log("   Assignee:", response.data.data.tasks[0].assignee);
    } catch (error) {
      console.log(
        "❌ TaskService transformation failed:",
        error.response?.data?.message || error.message
      );
    }

    console.log("\n🎉 Manual task creation fix test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testManualTaskCreation();
