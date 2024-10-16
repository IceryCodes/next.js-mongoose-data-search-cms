import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/app/hospitals/interfaces';
import data from '@/data/converts/odsData.json';

type ResponseData = HospitalProps | undefined;

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json(undefined); // Return an undefined if query is invalid
  }

  const hospitals = data as HospitalProps[];
  // Find hospital where id query matched
  const result: ResponseData = hospitals.find(({ id: currentId }: HospitalProps) => currentId === id);

  res.status(200).json(result);
}
