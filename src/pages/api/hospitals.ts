import type { NextApiRequest, NextApiResponse } from 'next';

import { DepartmentsType, HospitalProps } from '@/app/hospitals/interfaces';
import data from '@/data/converts/odsData.json';

interface ApiResponse {
  hospitals: HospitalProps[];
  total: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse | undefined>) {
  const { query, county, departments, page = '1', limit = '10' } = req.query;

  // Parse page and limit as integers
  const currentPage: number = Number(page);
  const pageSize: number = Number(limit);

  // Return undefined if query is invalid
  if (isNaN(currentPage) || currentPage < 1 || isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json(undefined);
  }

  // Split the query into individual words and convert them to lowercase
  const queryWords = typeof query === 'string' ? query.toLowerCase().split(' ').filter(Boolean) : [];
  const hospitals = data as HospitalProps[];

  // Filter hospitals based on the query, county, and departments
  const filteredHospitals = hospitals.filter(
    ({ title, county: currentCounty, departments: hospitalDepartments }: HospitalProps) => {
      const hospitalTitle = title.toLowerCase();

      // Check if at least one word from the query appears in the title
      const isTitleMatch = !queryWords.length || queryWords.some((word) => hospitalTitle.includes(word));

      // Check if the county matches, but only if a county has been specified
      const isCategoryMatch = !county || currentCounty === county;

      // Check if the department matches, but only if a department has been specified
      const isDepartmentMatch = !departments || hospitalDepartments.includes(departments as DepartmentsType);

      return isTitleMatch && isCategoryMatch && isDepartmentMatch;
    }
  );

  // Prioritize hospitals: Partner hospitals come first
  const prioritizedHospitals = filteredHospitals.sort((a, b) => {
    if (a.partner && !b.partner) return -1; // Partner hospitals come first
    if (!a.partner && b.partner) return 1;
    return 0; // Otherwise, maintain the order
  });

  // Calculate the start and end indices for pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the filtered results for the current page
  const paginatedResults = prioritizedHospitals.slice(startIndex, endIndex);

  // Return paginated results along with the total count
  res.status(200).json({
    hospitals: paginatedResults,
    total: filteredHospitals.length, // Total number of filtered hospitals
  });
}
