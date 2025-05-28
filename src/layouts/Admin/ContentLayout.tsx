import React from "react";

interface AdminContentLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AdminContentLayout: React.FC<AdminContentLayoutProps> = (props) => {
  return (
    <div className="relative h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
     <div className={`flex flex-col h-full overflow-y-scroll`}>
       <div className="sticky top-0 z-30 backdrop-blur-lg py-6 px-6">
         <h1 className="text-2xl font-bold">{props.title}</h1>
         <p className="text-sm text-gray-500">
           {props.subtitle}
         </p>
       </div>

       {/* Controls */}
       <div className={`px-6`}>
         {props.children}
       </div>
     </div>
    </div>
  );
};

export default AdminContentLayout;