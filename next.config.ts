import type { NextConfig } from "next";
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',  //'development'로 하면 개발환경에서 작동하지 않음 , 'production'은 배포환경에서 작동하지 않음
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  // 보안 헤더 및 XSS 설정
  /* config options here */
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'X-DNS-Prefetch-Control',
  //           value: 'on'
  //         },
  //         {
  //           key: 'Strict-Transport-Security',
  //           value: 'max-age=63072000; includeSubDomains; preload'
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'SAMEORIGIN'
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff'
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin'
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=*, microphone=*, geolocation=*, browsing-topics=()'
  //         },
  //         {
  //           key: 'Content-Security-Policy',
  //           value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://dapi.kakao.com https://t1.daumcdn.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://dapi.kakao.com http://localhost:8000 ws://localhost:8000 http://localhost:8080 ws://localhost:8080 http://127.0.0.1:8080 ws://127.0.0.1:8080 http://localhost:8060 ws://localhost:8060 http://127.0.0.1:8060 ws://127.0.0.1:8060 https://*.knowwhohow.cloud https://*.knowwhohow.site;"
  //         }
  //       ]
  //     }
  //   ]
  // },
};

module.exports = withPWA(nextConfig);
