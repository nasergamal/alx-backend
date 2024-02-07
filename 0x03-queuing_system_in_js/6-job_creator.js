const kue = require('kue');

const data =
  {
    phoneNumber: '+090987654321',
    message: 'Do it',
  }

const queue = kue.createQueue()
const job = queue.create('push_notification_code', data).save((err) => {
  if( !err ) {
    console.log(`Notification job created: ${job.id}`);
  }
});
job.on('complete', function(result){
  console.log('Notification job completed');
}).on('failed', function(errorMessage){
  console.log('Notification job failed');
});
