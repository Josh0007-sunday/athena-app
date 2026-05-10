TOKEN=$(node -e "const jwt = require('jsonwebtoken'); require('dotenv').config({ path: '/home/joshua/Desktop/Athena/server/.env' }); console.log(jwt.sign({ userId: '60c72b2f9b1d8e4b5c7a4b8e', tier: 'pro', walletAddress: '6tU4n9E6H1Hj2fXVXq2mU2qK1vWkQ13m2WNWkRkG1' }, process.env.JWT_SECRET, { expiresIn: '1h' }));")
curl -s -v -X POST "http://localhost:5173/api/agent/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "hello", "history": []}'
