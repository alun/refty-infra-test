import express from 'express';
import dotenv from 'dotenv';
import { handleUpdateRequest } from './updateHandler';
import { setupGitIdentity } from './gitHelper';
import logger from './utils/logger';
dotenv.config();
setupGitIdentity();
const app = express();
app.use(express.json());

app.post('/update-version', handleUpdateRequest);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
