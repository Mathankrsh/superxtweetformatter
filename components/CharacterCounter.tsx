"use client";

interface CharacterCounterProps {
    count: number;
    maxCount?: number;
}

export function CharacterCounter({ count, maxCount = 280 }: CharacterCounterProps) {
    const percentage = Math.min((count / maxCount) * 100, 100);
    const remaining = maxCount - count;

    const getColor = () => {
        if (count <= 200) return "#22c55e"; // green-500
        if (count <= 250) return "#eab308"; // yellow-500
        if (count <= 280) return "#f97316"; // primary orange
        return "#ef4444"; // red-500
    };

    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-muted"
                />
                {/* Progress circle */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={getColor()}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        transition: "stroke-dashoffset 0.3s ease",
                    }}
                />
            </svg>
            <span
                className="absolute text-xs font-medium"
                style={{ color: count > maxCount ? "#ef4444" : undefined }}
            >
                {remaining}
            </span>
        </div>
    );
}
