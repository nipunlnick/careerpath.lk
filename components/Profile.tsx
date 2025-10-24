import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { SavedRoadmap } from '../types';
import { Book, Briefcase, CheckCircle, GraduationCap, Lightbulb, Money, Target } from './icons';
import { usePageMeta } from '../hooks/usePageMeta';

const Profile: React.FC = () => {
    usePageMeta(
        "Your Profile | CareerPath.lk",
        "View your user profile and access your saved career roadmap on CareerPath.lk."
    );
    const { currentUser } = useAuth();
    const [savedRoadmap, setSavedRoadmap] = useState<SavedRoadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoadmap = async () => {
            if (currentUser && db) {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists() && docSnap.data().savedRoadmap) {
                        setSavedRoadmap(docSnap.data().savedRoadmap as SavedRoadmap);
                    }
                } catch (err) {
                    console.error("Error fetching roadmap:", err);
                    setError("Failed to load your saved roadmap.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [currentUser]);

    const getIconForStep = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('degree') || lowerTitle.includes('bachelor')) return <GraduationCap className="w-6 h-6 text-white" />;
        if (lowerTitle.includes('a/l') || lowerTitle.includes('o/l') || lowerTitle.includes('foundation')) return <Book className="w-6 h-6 text-white" />;
        if (lowerTitle.includes('internship') || lowerTitle.includes('entry-level') || lowerTitle.includes('job')) return <Briefcase className="w-6 h-6 text-white" />;
        if (lowerTitle.includes('skill') || lowerTitle.includes('certification')) return <Lightbulb className="w-6 h-6 text-white" />;
        if (lowerTitle.includes('specialize') || lowerTitle.includes('senior')) return <Target className="w-6 h-6 text-white" />;
        return <CheckCircle className="w-6 h-6 text-white" />;
    };

    if (loading) {
        return (
            <div className="text-center mt-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Profile</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Welcome, <span className="font-semibold text-green-600 dark:text-green-400">{currentUser?.email}</span></p>
            </div>

            {savedRoadmap ? (
                <div>
                    <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">Your Saved Roadmap</h2>
                    <p className="text-center text-xl font-semibold text-green-700 dark:text-green-400 mb-8">{savedRoadmap.field}</p>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                        Saved on: {new Date(savedRoadmap.savedAt.seconds * 1000).toLocaleDateString()}
                        <br/>
                        <Link to="/roadmaps" className="text-green-600 hover:underline dark:text-green-400">Want to explore a new path?</Link>
                    </p>
                    
                    <div className="relative border-l-2 border-green-200 dark:border-green-700 ml-6">
                        {savedRoadmap.roadmap.map((step, index) => (
                            <div key={index} className="mb-10 ml-10">
                                <span className="absolute -left-6 flex items-center justify-center w-12 h-12 bg-green-600 rounded-full ring-8 ring-white dark:ring-gray-900">
                                    {getIconForStep(step.title)}
                                </span>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-green-800 dark:text-green-300">{step.step}. {step.title}</h3>
                                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{step.duration}</span>
                                    </div>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">{step.description}</p>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div><h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Qualifications:</h4><ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">{step.qualifications.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
                                        <div><h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Key Skills:</h4><ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">{step.skills.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                        <div><h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Recommended Institutes:</h4><ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">{step.institutes.map((inst, i) => <li key={i}>{inst}</li>)}</ul></div>
                                        <div className="flex items-start"><Money className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5"/><div><h4 className="font-semibold text-gray-800 dark:text-gray-200">Est. Salary (Monthly):</h4><p className="text-green-700 dark:text-green-400 font-medium">{step.salaryRangeLKR}</p></div></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Saved Roadmap</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">You haven't saved a career roadmap yet. Head over to the Roadmap Explorer to generate and save your personalized path!</p>
                    <Link to="/roadmaps" className="mt-6 inline-block bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transform hover:-translate-y-1 transition-all duration-300">
                        Explore Roadmaps
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Profile;