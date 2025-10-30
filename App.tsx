import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RoadmapExplorer from "./components/RoadmapExplorer";
import CareerQuiz from "./components/CareerQuiz";
import LongCareerQuiz from "./components/LongCareerQuiz";
import QuizPerformanceDemo from "./components/QuizPerformanceDemo";
import About from "./components/About";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-yellow-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roadmaps" element={<RoadmapExplorer />} />
                <Route
                  path="/roadmaps/:careerPath"
                  element={<RoadmapExplorer />}
                />
                <Route path="/quiz" element={<CareerQuiz />} />
                <Route path="/long-quiz" element={<LongCareerQuiz />} />
                <Route path="/quiz-demo" element={<QuizPerformanceDemo />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
