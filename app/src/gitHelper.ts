import simpleGit from 'simple-git';
import path from 'path';

const git = simpleGit({ baseDir: '../' });

export async function commitAndPushChanges(files: string[], image: string, version: string) {
  const branch = `${process.env.WORK_BRANCH}-${Date.now()}`;
  await git.checkoutLocalBranch(branch);
  await git.add(files.map(f => path.relative('../', f)));
  await git.commit(`chore: updated ${image} to version ${version}`);
  await git.push('origin', branch);
}
