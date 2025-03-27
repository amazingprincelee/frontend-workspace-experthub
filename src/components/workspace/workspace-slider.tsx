"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

const tabs = [
  "Office Space",
  "Coworking Desk",
  "Meeting Room",
  "Virtual Offices",
  "Membership",
];

const workspaceData = [
  {
    tab: "Office Space",
    title: "Private Office",
    description:
      "A range of ready-to use, fully equipped offices with everything you need to get started.",
    image: "/images/workspace-slider/meeting-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Office Space",
    title: "Custom Offices",
    description:
      "When off-the-shelf simply isnt enough. Customize all aspects of your space, including furniture and branding..",
    image: "/images/workspace-slider/training-room.png",
    reserveUrl: "/custome-page",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Office Space",
    title: "Day Offices",
    description:
      "A Professional on-demand office space. Perfect when you need to get your head down and do your best work.",
    image: "/images/workspace-slider/board-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    "tab": "Office Space",
    "title": "Monthly Offices",
    "description": "Enjoy flexible access to fully-equipped office spaces tailored to your needs, with the convenience of monthly plans.",
    "image": "/images/workspace-slider/board-room.png",
    "reserveUrl": "/reservation",
    "learnMoreUrl": "/learn-more/private-office"
},


  {
    tab: "Coworking Desk",
    title: "Dedicated Desk",
    description:
      "Rent as many desks as you need in a dynamic, shared office space. Business address and storage.",
    image: "/images/workspace-slider/meeting-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Coworking Desk",
    title: "Day Coworking",
    description:
      "On-demand access to inspiring, open-plan coworking spaces, so there's always a desk when you need one.",
    image: "/images/workspace-slider/training-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Coworking Desk",
    title: "Coworking membership",
    description:
      "Want to Hot Desk more regularly? Rent a desk for 5, 10 or unlimited days each month.",
    image: "/images/workspace-slider/board-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Meeting Room",
    title: "Meeting Room",
    description:
      "Perfect places to meet, collaborate, and conduct interviews, research groups, and appraisals. Available hourly and daily.",
    image: "/images/workspace-slider/meeting-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Meeting Room",
    title: "Training Room",
    description:
      "Perfect when you need a purpose-built space with desks, whiteboards, and screens/projectors for training sessions.",
    image: "/images/workspace-slider/training-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Meeting Room",
    title: "Board Rooms",
    description:
      "A professional on-demand office space perfect for board, management, and staff meetings.",
    image: "/images/workspace-slider/board-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Virtual Offices",
    title: "Online Workspace",
    description:
      "A range of ready-to use, fully equipped offices with everything you need to get started.",
    image: "/images/workspace-slider/meeting-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Virtual Offices",
    title: "Business Address",
    description:
      "When off-the-shelf simply isnt enough. Customize all aspects of your space, including furniture and branding..",
    image: "/images/workspace-slider/training-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Virtual Offices",
    title: "Virtual Office Standard",
    description:
      "A prestigious business address with telephone answering, a virtual receptionist, and access to meeting rooms and 5 days of physical office per month.",
    image: "/images/workspace-slider/board-room.png",
    reserveUrl: "/reservation",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Membership",
    title: "Instant Workspace Membership",
    description:
      "Our Instant Workspace Membership offers flexible access to workspaces when and where you need it. Ideal for those who need occasional access to a productive environment.",
    image: "/images/workspace-slider/meeting-room.png",
    reserveUrl: "/membership",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Membership",
    title: "Hot Desk Membership",
    description:
      "Enjoy access to shared workspaces across multiple locations. Simply pick a seat in any of our open areas, and get to work. Flexible and affordable—perfect for freelancers and mobile professionals.",
    image: "/images/workspace-slider/training-room.png",
    reserveUrl: "/membership",
    learnMoreUrl: "/learn-more/private-office",
  },
  {
    tab: "Membership",
    title: "Day Office Membership",
    description:
      "Flexible access to Day Offices where and when you choose with 5, 10 and unlimited days per month.",
    image: "/images/workspace-slider/board-room.png",
    reserveUrl: "/membership",
    learnMoreUrl: "/learn-more/private-office",
  },
];

const WorkspaceSlider: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Meeting Room");

  // Filter cards based on the active tab
  const filteredCards = workspaceData.filter((data) => data.tab === activeTab);

  return (
    <div className="container p-8 mt-5">
      <h1 className="text-3xl font-bold text-center mb-8">
        Book Our Workspaces
      </h1>
      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-8 border-b border-gray-200 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 relative transition-all ${
              activeTab === tab
                ? "text-primary font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary"
                : "text-gray-700 hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Swiper */}
      <Swiper
  spaceBetween={10} // Reduced space to make the next card partially visible
  slidesPerView={1.2} // Adjust to show part of the next card
  breakpoints={{
    640: { slidesPerView: 1.2 },
    768: { slidesPerView: 2.2 },
    1024: { slidesPerView: 3.2 }, // Adjust for different screen sizes
  }}
>
  {filteredCards.map((card, index) => (
    <SwiperSlide key={index} className="p-4">
      <div>
        <div className="relative h-96 rounded-md overflow-hidden shadow-lg">
          {/* Background Image */}
          <Image
            src={card.image}
            alt={card.title}
            width={500}
            height={256}
            className="w-full h-96 object-cover"
            priority
          />

          {/* Overlay Content */}
          <div
            className="absolute bottom-0 right-0 w-3/4 bg-primary text-black p-4"
            style={{ border: "4px solid #ffffff" }}
          >
            <h3 className="text-lg font-bold">{card.title}</h3>
            <p className="text-sm mt-2">{card.description}</p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-5 flex justify-between space-x-2">
          <a
            href={card.reserveUrl}
            className="bg-primary text-white px-4 py-2 rounded-2xl shadow hover:bg-yellow-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reserve
          </a>
          <a
            href={card.learnMoreUrl}
            className="bg-white text-primary px-4 py-2 rounded-2xl shadow hover:bg-yellow-600 border-solid border-2 border-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>
    </div>
  );
};

export default WorkspaceSlider;
