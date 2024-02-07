const {createClient} = require('redis')
const {promisify} = require('util')
const express = require('express');
const kue = require('kue');

const port = 1245;
const server = express();

const client = createClient();
const get = promisify(client.get).bind(client);

const queue = kue.createQueue()


let reservationEnabled = true;
client.set("available_seats", 50)

function reserveSeat(number) {
    client.set("available_seats", number);
}

async function getCurrentAvailableSeats() {
    const seats = await get("available_seats");
    return seats;
}

server.get('/available_seats', async(req, res) => {
    const seats = await getCurrentAvailableSeats();
    res.send({numberOfAvailableSeats: seats})
});

server.get('/reserve_seat', (req, res) => {
    if ( reservationEnabled === false) {
        res.send({ "status": "Reservation are blocked" });
        return;
    }
    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            res.send({ "status": "Reservation failed" });
            return;
      }
        res.send({"status":"Reservation in process"});
    })
    job.on('complete', (result) => {
        console.log(`Seat reservation job ${job.id} completed`);
    }).on('failed', (errorMessage) => {
        console.log(`Seat reservation job ${job.id} failed:`, errorMessage);
    });
});

server.get('/process', async(req, res) => {
    res.send({ "status": "Queue processing" });
    
    queue.process('reserve_seat', async(job, done) => {
        const availableSeats = await getCurrentAvailableSeats();
        if (availableSeats - 1 === 0) {
            reservationEnabled = false;
            done(Error('Not enough seats available'));
        }
        reserveSeat(availableSeats - 1);
        done();
    });
});


server.listen(port);
