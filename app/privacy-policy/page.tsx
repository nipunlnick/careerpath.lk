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
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Privacy Policy
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-6 text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>
          CareerPath.lk ("we," "our," or "us") respects your privacy and is
          committed to protecting the personal information you may provide us
          through our website. This Privacy Policy explains what information we
          collect, how we use it, and the choices you have.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          3. Information Sharing
        </h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties unless we provide users with advance notice. This
          does not include website hosting partners and other parties who assist
          us in operating our website, conducting our business, or serving our
          users, so long as those parties agree to keep this information
          confidential.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          4. Cookies
        </h2>
        <p>
          We use cookies to enhance your experience. You can choose to have your
          computer warn you each time a cookie is being sent, or you can choose
          to turn off all cookies. If you turn cookies off, some features will
          be disabled.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          5. Security
        </h2>
        <p>
          We implement a variety of security measures to maintain the safety of
          your personal information when you enter, submit, or access your
          personal information. However, no method of transmission over the
          Internet is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          6. Changes to This Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          7. Contact Us
        </h2>
        <p>
          If there are any questions regarding this privacy policy, you may
          contact us using the information on our website.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
