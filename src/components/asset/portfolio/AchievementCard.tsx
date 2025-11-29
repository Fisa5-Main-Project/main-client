'use client';

interface AchievementProps {
    achievement: {
        icon: string;
        title: string;
        description: string;
    };
}

export default function AchievementCard({ achievement }: AchievementProps) {
    const { icon, title, description } = achievement;
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-accent text-3xl font-bold">
                목표 금액 달성에 도움되는
                <br />
                방법을 <span className="text-blue-500 text-3xl font-bold">추천</span> 받으세요!
            </h2>
            <div className="w-full p-6 bg-gradient-to-b from-blue-50 to-sky-100 rounded-2xl shadow-lg shadow-blue-500/10">
                <div className="flex gap-3">
                    <span className="text-3xl">{icon}</span>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-gray-800 text-xl font-bold leading-8">{title}</h3>
                        <p className="text-slate-700 text-base leading-6">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}