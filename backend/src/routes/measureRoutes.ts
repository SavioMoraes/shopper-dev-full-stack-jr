import express from 'express';
import { confirmMeasureController, listMeasuresController, uploadImage } from '../controllers/measureController';
import { connectToDatabase } from '../database';

const router = express.Router();

router.post('/upload', async (req, res) => {
  const db = await connectToDatabase();
  uploadImage(req, res, db);
});

router.patch('/confirm', async (req, res) => {
  const db = await connectToDatabase();
  confirmMeasureController(req, res, db);
});

router.get('/:customer_code/list', async (req, res) => {
  const db = await connectToDatabase();
  listMeasuresController(req, res, db);
});

export default router;
