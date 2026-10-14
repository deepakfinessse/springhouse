"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import "../globals.css";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, SquareArrowOutUpRight } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Properties", href: "/admin/properties" },
    { name: "Solutions", href: "/admin/solutions" },
    { name: "Solution Listing", href: "/admin/solution-listing" },
    { name: "Cities", href: "/admin/cities" },
    { name: "Areas", href: "/admin/areas" },
    { name: "Amenities", href: "/admin/amenities" },
    { name: "Testimonials", href: "/admin/testimonials" },
    { name: "Public Relations", href: "/admin/prs" },
    { name: "Blogs", href: "/admin/blogs" },
    { name: "FAQ", href: "/admin/faq" },
    { name: "Homepage", href: "/admin/homepage" },
    { name: "About us", href: "/admin/about-us" },
    { name: "Other Pages", href: "/admin/other-pages" },
    { name: "Careers", href: "/admin/careers" },
    { name: "Enquires", href: "/admin/enquires" },
    { name: "Header", href: "/admin/header" },
    { name: "Footer", href: "/admin/footer" },
  ];

  return (
    <>
      <div className="flex h-screen bg-brand-light font-body">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
          <div className="flex bg-brand-primary p-4 items-center justify-center shadow-md">
            <img
              src="/assets/springhouse.webp"
              alt="logo"
              className="h-24 filter brightness-[11]"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* <p className="px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            Main Menu
          </p> */}
            <nav className="mt-4 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors uppercase no-underline ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <button className="flex w-full items-center uppercase justify-center rounded-lg bg-[#e6fffe] px-4 py-2 text-sm font-medium text-[#00AAA6] transition hover:bg-[#d9fcfc] cursor-pointer gap-4">
                View Website
                <SquareArrowOutUpRight size={16} />
              </button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64 flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between bg-white px-8 shadow-sm">
            <h2 className="font-heading text-xl text-brand-dark uppercase">
              {navItems.find((item) => item.href === pathname)?.name ||
                "Dashboard"}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition gap-3 hover:bg-red-100 cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
