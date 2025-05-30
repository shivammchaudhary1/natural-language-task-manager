// Test the new parse-and-create endpoint
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const testParseAndCreate = async () => {
  console.log("🔧 Testing Parse-and-Create Endpoint...\n");

  try {
    // 1. Register/Login user
    console.log("1. Creating test user...");
    const authResponse = await api.post("/auth/register", {
      name: "Parse Test User",
      email: `parse-test-${Date.now()}@example.com`,
      password: "TestPassword123!",
    });

    const token = authResponse.data.token;
    api.defaults.headers.Authorization = `Bearer ${token}`;
    console.log("Auth Response:", JSON.stringify(authResponse.data, null, 2));
    console.log("✅ User created and authenticated\n");

    // 2. Test the new parse-and-create endpoint
    console.log("2. Testing parse-and-create endpoint...");
    const textData = {
      text: "I need to complete the database migration by next Friday. Also, schedule a team meeting for Monday at 2 PM. Review security documentation with Sarah by tomorrow.",
    };

    const response = await api.post("/tasks/parse-and-create", textData);
    console.log(
      "Parse-and-Create Response:",
      JSON.stringify(response.data, null, 2)
    );

    if (response.data && response.data.data && response.data.data.tasks) {
      const createdTasks = response.data.data.tasks;
      console.log(
        `✅ Successfully parsed and created ${createdTasks.length} tasks in database\n`
      );

      // 3. Verify tasks are saved by retrieving them
      console.log("3. Verifying tasks are saved in database...");
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
          `✅ Successfully retrieved ${getResponse.data.data.tasks.length} tasks from database\n`
        );
        console.log("🎉 Parse-and-Create Endpoint Test PASSED!");

        // Show the saved tasks
        console.log("\n📋 Saved Tasks:");
        getResponse.data.data.tasks.forEach((task, index) => {
          console.log(
            `${index + 1}. ${task.taskName} (${task.priority}) - Due: ${
              task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"
            }`
          );
        });
      } else {
        console.log("❌ Failed to retrieve saved tasks");
      }
    } else {
      console.log("❌ Failed to parse and create tasks");
      console.log("Response structure:", Object.keys(response.data));
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
};

testParseAndCreate();
