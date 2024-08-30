import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { confirmMeasure, getMeasureFromImage, listMeasures, saveMeasure } from '../services/measureService';
import { Measure } from '../models/Measure';

export const uploadImage = async (req: Request, res: Response, db: Db) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Dados inválidos' });
    }

    const { image_url, measure_value, measure_uuid } = await getMeasureFromImage(image);

    const measure: Measure = {
      measure_uuid,
      customer_code,
      measure_datetime: new Date(measure_datetime),
      measure_type,
      measure_value,
      image_url,
      has_confirmed: false,
    };

    await saveMeasure(db, measure);

    res.status(200).json({ image_url, measure_value, measure_uuid });
  } catch (error: any) {
      res.status(500).json({ error_code: 'SERVER_ERROR', error_description: error.message });
  }
};

export const confirmMeasureController = async (req: Request, res: Response, db: Db) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    if (!measure_uuid || typeof confirmed_value !== 'number') {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Dados inválidos' });
    }

    await confirmMeasure(db, measure_uuid, confirmed_value);

    res.status(200).json({ success: true });
  } catch (error: any) {
    if (error.code === 404) {
      res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: error.message });
    } else if (error.code === 409) {
      res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: error.message });
    } else {
      res.status(500).json({ error_code: 'SERVER_ERROR', error_description: error.message });
    }
  }
};

export const listMeasuresController = async (req: Request, res: Response, db: Db) => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Código do cliente é obrigatório' });
    }

    const measures = await listMeasures(db, customer_code, measure_type as string | undefined);

    res.status(200).json({ customer_code, measures });
  } catch (error: any) {
    if (error.code === 400) {
      res.status(400).json({ error_code: 'INVALID_TYPE', error_description: error.message });
    } else if (error.code === 404) {
      res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: error.message });
    } else {
      res.status(500).json({ error_code: 'SERVER_ERROR', error_description: error.message });
    }
  }
};

