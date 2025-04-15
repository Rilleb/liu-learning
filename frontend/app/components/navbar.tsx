"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const pathname = usePathname(); // Get the current path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/create", label: "Create" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50"
        aria-label="Toggle menu"
      >
        <div className="w-6 flex flex-col gap-1">
          <span className="h-0.5 w-full bg-black"></span>
          <span className="h-0.5 w-full bg-black"></span>
          <span className="h-0.5 w-full bg-black"></span>
        </div>
      </button>

      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 h-screen w-48 bg-red-400 transform transition-transform duration-300 z-40 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} justify-items-center`}
      >
        <ul className="flex flex-col mt-16 p-4 text-3xl font-stretch-150%">
          {navLinks.map(({ href, label }) => ( // Iterate over each entry in navlinks
            <li key={href}>
              <Link
                href={href}
                className={`block px-4 py-4 rounded ${pathname === href ? "bg-gray-200 font-bold" : "hover:bg-gray-100"}`}
              >
                {label}
              </Link>
            </li>
          ))}

        </ul>
      </div>
    </>
  );
}

