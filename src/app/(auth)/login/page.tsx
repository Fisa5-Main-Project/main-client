import LoginForm from "@/components/oauth/LoginForm";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="w-[10rem] h-[10rem] mx-auto mt-10">
        <Image
          src="/main/CoupleMascot.png"
          alt="서비스 마스코트"
          width={180}
          height={180}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <h1 className="mt-9 text-[2rem] font-bold text-secondary text-start">
        로그인
      </h1>

      <LoginForm />

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
  );
}
