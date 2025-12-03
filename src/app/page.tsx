import Image from 'next/image';

export default function LandingPage() {
    return (
        <main className="flex h-screen w-full flex-col bg-white">
            <div className="flex flex-1 flex-col items-center justify-center">
                <Image src="/icons/icon-512x512.png" alt="로고" width={240} height={240} />
                <h1 className="mt-4 text-2xl font-bold text-gray-500">
                    노후하우
                </h1>
            </div>
        </main>
    );
}
