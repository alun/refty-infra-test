import fs from 'fs';
import path from 'path';

const repoPath = '../';

interface UpdateResult {
    changedFiles: string[];
    totalReplacements: number;
    foundMatchingImages: boolean;
}

export async function updateImageVersionsInRepo(image: string, version: string): Promise<UpdateResult> {
    const changedFiles: string[] = [];
    let totalReplacements = 0;
    let foundMatchingImages = false;

    const imageRegex = new RegExp(`${image}:\\S+`, 'g');
    const newImageTag = `${image}:${version}`;

    function scanDir(dir: string) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) 
            {
                scanDir(fullPath);
            }
            else if (item.endsWith('.yaml') || item.endsWith('.yml')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const matches = content.match(imageRegex);

                if (matches && matches.length > 0) {
                    foundMatchingImages = true;
                    const newContent = content.replace(imageRegex, newImageTag);
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    changedFiles.push(fullPath);
                    totalReplacements += matches.length;
                }
            }
        }
    }

    scanDir(repoPath);

    return {
        changedFiles,
        totalReplacements,
        foundMatchingImages,
    };
}
