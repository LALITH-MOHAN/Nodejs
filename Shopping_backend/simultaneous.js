
const tokenA = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwMTMzNDEwLCJleHAiOjE3NTAyMTk4MTB9.TEFfAco5iSv8NBQKeKC1Yk0Yr00VC5aZcSmKdAqILuk';
const tokenB = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzUwMTMzNDcyLCJleHAiOjE3NTAyMTk4NzJ9.7y31CLOAo3eNotx_2pvo46wkT0cfzOlyVcf4anTsxXM';

const orderPayload = {
  items: [
    {
      id: 2,
      title: 'iPhone X',
      price:   898.00 ,
      quantity: 2,
      thumbnail: 'http://localhost:3000/products/iPhone X.jpg'
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
  console.log('User A order result:');
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
