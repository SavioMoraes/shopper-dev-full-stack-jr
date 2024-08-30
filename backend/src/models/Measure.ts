export interface Measure {
  measure_uuid: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
  measure_value?: number;
  image_url?: string;
  has_confirmed: boolean;
}
