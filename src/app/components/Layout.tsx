import { Outlet, Link, useLocation } from "react-router";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../i18n";

export function Layout() {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const englishNames = "Li Guancheng & Chen Yanying";

  const navItems = [
    { path: "/", label: language === "zh" ? "首页" : "Home" },
    { path: "/our-story", label: language === "zh" ? "我们的故事" : "Our Story" },
    { path: "/details", label: language === "zh" ? "婚礼信息" : "Details" },
    { path: "/rsvp", label: "RSVP" },
    { path: "/gallery", label: language === "zh" ? "相册和留言" : "Gallery" },
  ];

  const footerText = {
    names: language === "zh" ? "李官城和陈燕莹" : "Li Guancheng & Chen Yanying",
    date: language === "zh" ? "2026年5月2号" : "May 2, 2026",
    designed: language === "zh" ? "用爱设计" : "Designed with love",
    languageButton: language === "zh" ? "EN" : "中文",
  };

  return (
    <div className="min-h-screen bg-[#fdfbf8]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e8d5c4]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Monogram */}
            <Link to="/" className="flex items-center gap-2 group">
              <Heart className="w-6 h-6 text-[#b8997a] transition-transform group-hover:scale-110" />
              <span className="text-xl tracking-wider text-[#4a4238]" style={{ fontFamily: 'var(--font-serif)' }}>
                李 & 陈
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative text-sm tracking-wide uppercase text-[#4a4238] hover:text-[#b8997a] transition-colors"
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 h-0.5 bg-[#b8997a] bottom-[-8px]"
                    />
                  )}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleLanguage}
                className="border border-[#d9c3ae] px-3 py-2 text-xs tracking-[0.2em] uppercase text-[#4a4238] hover:bg-[#b8997a] hover:text-white transition-colors"
              >
                {footerText.languageButton}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className="border border-[#d9c3ae] px-3 py-2 text-xs tracking-[0.2em] uppercase text-[#4a4238]"
              >
                {footerText.languageButton}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="text-[#4a4238] p-2"
                aria-label={language === "zh" ? "切换菜单" : "Toggle menu"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#e8d5c4]/40 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm tracking-wide uppercase text-[#4a4238] hover:text-[#b8997a] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#4a4238] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-8 h-8 mx-auto mb-4 text-[#b8997a]" />
          <p className="text-sm tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            {footerText.names}
          </p>
          {language === "zh" && (
            <p className="text-sm tracking-wider uppercase opacity-80">
              {englishNames}
            </p>
          )}
          <p className="text-sm opacity-70">{footerText.date}</p>
          <p className="text-xs opacity-50 mt-4">
            {footerText.designed}
          </p>
        </div>
      </footer>
    </div>
  );
}
