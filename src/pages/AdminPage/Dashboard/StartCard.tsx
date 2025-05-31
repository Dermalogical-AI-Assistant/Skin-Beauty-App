import React, { ReactNode } from "react";

interface StartCardProps {
  icon?: ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
}

const StartCard = (props:StartCardProps) => {

  return (
    <div className="bg-white/50 rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {props.icon}
        </div>
        <span className={`text-sm font-medium ${
          props.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {props.change}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm mb-1">{props.title}</h3>
      <p className="text-2xl font-bold text-gray-900">{props.value}</p>
    </div>
  )
}

export default StartCard;