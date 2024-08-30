import { Db } from 'mongodb';
import axios from 'axios';
import { Measure } from '../models/Measure';

const GEMINI_API_URL = 'https://api.google.dev/gemini';

export const getMeasureFromImage = async (imageBase64: string): Promise<{ image_url: string; measure_value: number; measure_uuid: string }> => {
  // Faça a requisição à API do Google Gemini
  const response = await axios.post(`${GEMINI_API_URL}/vision`, { image: imageBase64 });
  return response.data;
};

export const saveMeasure = async (db: Db, measure: Measure): Promise<void> => {
  await db.collection('measures').insertOne(measure);
};

export const confirmMeasure = async (db: Db, measure_uuid: string, confirmed_value: number): Promise<void> => {
  const measure = await db.collection('measures').findOne({ measure_uuid });

  if (!measure) {
    throw { code: 404, message: 'Leitura não encontrada' };
  }

  if (measure.has_confirmed) {
    throw { code: 409, message: 'Leitura já confirmada' };
  }

  await db.collection('measures').updateOne(
    { measure_uuid },
    { $set: { measure_value: confirmed_value, has_confirmed: true } }
  );
};

export const listMeasures = async (db: Db, customer_code: string, measure_type?: string): Promise<Measure[]> => {
  const query: any = { customer_code };

  if (measure_type) {
    const type = measure_type.toUpperCase();
    if (type !== 'WATER' && type !== 'GAS') {
      throw { code: 400, message: 'Tipo de medição não permitida' };
    }
    query.measure_type = type;
  }

  // Realiza a consulta e mapeia os documentos para o tipo `Measure`
  const measures = await db.collection('measures').find(query).toArray();

  if (measures.length === 0) {
    throw { code: 404, message: 'Nenhuma leitura encontrada' };
  }

  // Converte os documentos retornados para o tipo `Measure`
  const mappedMeasures: Measure[] = measures.map((measure) => ({
    measure_uuid: measure.measure_uuid,
    customer_code: measure.customer_code,
    measure_datetime: measure.measure_datetime,
    measure_type: measure.measure_type,
    has_confirmed: measure.has_confirmed,
    image_url: measure.image_url,
  }));

  return mappedMeasures;
};

