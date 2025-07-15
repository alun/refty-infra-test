import express from 'express';
import dotenv from 'dotenv';
import { handleUpdateRequest } from './updateHandler';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/update-version', handleUpdateRequest);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
