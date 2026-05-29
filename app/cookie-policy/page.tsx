"use client";

import React from "react";
import { usePageMeta } from "../../hooks/usePageMeta";

const CookiePolicy: React.FC = () => {
  usePageMeta(
    "Cookie Policy | CareerPath.lk",
    "Read the Cookie Policy of CareerPath.lk to understand how we use cookies and tracking technologies."
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Cookie Policy
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-6 text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>
          CareerPath.lk ("we," "our," or "us") uses cookies and similar tracking
          technologies on our website to analyze trends, administer the website,
          track users' movements around the website, and to gather demographic
          information about our user base as a whole.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          1. What Are Cookies?
        </h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile
          device when you visit a website. They are widely used to make websites
          work, or work more efficiently, as well as to provide information to
          the owners of the site.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          2. How We Use Cookies
        </h2>
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features.</li>
          <li><strong>Performance and Analytics Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
          <li><strong>Functionality Cookies:</strong> These cookies are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name, and remember your preferences.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          3. Your Choices Regarding Cookies
        </h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can
          exercise your cookie rights by setting your preferences in your web browser.
          As the means by which you can refuse cookies through your web browser
          controls vary from browser to browser, you should visit your browser's
          help menu for more information.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          4. Contact Us
        </h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please contact us at <a href="mailto:support@careerpath.lk" className="text-blue-600 hover:underline">support@careerpath.lk</a>.
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
