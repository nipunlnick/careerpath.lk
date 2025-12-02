# CareerPath.lk 🇱🇰

CareerPath.lk is a comprehensive career guidance platform designed specifically for Sri Lankan students. It helps users discover their ideal career paths through AI-powered assessments and provides detailed, step-by-step roadmaps for achieving their professional goals.

## 🚀 Features

- **AI-Powered Career Quizzes**:
  - **Quick Quiz**: 5 questions for instant career suggestions.
  - **In-Depth Assessment**: Detailed analysis of skills and personality.
- **Dynamic Roadmap Generation**: Uses Google's Gemini API to generate up-to-date career roadmaps tailored to the Sri Lankan context.
- **Comprehensive Roadmaps**:
  - Step-by-step educational and professional milestones.
  - Market insights (Salary, Demand, Future Outlook).
  - Downloadable as PDF or Image.
- **Admin Dashboard**:
  - Secure admin login.
  - Real-time statistics (Total Roadmaps, Views, Generated Counts).
  - Roadmap management (View, Delete).
- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS.

## 🔄 Website Flow

1.  **Discovery (Home Page)**

    - Users arrive at the landing page.
    - **Option A**: Browse career categories (e.g., Engineering, Medicine, IT).
    - **Option B**: Take a Career Quiz (Quick or In-Depth) to get personalized recommendations.

2.  **Assessment (Quiz)**

    - Users answer a series of questions about their interests and skills.
    - The system (powered by local logic + AI) analyzes responses.
    - **Result**: Users receive a list of top career matches with reasoning.

3.  **Guidance (Roadmap Page)**

    - Users select a career to view its full roadmap.
    - **Content**:
      - Timeline of steps (O/Ls, A/Ls, Degree, Internships, etc.).
      - Sri Lanka-specific market insights (Salary in LKR, Institutes).
    - **Actions**: Users can download the roadmap or explore related fields.

4.  **Administration (Admin Portal)**
    - Admins log in via `/admin/login`.
    - **Dashboard**: View site analytics (Total Views, Roadmaps) and manage content.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/careerpath.lk.git
    cd careerpath.lk
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=your_secure_password
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run the development server**:

    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and database models.
- `services/`: External service integrations (Gemini, etc.).
- `constants/`: Static data and configuration.
