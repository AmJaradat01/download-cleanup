import { processDownloads } from './download-cleanup.js';

// Schedule cleanup at regular intervals
const scheduleCleanup = () => {
    const interval = 60 * 60 * 1000; // Every hour
    setInterval(async () => {
        console.log('Running scheduled cleanup...');
        try {
            await processDownloads();
            console.log('Cleanup complete.');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }, interval);
};

// Start the scheduled cleanup
scheduleCleanup();
