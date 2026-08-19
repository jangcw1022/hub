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

// TODO: url은 실제 배포 주소로 교체할 것 (PRD 11번 미결 사항 3번).
// 현재는 실제 서비스가 없는 예약 도메인(example.com, RFC 2606)을 자리표시로 사용한다.
// TODO: fallbackImage도 실제 1280x800 스크린샷으로 교체할 것 (PRD 7.5) — 지금은 이름만 표시하는 자리표시 SVG.
export const projects: Project[] = [
  {
    id: "naver-news",
    name: "뉴스 검색",
    tagline: "키워드로 뉴스를 모아 보는 검색 인터페이스",
    url: "https://naver-news.example.com",
    fallbackImage: "/previews/naver-news.svg",
  },
  {
    id: "weather",
    name: "날씨",
    tagline: "도시를 검색하면 하늘빛이 바뀌는 7일 예보",
    url: "https://weather.example.com",
    fallbackImage: "/previews/weather.svg",
  },
  {
    id: "matzip",
    name: "맛집",
    tagline: "지도 위에 나만의 맛집을 기록하는 관리 도구",
    url: "https://review-beta-one.vercel.app",
    fallbackImage: "/previews/matzip.svg",
    repoUrl: "https://github.com/jangcw1022/review.git",
  },
];
