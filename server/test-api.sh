#!/usr/bin/env zsh

# Test script for Natural Language Task Manager API
# Make sure the server is running before executing this script

BASE_URL="http://localhost:5001"
API_BASE="${BASE_URL}/api"

echo "🚀 Testing Natural Language Task Manager API"
echo "============================================="

# Test 1: Register a new user
echo "\n📝 Test 1: Register a new user"
REGISTER_RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }')

echo "Response: $REGISTER_RESPONSE"

# Extract token from response
TOKEN=$(echo $REGISTER_RESPONSE | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('token', ''))
except:
    print('')
")

if [ -z "$TOKEN" ]; then
  echo "❌ Registration failed or token not found"
  exit 1
fi

echo "✅ Registration successful, token obtained"

# Test 2: Login with the same user
echo "\n🔐 Test 2: Login with the same user"
LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"

# Test 3: Get user profile
echo "\n👤 Test 3: Get user profile"
PROFILE_RESPONSE=$(curl -s -X GET "${API_BASE}/auth/me" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $PROFILE_RESPONSE"

# Test 4: Parse natural language text
echo "\n🧠 Test 4: Parse natural language text"
PARSE_RESPONSE=$(curl -s -X POST "${API_BASE}/tasks/parse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "text": "I need to finish the quarterly report by next Friday. Also, remind me to call the client tomorrow at 2 PM. And I should buy groceries this weekend."
  }')

echo "Response: $PARSE_RESPONSE"

# Test 5: Create tasks from parsed data
echo "\n📋 Test 5: Create tasks"
CREATE_RESPONSE=$(curl -s -X POST "${API_BASE}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tasks": [
      {
        "taskName": "Finish quarterly report",
        "assignee": "John Doe",
        "dueDate": "2025-06-06T18:30:00.000Z",
        "priority": "P2",
        "confidence": 0.9
      },
      {
        "taskName": "Call the client",
        "assignee": "John Doe",
        "dueDate": "2025-05-31T08:30:00.000Z",
        "priority": "P3",
        "confidence": 0.85
      },
      {
        "taskName": "Buy groceries",
        "assignee": "John Doe",
        "dueDate": "2025-06-01T18:30:00.000Z",
        "priority": "P3",
        "confidence": 0.8
      }
    ]
  }')

echo "Response: $CREATE_RESPONSE"

# Test 6: Get all tasks
echo "\n📋 Test 6: Get all tasks"
GET_TASKS_RESPONSE=$(curl -s -X GET "${API_BASE}/tasks?sortBy=dueDate&sortOrder=asc" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_TASKS_RESPONSE"

# Test 7: Get tasks with priority filter
echo "\n🔍 Test 7: Get tasks with priority filter (P2)"
FILTER_RESPONSE=$(curl -s -X GET "${API_BASE}/tasks?priority=P2" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $FILTER_RESPONSE"

echo "\n✅ API testing completed!"
echo "Please check the responses above to verify everything is working correctly."
