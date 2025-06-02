import React from "react";

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[]; // hoặc bất kỳ kiểu nào payload chứa
  label?: string;
}

export const CustomTooltip: React.FC<TooltipProps>  = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded-lg shadow-lg">
        <p className="text-sm">{`${label}: £${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

