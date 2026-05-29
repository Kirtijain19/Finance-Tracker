import React from "react";
import { formatCurrency } from "./Helpers";

const Gaugecard = ({ title, value, percent, color, icon }) => {
	const safePercent = Math.min(Math.max(percent || 0, 0), 100);
	const gradient = color || "#14b8a6";
	const radius = 50;
	const circumference = 2 * Math.PI * radius;
	const halfCircumference = circumference / 2;
	const dashOffset = halfCircumference - (halfCircumference * safePercent) / 100;

	return (
		<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 text-gray-700 font-semibold">
					<span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
						{icon}
					</span>
					{title}
				</div>
				<span className="text-xs text-gray-500">{safePercent}%</span>
			</div>

			<div className="mt-4 flex items-center justify-center">
				<div className="relative w-36 h-20">
					<svg viewBox="0 0 120 70" className="w-full h-full">
						<circle
							cx="60"
							cy="60"
							r={radius}
							fill="transparent"
							stroke="#eef2f7"
							strokeWidth="10"
							strokeDasharray={`${halfCircumference} ${circumference}`}
							strokeLinecap="round"
							transform="rotate(180 60 60)"
						/>
						<circle
							cx="60"
							cy="60"
							r={radius}
							fill="transparent"
							stroke={gradient}
							strokeWidth="10"
							strokeDasharray={`${halfCircumference} ${circumference}`}
							strokeDashoffset={dashOffset}
							strokeLinecap="round"
							transform="rotate(180 60 60)"
						/>
					</svg>
					<div className="absolute inset-x-0 bottom-0 text-center">
						<p className="text-lg font-bold text-gray-800">{formatCurrency(value)}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Gaugecard;
