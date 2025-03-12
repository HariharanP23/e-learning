import { createConsumer } from '@rails/actioncable';

let consumer;

function getConsumer() {
  const env = process.env.NEXT_PUBLIC_ENV || 'development';
  
  const wsUrls = {
    development: 'ws://localhost:3001/cable'
  };

  const wsUrl = wsUrls[env] || wsUrls.production; 

  if (!consumer) {
    consumer = createConsumer(wsUrl);
  }

  return consumer;
}

export default getConsumer;
