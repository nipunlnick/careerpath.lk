"use client";

import React from "react";
import { usePageMeta } from "../../hooks/usePageMeta";

const TermsOfService: React.FC = () => {
  usePageMeta(
    "Terms of Service | CareerPath.lk",
    "Read the Terms of Service for using the CareerPath.lk platform."
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Terms of Service
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-6 text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>
          Welcome to CareerPath.lk. By accessing or using our website, you agree
          to be bound by these Terms of Service ("Terms"). If you do not agree
          to these Terms, please do not use our website.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          1. Use of Our Service
        </h2>
        <p>
          CareerPath.lk provides career guidance, roadmaps, and educational
          resources. You agree to use these services only for lawful purposes
          and in accordance with these Terms.
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>You must be at least 13 years old to use this service.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account information.
          </li>
          <li>
            You agree not to disrupt or interfere with the security or operation
            of the website.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          2. Intellectual Property
        </h2>
        <p>
          The content, features, and functionality of CareerPath.lk, including
          text, graphics, logos, and software, are the exclusive property of
          CareerPath.lk and are protected by copyright and other intellectual
          property laws.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          3. User Content
        </h2>
        <p>
          If you post comments or other content on the site, you grant us a
          non-exclusive, royalty-free, perpetual license to use, reproduce, and
          display such content in connection with the service. You represent
          that you own or have the necessary rights to the content you post.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          4. Disclaimer of Warranties
        </h2>
        <p>
          The information provided on CareerPath.lk is for general informational
          purposes only. We make no warranties, expressed or implied, regarding
          the accuracy, reliability, or completeness of this information. Your
          use of the website is at your own risk.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          5. Limitation of Liability
        </h2>
        <p>
          In no event shall CareerPath.lk or its team be liable for any
          indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of the website.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          6. Changes to Terms
        </h2>
        <p>
          We reserve the right to modify these Terms at any time. We will
          provide notice of any significant changes by posting the new Terms on
          this page. Your continued use of the website after any such changes
          constitutes your acceptance of the new Terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          7. Governing Law
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Sri Lanka, without regard to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
