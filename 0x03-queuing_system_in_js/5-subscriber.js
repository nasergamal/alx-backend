const {createClient, print} = require('redis');

const subChannel = 'holberton school channel';
const client = createClient();
client.on('error', (err) => console.log(`Redis client not connected to the server: ,${err}`));
client.on('connect', () => {
    console.log('Redis client connected to the server')
    client.subscribe(subChannel)
});

client.on('message', (channel, message) => {
    if (channel === subChannel) {
      console.log(message);
      if (message === 'KILL_SERVER') {
        client.unsubscribe(channel);
        client.quit();
      }
    }
})
