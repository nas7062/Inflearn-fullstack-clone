import InstructorPageName from "./_components/InstructorPageName";
import InstructorSidebar from "./_components/IntructorSidebar";
import React from "react";
export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <InstructorPageName />
      <div className="flex w-6xl mx-auto">
        <InstructorSidebar />
        {children}
      </div>
    </div>
  );
}