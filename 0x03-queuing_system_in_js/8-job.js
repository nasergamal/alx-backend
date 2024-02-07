export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }
  jobs.forEach((data) => {
    const job = queue.create('push_notification_code_3', data)
       
      job.on('complete', (result) => {
        console.log(`Notification job #${job.id} completed`);
      }).on('failed', (errorMessage) => {
        console.log('Notification job failed:', errorMessage);
      }).on('progress', (progress, data) => {
        console.log(`Notification job #${job.id} ${progress}% complete`)
      });
      job.save((err) => {
        if( !err ) {
          console.log(`Notification job created: ${job.id}`);
        }
      });
  });
}
