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

  // ищем конкретно image: ...:тег
  const imageRegex = new RegExp(`(${image}):(\\S+)`, 'g');

  function scanDir(dir: string) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.yaml') || item.endsWith('.yml')) {
        const content = fs.readFileSync(fullPath, 'utf8');

        let hasChange = false;
        let replacementsInFile = 0;

        const newContent = content.replace(imageRegex, (match, matchedImage, matchedVersion) => {
          if (matchedVersion !== version) {
            hasChange = true;
            replacementsInFile++;
            return `${matchedImage}:${version}`;
          }
          return match;
        });

        if (hasChange) {
          foundMatchingImages = true;
          fs.writeFileSync(fullPath, newContent, 'utf8');
          changedFiles.push(fullPath);
          totalReplacements += replacementsInFile;
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
