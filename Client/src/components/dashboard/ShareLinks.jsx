import { FiTwitter, FiLinkedin, FiFacebook, FiCopy } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ShareLinks() {
  const dashboardUrl = window.location.href;
  const shareText = "Check out my emotional journey on Saathi.AI!";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dashboardUrl);
    toast.success("Dashboard link copied!");
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: <FiTwitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        dashboardUrl
      )}&text=${encodeURIComponent(shareText)}`,
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin size={20} />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        dashboardUrl
      )}&title=${encodeURIComponent(shareText)}`,
      color: "hover:text-[#0A66C2]",
    },
    {
      name: "Facebook",
      icon: <FiFacebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        dashboardUrl
      )}`,
      color: "hover:text-[#1877F2]",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={20} />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareText + " " + dashboardUrl
      )}`,
      color: "hover:text-[#25D366]",
    },
  ];

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6 flex flex-col justify-center items-center text-center">
      <h2 className="text-xl font-semibold mb-2">Share Your Journey</h2>
      <p className="text-text-secondary text-sm mb-6 max-w-[200px]">
        Inspire others by sharing your emotional growth on social media.
      </p>

      <div className="flex gap-4 mb-4">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-full bg-background border border-borderColor transition-colors ${link.color}`}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>

      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium transition"
      >
        <FiCopy /> Copy Link
      </button>
    </div>
  );
}
