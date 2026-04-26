import React from 'react';
import signature from '../../assets/images/signaturenobackground.png';

export const CreatorWatermark = () => (
  <div className="creator-watermark" data-html2canvas-ignore="true">
    <img
      src={signature}
      alt="Created by Alay"
      className="creator-signature"
    />
    <div className="creator-socials">
      {/* Instagram */}
      <a
        href="https://www.instagram.com/alaybuilds?igsh=ZjM4dWtjaWFrMXly"
        target="_blank"
        rel="noreferrer"
        className="creator-social-link"
        title="Instagram @alaybuilds"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad)" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-grad)" />
        </svg>
      </a>
      {/* TikTok */}
      <a
        href="https://www.tiktok.com/@alaydev?_r=1&_t=ZS-954TvKctxc0"
        target="_blank"
        rel="noreferrer"
        className="creator-social-link"
        title="TikTok @alaydev"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" fill="#ffffff" />
        </svg>
      </a>
    </div>
  </div>
);
