import React from "react";

interface TabItem {
  label: string;
  value?: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: number;
  onTabChange: (index: number, value?: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
                                     tabs,
                                     activeTab,
                                     onTabChange,
                                     orientation = "horizontal",
                                     className = ""
                                   }) => {
  const isVertical = orientation === "vertical";

  return (
    <div className={`${isVertical ? "flex" : ""} ${className}`}>
      {/* Tab Headers */}
      <div
        className={` sticky top-20 z-10  bg-white/1 backdrop-blur-lg
          ${isVertical
          ? "flex flex-col border-r-2 border-gray-200 min-w-[200px]"
          : "flex border-b-2 border-gray-200"
        }
        `}
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              px-6 py-3 transition-all duration-200
              ${isVertical ? "text-left" : ""}
              ${activeTab === index
              ? `text-primary-dark  ${
                isVertical
                  ? "border-r-2 border-primary-dark bg-blue-50"
                  : "border-b-2 border-primary-dark"
              }`
              : " hover:bg-gray-50"
            }
            `}
            onClick={() => onTabChange(index, tab?.value)}
            role="tab"
            aria-selected={activeTab === index}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`p-6 ${isVertical ? "flex-1" : ""}`} role="tabpanel">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;