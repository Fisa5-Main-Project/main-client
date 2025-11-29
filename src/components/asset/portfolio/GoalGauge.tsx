'use client';

export default function GoalGauge({ percentage }: { percentage: number }) {
    const radius = 45;
    const clampedPercentage = Math.min(percentage, 100);

    const circumference = Math.PI * radius; // 2 * PI * r / 2
    const offset = circumference - (clampedPercentage / 100) * circumference;

    return (
        <svg className="w-80 h-40" viewBox="0 0 100 50">
            <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#E4E4E4" strokeWidth="10" strokeLinecap="round" />
            <path
                d="M 10 45 A 40 40 0 0 1 90 45"
                fill="none"
                stroke="#0098FF"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
        </svg>
    );
}
