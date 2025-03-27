import React from 'react';

const FooterNav = () => {
  return (
    <footer className="bg-black text-white font-sans py-8">
      <div className="container mx-auto px-4 pt-8">
        {/* Footer Content Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo */}
          <div>
            <h2 className="text-primary font-heading text-lg font-bold">
              EXPERTHUB
            </h2>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-base font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Locations</a></li>
              <li><a href="#" className="hover:underline">Book a Tour</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-heading text-base font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Email</a></li>
              <li><a href="#" className="hover:underline">Contact Info</a></li>
              <li><a href="#" className="hover:underline">Head Office</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-base font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Career Opportunities</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">Customer Support</a></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="font-heading text-base font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Workspace Co. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterNav;