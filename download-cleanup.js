const processDownloads = async (sourceFolder = path.join(os.homedir(), 'Downloads')) => {
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
