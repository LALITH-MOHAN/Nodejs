// testConcurrentOrders-fetch.js

// Replace with real JWT tokens from login
const tokenA = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ5ODEyMzYzLCJleHAiOjE3NDk4OTg3NjN9.KqdrYb5C_LcOHQKiYQYQUs_wK7_hO6406gjGOZAlCmo';
const tokenB = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzQ5ODEyNDA1LCJleHAiOjE3NDk4OTg4MDV9.rE4w573Cd1akRRV9TfZqHzr2DzsnGR7V2LhTOl1sHXU';

const orderPayload = {
  items: [
    {
      id: 2,
      title: 'iPhone X',
      price:   897.99 ,
      quantity: 28,
      thumbnail: 'http://localhost:3000/products/iphone_x_1749779016142.jpg'
    }
  ],
  total: 897.99 * 28
};

async function postOrder(url, token, body) {
  const response = await fetch(`${url}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return await response.json();
}

async function simulateConcurrentOrders() {
  const url = 'http://localhost:3000';

  console.log('Sending concurrent orders...\n');

  const [resultA, resultB] = await Promise.allSettled([
    postOrder(url, tokenA, orderPayload),
    postOrder(url, tokenB, orderPayload)
  ]);

  // Handle result for User A
  console.log('🔹 User A order result:');
  if (resultA.status === 'fulfilled') {
    console.log('Success:', resultA.value);
  } else {
    console.log('Failed:', resultA.reason.message);
  }

  // Handle result for User B
  console.log('\n User B order result:');
  if (resultB.status === 'fulfilled') {
    console.log(' Success:', resultB.value);
  } else {
    console.log(' Failed:', resultB.reason.message);
  }

  console.log('\nConcurrency test finished.');
}

simulateConcurrentOrders();
