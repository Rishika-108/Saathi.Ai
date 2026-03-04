import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer className="mt-0 border-t border-borderColor surface-elevated">

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Brand */}
        <div>
          <h2 className="text-lg font-semibold text-textPrimary">
            Saathi.AI
          </h2>

          <p className="mt-2 text-sm text-textSecondary max-w-sm">
            Reflect deeply. Understand your emotions. Grow consistently.
          </p>
        </div>

        {/* Social */}
        <div className="flex flex-col md:items-end">
          <h3 className="text-xs font-medium text-textPrimary mb-3">
            Connect
          </h3>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ Icon, href, label }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-md border border-borderColor surface hover:border-primary hover:bg-primary/10 transition-all duration-200"
              >
                <Icon
                  size={16}
                  className="text-textSecondary hover:text-primary transition-colors duration-200"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-borderColor py-3 text-center text-xs text-textSecondary">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-primary">Saathi.AI</span>
      </div>
    </footer>
  );
};

export default Footer;