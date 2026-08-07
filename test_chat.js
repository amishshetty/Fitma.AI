const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'I had one bowl of rice and 1 bowl of channa sabji for dinner',
      history: [],
      profile: {
        name: 'Test',
        goal: 'Lose Weight',
        diet: 'Vegetarian',
        dailyCalories: 2000,
        language: 'English',
        motivationStyle: 'Friendly',
      },
    }),
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
