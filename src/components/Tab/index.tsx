import React from "react";

interface TabItem {
  label: string;
  value?: string;
  alertCount?: number;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab?: string | null; // Accept activeTab from parent
  onTabChange: (value?: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  top?: string;
}

const Tabs: React.FC<TabsProps> = ({
                                     tabs,
                                     activeTab, // Use activeTab from props instead of useParams
                                     onTabChange,
                                     orientation = "horizontal",
                                     className = "",
                                     top = "20",
                                   }) => {
  const isVertical = orientation === "vertical";

  // Find current active tab - if activeTab is null/undefined, default to first tab
  const getCurrentTab = () => {
    if (activeTab === null || activeTab === undefined) {
      return tabs[0]?.value; // Default to first tab (All)
    }
    return activeTab;
  };

  const currentActiveTab = getCurrentTab();

  return (
    <div className={`${isVertical ? "flex" : ""} ${className}`}>
      {/* Tab Headers */}
      <div
        className={`sticky top-${top || 20} z-10 bg-white/1 backdrop-blur-lg
          ${isVertical
          ? "flex flex-col border-r-2 border-gray-200 min-w-[200px]"
          : "flex border-b-2 border-gray-200"
        }
        `}
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const isActive = currentActiveTab === tab.value;

          return (
            <button
              key={index}
              className={`
                relative px-6 py-3 transition-all duration-200
                ${isVertical ? "text-left" : ""}
                ${isActive
                ? `text-primary-dark ${
                  isVertical
                    ? "border-r-2 border-primary-dark bg-blue-50"
                    : "border-b-2 border-primary-dark"
                }`
                : "hover:bg-gray-50"
              }
              `}
              onClick={() => onTabChange(tab?.value)}
              role="tab"
              aria-selected={isActive}
            >
              <span>{tab.label}</span>
              {tab?.alertCount && tab?.alertCount > 0 ?
                <span className="absolute top-0 right-0 bg-red-500 aspect-square rounded-full p-1 h-6 w-6 flex items-center justify-center text-white text-xs">
                  {tab.alertCount}
                </span>
              :<></>}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={`p-6 ${isVertical ? "flex-1" : ""}`} role="tabpanel">
        {tabs.find((tab) => tab.value === currentActiveTab)?.content ||
          tabs[0]?.content || (
            <div className="text-gray-500">Select a tab to view content</div>
          )}
      </div>
    </div>
  );
};

export default Tabs;