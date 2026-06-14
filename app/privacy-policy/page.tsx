"use client";

import React from "react";
import { usePageMeta } from "../../hooks/usePageMeta";

const PrivacyPolicy: React.FC = () => {
  usePageMeta(
    "Privacy Policy | CareerPath.lk",
    "Read the privacy policy of CareerPath.lk to understand how we collect, use, and protect your data."
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        Privacy Policy
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-6 text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>
          CareerPath.lk ("we," "our," or "us") respects your privacy and is
          committed to protecting the personal information you may provide us
          through our website. This Privacy Policy explains what information we
          collect, how we use it, and the choices you have, in compliance with 
          applicable laws including the Sri Lanka Personal Data Protection Act, No. 9 of 2022.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          1. Information We Collect
        </h2>
        <p>
          We may collect personal information that you voluntarily provide to us
          when you:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Register for an account or sign up for our newsletter.</li>
          <li>Participate in quizzes, surveys, or assessments.</li>
          <li>Contact us via email or customer support forms.</li>
        </ul>
        <p>
          This information may include your name, email address, educational
          background, and career interests.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          2. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Provide, operate, and maintain our website.</li>
          <li>
            Personalize your experience and deliver tailored career roadmaps.
          </li>
          <li>Improve our services and develop new features.</li>
          <li>
            Communicate with you regarding updates, newsletters, or support.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          3. Your Data Protection Rights
        </h2>
        <p>
          Depending on your location and in accordance with Sri Lankan law, you have the right to:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Request access to your personal data.</li>
          <li>Request correction or deletion of your personal data.</li>
          <li>Object to or restrict the processing of your data.</li>
          <li>Withdraw consent for data processing at any time.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          4. Information Sharing
        </h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties unless we provide users with advance notice. This
          does not include website hosting partners and other parties who assist
          us in operating our website, conducting our business, or serving our
          users, so long as those parties agree to keep this information
          confidential.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          5. Cookies
        </h2>
        <p>
          We use cookies to enhance your experience. For detailed information on the 
          cookies we use and the purposes for which we use them, please refer to our 
          <a className="text-blue-600 hover:underline ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2">Cookie Policy</a>.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          6. Security
        </h2>
        <p>
          We implement a variety of security measures to maintain the safety of
          your personal information. However, no method of transmission over the
          Internet is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          7. Changes to This Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          8. Contact Us
        </h2>
        <p>
          If there are any questions regarding this privacy policy or your data rights, you may
          contact us at <a className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2">support@careerpath.lk</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
