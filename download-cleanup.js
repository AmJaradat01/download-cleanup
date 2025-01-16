import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const config = [
    {
        website: 'example.com',
        action: 'move',
        targetFolder: path.join(os.homedir(), 'Downloads/ExampleFiles'),
        condition: { type: 'immediately' },
    },
];

const getWhereFromMetadata = (filePath) => {
    try {
        const metadata = execSync(`mdls -name kMDItemWhereFroms "${filePath}"`, { encoding: 'utf8' });
        const match = metadata.match(/kMDItemWhereFroms = \((.*?)\)/s);
        if (match) {
            return match[1].split(',').map((url) => url.trim().replace(/"|'/g, ''));
        }
    } catch {
        return [];
    }
    return [];
};

const processDownloads = async () => {
    const sourceFolder = path.join(os.homedir(), 'Downloads');
    const files = await fs.readdir(sourceFolder);

    for (const fileName of files) {
        const filePath = path.join(sourceFolder, fileName);
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) continue;

        const whereFromUrls = getWhereFromMetadata(filePath);
        for (const { website, action, targetFolder, condition } of config) {
            if (whereFromUrls.some((url) => url.includes(website))) {
                if (action === 'move' && targetFolder) {
                    await fs.mkdir(targetFolder, { recursive: true });
                    await fs.rename(filePath, path.join(targetFolder, fileName));
                    console.log(`Moved: ${fileName}`);
                }
            }
        }
    }
};

processDownloads().catch(console.error);
