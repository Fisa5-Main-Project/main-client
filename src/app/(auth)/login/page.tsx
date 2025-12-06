"use client";

import LoginForm from "@/components/oauth/LoginForm";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="scrollbar-hide h-full"> {/* h-full 명시적 확인 필요 */}
      <AnimatePresence mode="wait">
        {!isLogin ? (
          // ✅ Landing View
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            // 🔻 변경 1: py-10을 pt-10 pb-6으로 분리하여 하단 여백 축소 (버튼을 더 아래로)
            className="flex flex-col items-center h-full px-6 pt-10 pb-6"
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <motion.div
                layoutId="logo-container"
                className="relative w-56 h-56 mb-10"
              >
                <Image
                  src="/assets/logo/knowwhohow_app_logo.svg"
                  alt="App Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-3 whitespace-nowrap">
                  노후 준비, <span className="text-[#0090FF]">어떻게(How)</span> 해야 할까?
                </h2>
                <p className="text-gray-500 font-medium">
                  KNOWHOW에서 도와드릴게요
                </p>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLogin(true)}
              // 🔻 변경 2: mt-8 대신 mt-auto를 사용하여 남은 공간만큼 아래로 밀어냄
              className="w-full max-w-sm py-4 bg-[#0090FF] text-white text-[1.1rem] font-bold rounded-2xl shadow-lg hover:bg-[#0070DD] transition-colors mt-auto"
            >
              시작하기
            </motion.button>
          </motion.div>
        ) : (
          // ✅ Login View
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-full"
          >
            {/* Top Logo Area */}
            <div className="flex justify-center pt-12 pb-8 shrink-0">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-48 h-48 relative"
              >
                <Image
                  src="/assets/logo/knowwhohow_logo.png"
                  alt="Text Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Login Form Container - Slide Up */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex-1 bg-white px-6 pb-10"
            >
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-900 mb-8 mt-6">
                  로그인으로 <span className="text-[#0090FF]">노후하우</span> 시작하기
                </h2>
                <div className="w-full">
                  <LoginForm />
                </div>

                <div className="flex-shrink-0 mt-10 text-center">
                  <p className="text-center text-sm mt-4 text-gray-400">
                    해당 서비스는 노후하우 가입 후 이용할 수 있습니다
                  </p>
                  <p className="mt-2.5 text-1rem text-gray-500">
                    아직 회원이 아니신가요?
                    <Link
                      href="/signup/verify"
                      className="ml-2 font-semibold text-primary hover:underline"
                    >
                      회원가입
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}