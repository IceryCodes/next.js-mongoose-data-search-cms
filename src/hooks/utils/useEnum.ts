import { useCallback, useMemo } from 'react';

import { GenderType } from '@/app/hospitals/interfaces';

interface UsePatientSelectionTicketEnumReturnType {
  genderMap: Record<GenderType, string>;
  composeGender: (genderToTrans: GenderType) => string;
}

export const useEnum = (): UsePatientSelectionTicketEnumReturnType => {
  const genderMap = useMemo<Record<GenderType, string>>(() => {
    return {
      [GenderType.None]: '',
      [GenderType.Male]: '先生',
      [GenderType.Female]: '小姐',
    };
  }, []);

  const composeGender = useCallback(
    (genderToTrans: GenderType): string => {
      return genderMap[genderToTrans] ?? 'Unknown';
    },
    [genderMap]
  );

  return useMemo<UsePatientSelectionTicketEnumReturnType>(() => {
    return { genderMap, composeGender };
  }, [composeGender, genderMap]);
};
