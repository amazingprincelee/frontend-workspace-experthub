import React from "react";
import { useRouter } from "next/navigation";

export const SectionContainer = ({
  title,
  viewAllLink,
  children,
  isEmpty,
  emptyMessage,
}: {
  title: string;
  viewAllLink: string;
  children: React.ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
}) => {
  const router = useRouter();

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary">{title}</h2>
        <button
          onClick={() => router.push(viewAllLink)}
          className="text-primary font-heading font-semibold hover:underline text-sm sm:text-base"
        >
          View All
        </button>
      </div>
      {isEmpty ? (
        <p className="text-gray text-center py-4">{emptyMessage}</p>
      ) : (
        children
      )}
    </div>
  );
};