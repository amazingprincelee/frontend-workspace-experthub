import React from "react";
import Image from "next/image";

const MembershipOffers: React.FC = () => {
  return (
    <div className="mt-24 py-12">
      <h2 className="text-center font-heading text-4xl font-bold text-gray-800 mb-8">
        Our Membership Offers
      </h2>
      <div className="max-w-4xl mt-20 mx-auto flex flex-col lg:flex-row gap-6 px-4">
        {/* Instant Workspace Membership */}
        <div className="bg-orange-100 shadow-xl shadow-gray-800 rounded-lg overflow-hidden border-b-4 border-primary flex-1">
          <div className="relative w-full h-96">
            <Image
              src="/images/membership/instant-workingplace.png"
              alt="Instant Workspace Membership"
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">
              Instant Workspace Membership
            </h3>
            <p className="text-gray-600 font-sans">
              For professionals on the go, our Instant Workspace Membership
              offers flexible access to workspaces when and where you need it.
              Ideal for those who need occasional access to a productive
              environment.
            </p>
          </div>
        </div>

        {/* Hot Desk Membership */}
        <div className="bg-orange-100 shadow-xl shadow-gray-800 rounded-lg overflow-hidden border-b-4 border-primary flex-1">
          <div className="relative w-full h-96">
            <Image
              src="/images/membership/hot-desk.png"
              alt="Hot Desk Membership"
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 font-heading">
              Hot Desk Membership
            </h3>
            <p className="text-gray-600 font-sans">
              Enjoy access to shared workspaces across multiple locations.
              Simply pick a seat in any of our open areas, and get to work.
              Flexible and affordable—perfect for freelancers and mobile
              professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipOffers;
