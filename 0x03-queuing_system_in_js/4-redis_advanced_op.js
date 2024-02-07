const {createClient, print} = require('redis');

const client = createClient();
client.on('error', (err) => console.log(`Redis client not connected to the server: ,${err}`));
client.on('connect', () => console.log('Redis client connected to the server'));

const data = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
}
Object.entries(data).forEach(([key, value]) => {
  client.HSET('HolbertonSchools', key, value, print);
});

client.hgetall('HolbertonSchools', (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
});
