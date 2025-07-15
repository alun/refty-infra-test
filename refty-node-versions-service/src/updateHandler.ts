import { Request, Response } from 'express';
import { updateImageVersionsInRepo } from './fileScanner';
import { commitAndPushChanges } from './gitHelper';
import ResponseBuilder from './utils/responseBuilder';
import logger from './utils/logger';

export async function handleUpdateRequest(req: Request, res: Response) {
  const { image, version } = req.body;

  logger.info(`Incoming update request for image: ${image}, version: ${version}`);

  if (!image || !version) {
    logger.warn('Bad request: Missing image or version');
    return res.status(400).json(ResponseBuilder.badRequest('Missing "image" or "version" in request body'));
  }

  try {
    const result = await updateImageVersionsInRepo(image, version);

    if (!result.foundMatchingImages) {
      logger.info('No matching images found');
      return res.status(200).json(ResponseBuilder.notFound());
    }

    if (result.changedFiles.length === 0) {
      logger.info('Matching images found, but no changes needed');
      return res.status(200).json(ResponseBuilder.notChanged());
    }

    await commitAndPushChanges(result.changedFiles, image, version);

    logger.info(
      `Successfully updated ${result.totalReplacements} occurrences in ${result.changedFiles.length} files`
    );

    return res.status(200).json(ResponseBuilder.ok(result.changedFiles, result.totalReplacements));
  } catch (err: any) {
    logger.error(`Unhandled error: ${err.message || err}`);
    return res.status(500).json(ResponseBuilder.error('Internal Server Error'));
  }
}
