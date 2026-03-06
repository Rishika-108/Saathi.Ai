import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-borderColor/60 bg-surface/50 backdrop-blur-sm py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand & Copy */}
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-primary">
            Saathi.AI
          </h2>
          <span className="hidden sm:inline text-borderColor/60">|</span>
          <span className="text-[12px] text-textSecondary">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {socialLinks.map(({ Icon, href, label }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-1.5 rounded-full text-textSecondary hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;