"use client";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/logo.png"
              alt="SmartTransit Logo"
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-xl font-bold text-white">SmartTransit</h2>
          </div>
          <p className="text-sm text-gray-400">
            A real-time public transport tracking solution for small cities,
            making commuting smarter, faster, and sustainable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="#solution" className="hover:text-white transition">
                Solution
              </a>
            </li>
            <li>
              <a href="#stakeholders" className="hover:text-white transition">
                Stakeholders
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Urban Mobility Report 2024
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-sky-500 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-blue-700 transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 px-6 text-sm flex flex-col md:flex-row justify-between items-center">
        <p>
          © {new Date().getFullYear()} SmartTransit. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">
            Terms & Conditions
          </a>
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
