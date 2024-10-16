export enum PageType {
  HOSPITALS = '醫院搜尋',
}

export const PageTypeMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(PageType).map(([key, value]) => [key.toUpperCase(), value])
);

export const getPageUrlByType = (value: PageType): string => {
  return (
    Object.keys(PageType)
      .find((key) => PageType[key as keyof typeof PageType] === value)
      ?.toLowerCase() ?? '404'
  );
};
