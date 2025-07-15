import simpleGit from 'simple-git';
import path from 'path';
import logger from './utils/logger';

const git = simpleGit({ baseDir: '../' });

export async function setupGitIdentity() {
  const userName = process.env.REPO_OWNER || "";
  const userEmail = process.env.GIT_USER_EMAIL || "";

  try {
    await git.addConfig('user.name', userName);
    await git.addConfig('user.email', userEmail);
    logger.info(`Git identity set: ${userName} <${userEmail}>`);
  } catch (err) {
    logger.error('Failed to set git identity:', err);
    throw err;
  }
}

export async function commitAndPushChanges(files: string[], image: string, version: string) {
  const branch = `${process.env.WORK_BRANCH || 'update-version'}-${Date.now()}`;

  const relativePaths = files.map(f => path.relative('../', f));
  await git.checkoutLocalBranch(branch);
  await git.add(relativePaths);
  await git.commit(`chore: updated ${image} to version ${version}`);

  // 🛡️ Настраиваем remote с GitHub Token
  const token = process.env.GITHUB_TOKEN;
  const repoOwner = process.env.REPO_OWNER;
  const repoName = process.env.REPO_NAME;

  if (!token || !repoOwner || !repoName) {
    throw new Error('GITHUB_TOKEN, REPO_OWNER or REPO_NAME is missing in environment');
  }

  const remoteUrl = `https://${token}@github.com/${repoOwner}/${repoName}.git`;

  try {
    await git.removeRemote('origin').catch(() => {});
    await git.addRemote('origin', remoteUrl);
    await git.push('origin', branch);
    logger.info(`Pushed changes to ${repoOwner}/${repoName} [${branch}]`);
  } catch (err) {
    logger.error('Failed to push changes:', err);
    throw err;
  }
}
