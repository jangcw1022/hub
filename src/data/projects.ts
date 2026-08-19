export type Project = {
  /** 고유 키 */
  id: string;
  /** 화면 표시명 */
  name: string;
  /** 한 줄 설명 */
  tagline: string;
  /** 배포된 절대 URL */
  url: string;
  /** iframe 실패 시 대체 스크린샷 (/public 기준 경로) */
  fallbackImage: string;
  // v2 예정 (선택)
  stack?: string[];
  repoUrl?: string;
  year?: string;
};

// TODO: fallbackImage도 실제 1280x800 스크린샷으로 교체할 것 (PRD 7.5) — 지금은 이름만 표시하는 자리표시 SVG.
export const projects: Project[] = [
  {
    id: "naver-news",
    name: "뉴스 검색",
    tagline: "AI·부동산·환율 등 관심 주제로 경제 뉴스를 찾아보는 검색 서비스",
    url: "https://news-udxp.vercel.app",
    fallbackImage: "/previews/naver-news.svg",
  },
  {
    id: "weather",
    name: "기상관측",
    tagline: "도시를 검색해 실시간 기상 관측 데이터를 확인하는 Open-Meteo 기반 도구",
    url: "https://weather2-amber.vercel.app",
    fallbackImage: "/previews/weather-station.svg",
  },
  {
    id: "matzip",
    name: "맛집",
    tagline: "지도 위에 나만의 맛집을 기록하는 관리 도구",
    url: "https://review-beta-one.vercel.app",
    fallbackImage: "/previews/matzip.svg",
    repoUrl: "https://github.com/jangcw1022/review.git",
  },
  {
    id: "dust",
    name: "미세먼지",
    tagline: "전국 17개 시도 미세먼지 현황을 클릭 한 번으로 확인하는 오늘의공기",
    url: "https://dust-pink.vercel.app",
    fallbackImage: "/previews/dust.svg",
  },
];
