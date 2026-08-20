/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드(npm run dev)에서 화면 우측 하단에 뜨는 Next.js 개발자 도구 배지를 숨김.
  // 발표/시연용 화면을 깔끔하게 보여주기 위한 설정으로, 배포된 서비스 동작에는 영향 없음.
  devIndicators: false,
};

export default nextConfig;