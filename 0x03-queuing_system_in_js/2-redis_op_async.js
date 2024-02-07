const {createClient, print} = require('redis');
const { promisify } = require('util');

const client = createClient();
client.on('error', (err) => console.log(`Redis client not connected to the server: ${err}`));
client.on('connect', () => console.log('Redis client connected to the server'));

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

async function displaySchoolValue(schoolName) {
  try {
    const value = await get(schoolName)
    console.log(value);
  } catch (err) {
      console.log(err);
  }
}
let get = promisify(client.get).bind(client);

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
