import { GetServerSideProps } from 'next';

import { DepartmentsType, HospitalCategoryType, HospitalProps } from '@/domains/hospital';
import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { PharmacyProps } from '@/domains/pharmacy';
import { getHospitals } from '@/services/hospital';
import { getPharmacies } from '@/services/pharmacy';

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

function generateSitemapXml(urls: SitemapUrl[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
    <url>
      <loc>${escape(url.loc)}</loc>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
      ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    </url>`
    )
    .join('')}
</urlset>`;
}

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 安全地處理日期轉換
function safeToISOString(date: string | Date | undefined | null): string {
  if (!date) return new Date().toISOString();
  try {
    if (typeof date === 'string') {
      // 如果已經是 ISO 格式，直接返回
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(date)) {
        return date;
      }
      // 否則嘗試轉換
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    } else if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {
    console.error('Date parsing error:', e);
  }
  return new Date().toISOString();
}

const SitemapXml = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (!res) {
    return {
      notFound: true,
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const currentDate = new Date().toISOString();

    const staticUrls: SitemapUrl[] = [
      {
        loc: baseUrl,
        lastmod: currentDate,
        changefreq: 'yearly',
        priority: 1.0,
      },
      {
        loc: `${baseUrl}${getPageUrlByType(PageType.HOSPITALS)}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${baseUrl}${getPageUrlByType(PageType.CLINICS)}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${baseUrl}${getPageUrlByType(PageType.PHARMACIES)}`,
        lastmod: currentDate,
        changefreq: 'hourly',
        priority: 0.8,
      },
    ];

    const [hospitalsRes, clinicsRes, pharmaciesRes] = await Promise.allSettled([
      getHospitals({
        query: '',
        county: '',
        departments: '' as DepartmentsType,
        keywords: [],
        partner: false,
        category: HospitalCategoryType.Hospital,
        page: 1,
        limit: 0,
      }),
      getHospitals({
        query: '',
        county: '',
        departments: '' as DepartmentsType,
        keywords: [],
        partner: false,
        category: HospitalCategoryType.Clinic,
        page: 1,
        limit: 0,
      }),
      getPharmacies({ query: '', county: '', partner: false, healthInsuranceAuthorized: false, page: 1, limit: 0 }),
    ]);

    let hospitalUrls: SitemapUrl[] = [];
    let clinicUrls: SitemapUrl[] = [];
    let pharmacyUrls: SitemapUrl[] = [];

    if (hospitalsRes.status === 'fulfilled') {
      const { hospitals } = hospitalsRes.value;
      hospitalUrls = (hospitals ?? []).map(({ _id, updatedAt }: HospitalProps) => ({
        loc: `${baseUrl}${getPageUrlByType(PageType.HOSPITALS)}/${_id}`,
        lastmod: safeToISOString(updatedAt),
        changefreq: 'weekly',
        priority: 0.7,
      }));
    }

    if (clinicsRes.status === 'fulfilled') {
      const { hospitals } = clinicsRes.value;
      clinicUrls = (hospitals ?? []).map(({ _id, updatedAt }: HospitalProps) => ({
        loc: `${baseUrl}${getPageUrlByType(PageType.CLINICS)}/${_id}`,
        lastmod: safeToISOString(updatedAt),
        changefreq: 'weekly',
        priority: 0.7,
      }));
    }

    if (pharmaciesRes.status === 'fulfilled') {
      const { pharmacies } = pharmaciesRes.value;
      pharmacyUrls = (pharmacies ?? []).map(({ _id, updatedAt }: PharmacyProps) => ({
        loc: `${baseUrl}${getPageUrlByType(PageType.PHARMACIES)}/${_id}`,
        lastmod: safeToISOString(updatedAt),
        changefreq: 'weekly',
        priority: 0.7,
      }));
    }

    const xml = generateSitemapXml([...staticUrls, ...hospitalUrls, ...clinicUrls, ...pharmacyUrls]);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.write(xml);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.statusCode = 500;
    res.write('Error generating sitemap');
    res.end();

    return {
      props: {},
    };
  }
};

export default SitemapXml;
