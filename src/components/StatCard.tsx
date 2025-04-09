import React from "react";

export const StatCard = ({ icon, title, value, bgColor }: { icon: React.ReactNode, title: string, value: number, bgColor: string }) => (
  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border flex items-center space-x-3">
    <div className={`p-2 sm:p-3 ${bgColor} rounded-full`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xs sm:text-sm font-heading text-gray">{title}</h3>
      <p className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-primary">{value}</p>
    </div>
  </div>
);