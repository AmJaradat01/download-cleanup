import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

// Configuration for websites and actions
const config = [
    {
        website: 'example.com',
        action: 'move',
        targetFolder: path.join(os.homedir(), 'Downloads/ExampleFiles'),
        condition: { type: 'immediately' },
    },
    {
        website: 'anotherexample.com',
        action: 'remove',
        condition: {
            type: 'after',
            value: { days: 1 }, // Remove files older than 1 day
        },
    },
];

// Utility to get the "Where from" metadata
const getWhereFromMetadata = (filePath) => {
    try {
        const metadata = execSync(`mdls -name kMDItemWhereFroms "${filePath}"`, { encoding: 'utf8' });
        const match = metadata.match(/kMDItemWhereFroms = \((.*?)\)/s);
        if (match) {
            return match[1].split(',').map((url) => url.trim().replace(/"|'/g, '')); // Extract URLs
        }
    } catch (error) {
        console.warn(`Metadata not found for: ${filePath}. Skipping.`);
    }
    return [];
};

// Utility to calculate file age in milliseconds
const getFileAgeInMs = async (filePath) => {
    const stats = await fs.stat(filePath);
    return Date.now() - stats.mtimeMs;
};

// Check if a file matches the condition
const matchesCondition = async (filePath, condition) => {
    if (condition.type === 'immediately') {
        return true;
    }

    if (condition.type === 'after') {
        const { hours = 0, days = 0, minutes = 0 } = condition.value || {};
        const conditionMs = (hours * 3600 + days * 86400 + minutes * 60) * 1000;
        const fileAge = await getFileAgeInMs(filePath);

        return fileAge > conditionMs;
    }

    return false;
};

// Main function to process files
const processDownloads = async (sourceFolder = path.join(os.homedir(), 'Downloads')) => {
    try {
        const files = await fs.readdir(sourceFolder);

        for (const fileName of files) {
            // Skip temporary or hidden files
            if (fileName.startsWith('~$') || fileName.startsWith('.')) {
                console.log(`Skipping temporary/system file: ${fileName}`);
                continue;
            }

            const filePath = path.join(sourceFolder, fileName);
            const stats = await fs.stat(filePath);
            if (!stats.isFile()) continue;

            const whereFromUrls = getWhereFromMetadata(filePath);

            for (const { website, action, targetFolder, condition } of config) {
                if (whereFromUrls.some((url) => url.includes(website))) {
                    const matches = condition ? await matchesCondition(filePath, condition) : true;

                    if (matches) {
                        if (action === 'move' && targetFolder) {
                            await fs.mkdir(targetFolder, { recursive: true });
                            await fs.rename(filePath, path.join(targetFolder, fileName));
                            console.log(`Moved: ${fileName} to ${targetFolder}`);
                        } else if (action === 'remove') {
                            await fs.unlink(filePath);
                            console.log(`Removed: ${fileName}`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Error processing downloads in ${sourceFolder}:`, error.message);
    }
};

// Exporting the function for manual and scheduled usage
export { processDownloads };

// To run manually
if (process.argv[2]) {
    processDownloads(process.argv[2]).then(() => {
        console.log('Processing complete.');
    });
} else {
    processDownloads().then(() => {
        console.log('Processing complete.');
    });
}
