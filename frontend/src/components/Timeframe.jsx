import React from "react";

const Timeframe = ({ value, onChange, options }) => {
	const items = options?.length ? options : ["Daily", "Weekly", "Monthly"];

	return (
		<div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
			{items.map((label) => {
				const isActive = value === label;
				return (
					<button
						key={label}
						type="button"
						onClick={() => onChange?.(label)}
						className={`px-3 py-1.5 text-xs md:text-sm rounded-md transition-colors ${
							isActive ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-100"
						}`}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
};

export default Timeframe;
