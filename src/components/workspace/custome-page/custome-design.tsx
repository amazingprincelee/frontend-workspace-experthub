// components/CustomWorkspace.tsx
import React from "react";
import Image from "next/image";
import { FaPencilRuler, FaPaintBrush, FaHandshake, FaBuilding } from "react-icons/fa";
import Link from "next/link"; //

const CustomDesign: React.FC = () => {
  return (
    <section className="mt-24 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className=" flex gap-7">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 font-heading">
              Your Office,{" "}
              <span className="text-primary">Custom-Designed</span> Your Way.
            </h1>

            {/* Buttons */}
            <div className="mt-16 flex gap-4">
              <Link href="/custome-form" className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600 transition">
                Get a Quote
              </Link>
              <button className="border border-black text-black px-6 py-3 rounded-lg shadow hover:bg-orange-100 transition">
                Find Workspace
              </button>
            </div>
          </div>

          <p className="mt-8 text-lg text-gray-600 font-sans">
            From layout to furnishings, we create a custom workspace that suits
            your team&apos;s needs, style, and brand—enhancing productivity and
            leaving a lasting impression.
          </p>
        </div>

        {/* Image */}<div className="mt-28 relative h-[600px] w-full">
  <div className="relative h-full w-full">
    <Image
      src="/images/customize-design.png"
      alt="Custom Office"
      layout="fill" // Ensures the image fills the container
      objectFit="cover" // Makes the image cover the container without distortion
      objectPosition="center" // Ensures the image is centered within the container
      className="rounded-lg shadow-lg"
    />
    <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`border border-white ${
            i === 4 ? "bg-transparent" : ""
          }`}
        ></div>
      ))}
    </div>
  </div>
</div>


        {/* Features */}
<div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Feature 1 */}
  <div className="text-center">
    <FaPencilRuler className="text-orange-500 mx-auto text-4xl" /> {/* Icon */}
    <h3 className="mt-4 text-xl font-semibold text-gray-900">Designed Layout</h3>
    <p className="mt-2 text-gray-600">
      Choose from open spaces, private offices, or a mix to suit your team.
    </p>
  </div>

  {/* Feature 2 */}
  <div className="text-center">
    <FaPaintBrush className="text-orange-500 mx-auto text-4xl" /> {/* Icon */}
    <h3 className="mt-4 text-xl font-semibold text-gray-900">Custom Branding</h3>
    <p className="mt-2 text-gray-600">
      Showcase your brand through personalized design elements.
    </p>
  </div>

  {/* Feature 3 */}
  <div className="text-center">
    <FaHandshake className="text-orange-500 mx-auto text-4xl" /> {/* Icon */}
    <h3 className="mt-4 text-xl font-semibold text-gray-900">Flexible Lease</h3>
    <p className="mt-2 text-gray-600">
      Short or long-term leases to match your growth.
    </p>
  </div>

  {/* Feature 4 */}
  <div className="text-center">
    <FaBuilding className="text-orange-500 mx-auto text-4xl" /> {/* Icon */}
    <h3 className="mt-4 text-xl font-semibold text-gray-900">Premium Amenities</h3>
    <p className="mt-2 text-gray-600">
      Fully-equipped spaces with high-speed internet, utilities, and more.
    </p>
  </div>
</div>
      </div>
    </section>
  );
};

export default CustomDesign;
