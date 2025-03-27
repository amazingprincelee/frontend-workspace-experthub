import React from "react";
import HeaderNav from "../../components/HeaderNav"
import FooterNav from "@/components/FooterNav";

const CustomizeWorkspaceForm = () => {
  return (
    <div> 
    <div className="flex flex-row justify-center items-center h-screen mt-24 space-x-8">
      {/* Left Side - Form */}
      <div className="basis-3/5 max-w-xl p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-orange-500 font-heading">
          Customize <span className="text-gray-900">Your Workspace</span>
        </h1>
        <form className="mt-6 font-sans">
          {/* Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where are you interested customizing
            </label>
            <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500">
              <option>Office Space</option>
              <option>Conference Room</option>
              <option>Co-Working Space</option>
              <option>Other</option>
            </select>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Alex Morgan"
              className="w-full border-primary rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="alex.morgan@example.com"
              className="w-full border-primary rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+234 812 345 6789"
              className="w-full border-primary rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Company Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              placeholder="UrbanHive Innovations"
              className="w-full border-primary rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us more about what you are looking for?
            </label>
            <textarea
              rows={4}
              placeholder=""
              className="w-full border-primary rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            REQUEST YOUR QUOTE
          </button>

          {/* Privacy Policy */}
          <p className="mt-4 text-sm text-gray-600">
            By selecting this you agree to our privacy policy.{" "}
            <a href="/privacy-policy" className="text-orange-500 hover:underline">
              Privacy policy
            </a>
          </p>
        </form>
      </div>

      {/* Right Side */}
      <div className="basis-2/5 text-center">
        {/* <h2 className="text-3xl font-semibold text-gray-800">Right Side</h2>
        <p className="mt-4 text-gray-600">
          Add more details or an image here to provide additional information.
        </p> */}
      </div>
    </div>
    </div>
  );
};

export default CustomizeWorkspaceForm;
