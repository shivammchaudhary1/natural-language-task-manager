// Frontend AI Parsing Test
// This test simulates the frontend AI parsing workflow

import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Setup axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  // In Node.js environment, we'll store token in a variable
  if (global.authToken) {
    config.headers.Authorization = `Bearer ${global.authToken}`;
  }
  return config;
});

const testFrontendAIParsing = async () => {
  console.log("🎯 Testing Frontend AI Parsing Workflow...\n");

  try {
    // 1. Register/Login user
    console.log("1. Creating test user...");
    const authResponse = await api.post("/auth/register", {
      name: "Frontend Test User",
      email: `frontend-test-${Date.now()}@example.com`,
      password: "TestPassword123!",
    });

    // Store token (simulating localStorage)
    const token = authResponse.data.data.token;
    global.authToken = token;
    api.defaults.headers.Authorization = `Bearer ${token}`;
    console.log("✅ User created and authenticated\n");

    // 2. Test parseText function (simulating taskService.parseText)
    console.log("2. Testing AI text parsing...");
    const textData = {
      text: "I need to complete the quarterly report by next Friday. Also, schedule a meeting with the development team for Monday at 2 PM to discuss the new features.",
    };

    const parseResponse = await api.post("/tasks/parse", textData);
    console.log(
      "Parse API Response:",
      JSON.stringify(parseResponse.data, null, 2)
    );

    // Check if response structure matches frontend expectations
    if (
      parseResponse.data &&
      parseResponse.data.data &&
      parseResponse.data.data.tasks
    ) {
      const parsedTasks = parseResponse.data.data.tasks;
      console.log(`✅ Successfully parsed ${parsedTasks.length} tasks\n`);

      // 3. Test bulkCreateTasks function (simulating taskService.bulkCreateTasks)
      console.log("3. Testing bulk task creation...");
      const createResponse = await api.post("/tasks", {
        tasks: parsedTasks,
      });

      console.log(
        "Create API Response:",
        JSON.stringify(createResponse.data, null, 2)
      );

      if (
        createResponse.data &&
        createResponse.data.data &&
        createResponse.data.data.tasks
      ) {
        const createdTasks = createResponse.data.data.tasks;
        console.log(`✅ Successfully created ${createdTasks.length} tasks\n`);

        // 4. Verify tasks can be retrieved
        console.log("4. Retrieving created tasks...");
        const getResponse = await api.get("/tasks");
        console.log(
          "Get Tasks Response:",
          JSON.stringify(getResponse.data, null, 2)
        );

        if (
          getResponse.data &&
          getResponse.data.data &&
          getResponse.data.data.tasks
        ) {
          console.log(
            `✅ Successfully retrieved ${getResponse.data.data.tasks.length} tasks\n`
          );
          console.log("🎉 Frontend AI Parsing Workflow Test PASSED!");
        } else {
          console.log("❌ Failed to retrieve tasks - Response structure issue");
        }
      } else {
        console.log("❌ Failed to create tasks - Response structure issue");
        console.log("Expected: response.data.data.tasks");
        console.log("Got:", Object.keys(createResponse.data));
      }
    } else {
      console.log("❌ Failed to parse tasks - Response structure issue");
      console.log("Expected: response.data.data.tasks");
      console.log("Got:", Object.keys(parseResponse.data));
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
};

testFrontendAIParsing();
