import React, { ReactNode } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

interface StartCardProps {
  icon?: ReactNode;
  title: string;
  value: string | number;
  total?: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  isLoading?: boolean;
}

const StartCard = (props:StartCardProps) => {
  if (props.isLoading) {
    return (
      <div className="bg-white/50 rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gray-50 rounded-lg w-8 h-8"></div>
          <div className="flex items-center gap-2 text-gray-400">
            <FaArrowUp size={10}/>
            <span className="flex text-sm font-medium">Loading...</span>
          </div>
        </div>
        <h3 className="text-gray-500 text-sm mb-1">Loading...</h3>
        <p className="text-2xl font-bold text-gray-900">...</p>
      </div>
    );
  };

  return (
    <div className="bg-white/50 rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {props.icon}
        </div>
        <div className={`flex flex-col items-end `}>
          <div className="text-md  text-primary-dark">
            <span>
              Total: {props.total}
            </span>
          </div>

        </div>

      </div>
      <h3 className="text-gray-500 text-sm mb-1">{props.title}</h3>
      <p className="text-2xl font-bold text-gray-900">{props.value}</p>
    </div>
  )
}

export default StartCard;