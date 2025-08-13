const { Worker } = require('bullmq');
const Destination = require('../models/destination');
const Log = require('../models/log');
const axios = require('axios');
const connection = require('./redis');

function startWorker() {
    const worker = new Worker('webhookQueue', async job => {
        try {
            const { log_id, account_id, payload } = job.data;

            const destinations = await Destination.find({ account_id });
            let success = true;

            for (const dest of destinations) {
                try {
                    await axios({
                        method: dest.http,
                        url: dest.url,
                        headers: Object.fromEntries(dest.headers),
                        data: payload
                    });
                } catch (err) {
                    success = false;
                    console.error(`Error sending to ${dest.url}:`, err.message);
                }
            }

            await Log.findOneAndUpdate({ _id: log_id },

                {
                    $set: {
                        processed_timestamp: new Date(),
                        status: success ? 'success' : 'failed'
                    }
                },
                { new: true }
            )
            worker.on('completed', job => {
                console.log("Completed", job.id);
            });

            worker.on('failed', (job, err) => {
                console.error("Failed", job.id, err.message);
            });

        } catch (error) {
            console.log("Error@worker", error?.message);
            return null;
        }
    }, { connection });
}


module.exports = startWorker