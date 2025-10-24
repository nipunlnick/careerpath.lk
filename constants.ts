import type { CareerCategory } from './types';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Roadmaps', path: '/roadmaps' },
  { name: 'Quick Quiz', path: '/quiz' },
  { name: 'About Us', path: '/about' },
];

export const EXPLORE_CAREERS: CareerCategory[] = [
  {
    name: 'Information Technology & Digital Careers',
    icon: 'Code',
    careers: [
      { name: 'Software Engineer / Developer', path: 'software-engineer' },
      { name: 'Web Developer / Mobile App Developer', path: 'web-mobile-developer' },
      { name: 'UI/UX Designer', path: 'ui-ux-designer' },
      { name: 'Data Analyst / Data Scientist', path: 'data-scientist' },
      { name: 'Network Engineer', path: 'network-engineer' },
      { name: 'Cybersecurity Specialist', path: 'cybersecurity-specialist' },
      { name: 'Cloud Engineer / DevOps Engineer', path: 'cloud-devops-engineer' },
      { name: 'IT Project Manager', path: 'it-project-manager' },
      { name: 'Game Developer', path: 'game-developer' },
      { name: 'AI / Machine Learning Engineer', path: 'ai-ml-engineer' },
    ],
  },
  {
    name: 'Business, Management & Finance',
    icon: 'TrendingUp',
    careers: [
      { name: 'Accountant / Auditor', path: 'accountant' },
      { name: 'Banker / Financial Analyst', path: 'banker-financial-analyst' },
      { name: 'Business Analyst', path: 'business-analyst' },
      { name: 'Marketing Executive / Brand Manager', path: 'marketing-manager' },
      { name: 'HR Manager', path: 'hr-manager' },
      { name: 'Project Coordinator', path: 'project-coordinator' },
      { name: 'Supply Chain Manager', path: 'supply-chain-manager' },
      { name: 'Entrepreneur / Startup Founder', path: 'entrepreneur' },
    ],
  },
  {
    name: 'Education & Training',
    icon: 'GraduationCap',
    careers: [
      { name: 'Teacher / Lecturer', path: 'teacher' },
      { name: 'Education Consultant', path: 'education-consultant' },
      { name: 'Curriculum Developer', path: 'curriculum-developer' },
      { name: 'Online Tutor / EdTech Content Creator', path: 'online-tutor' },
      { name: 'School Administrator', path: 'school-administrator' },
    ],
  },
  {
    name: 'Healthcare & Medical Fields',
    icon: 'Heart',
    careers: [
      { name: 'Doctor / Surgeon', path: 'doctor' },
      { name: 'Nurse / Midwife', path: 'nurse' },
      { name: 'Pharmacist', path: 'pharmacist' },
      { name: 'Medical Laboratory Technologist', path: 'medical-lab-technologist' },
      { name: 'Physiotherapist', path: 'physiotherapist' },
      { name: 'Nutritionist / Dietitian', path: 'nutritionist' },
      { name: 'Psychologist / Counselor', path: 'psychologist' },
    ],
  },
  {
    name: 'Engineering & Technical',
    icon: 'Cog',
    careers: [
      { name: 'Civil Engineer', path: 'civil-engineer' },
      { name: 'Mechanical Engineer', path: 'mechanical-engineer' },
      { name: 'Electrical Engineer', path: 'electrical-engineer' },
      { name: 'Electronic & Telecommunication Engineer', path: 'electronic-telecom-engineer' },
      { name: 'Mechatronics / Robotics Engineer', path: 'mechatronics-engineer' },
      { name: 'Quantity Surveyor', path: 'quantity-surveyor' },
      { name: 'Architect', path: 'architect' },
      { name: 'Draughtsman', path: 'draughtsman' },
      { name: 'Technician', path: 'technician' },
    ],
  },
  {
    name: 'Tourism, Hospitality & Travel',
    icon: 'Briefcase',
    careers: [
      { name: 'Hotel Manager', path: 'hotel-manager' },
      { name: 'Tour Guide', path: 'tour-guide' },
      { name: 'Travel Consultant', path: 'travel-consultant' },
      { name: 'Chef / Culinary Specialist', path: 'chef' },
      { name: 'Event Planner', path: 'event-planner' },
      { name: 'Airline Crew / Aviation Officer', path: 'airline-crew' },
    ],
  },
  {
    name: 'Media, Communication & Design',
    icon: 'Megaphone',
    careers: [
      { name: 'Journalist / News Reporter', path: 'journalist' },
      { name: 'Photographer / Videographer', path: 'photographer-videographer' },
      { name: 'Graphic Designer', path: 'graphic-designer' },
      { name: 'Content Creator / Influencer', path: 'content-creator' },
      { name: 'Social Media Manager', path: 'social-media-manager' },
      { name: 'Film Director / Editor', path: 'film-director-editor' },
      { name: 'Animator / Motion Designer', path: 'animator' },
    ],
  },
  {
    name: 'Agriculture, Environment & Sustainability',
    icon: 'Leaf',
    careers: [
      { name: 'Agricultural Officer', path: 'agricultural-officer' },
      { name: 'Environmental Scientist', path: 'environmental-scientist' },
      { name: 'Forestry / Wildlife Officer', path: 'forestry-wildlife-officer' },
      { name: 'Agribusiness Entrepreneur', path: 'agribusiness-entrepreneur' },
      { name: 'Renewable Energy Specialist', path: 'renewable-energy-specialist' },
    ],
  },
  {
    name: 'Law, Governance & Public Service',
    icon: 'Scale',
    careers: [
      { name: 'Lawyer / Attorney-at-law', path: 'lawyer' },
      { name: 'Legal Advisor', path: 'legal-advisor' },
      { name: 'Police Officer', path: 'police-officer' },
      { name: 'Government Officer (Administrative Service, Foreign Service, etc.)', path: 'government-officer' },
      { name: 'Politician / Policy Analyst', path: 'politician-policy-analyst' },
    ],
  },
  {
    name: 'Skilled Trades & Vocational Paths',
    icon: 'Cog',
    careers: [
      { name: 'Electrician', path: 'electrician' },
      { name: 'Carpenter', path: 'carpenter' },
      { name: 'Plumber', path: 'plumber' },
      { name: 'Welder / Mechanic', path: 'welder-mechanic' },
      { name: 'Tailor / Fashion Designer', path: 'fashion-designer' },
      { name: 'Beautician / Hairdresser', path: 'beautician' },
      { name: 'Vehicle Technician', path: 'vehicle-technician' },
    ],
  },
  {
    name: 'Freelance, Remote & Creative Economy',
    icon: 'Lightbulb',
    careers: [
      { name: 'Freelancer (Developer / Designer / Writer)', path: 'freelancer' },
      { name: 'Digital Marketer', path: 'digital-marketer' },
      { name: 'YouTuber / Podcaster', path: 'youtuber-podcaster' },
      { name: 'eCommerce Seller', path: 'ecommerce-seller' },
      { name: 'Virtual Assistant', path: 'virtual-assistant' },
    ],
  },
  {
    name: 'Emerging & Future Careers',
    icon: 'Target',
    careers: [
      { name: 'AI Researcher', path: 'ai-researcher' },
      { name: 'Blockchain Developer', path: 'blockchain-developer' },
      { name: 'Renewable Energy Engineer', path: 'renewable-energy-engineer' },
      { name: 'Drone Operator', path: 'drone-operator' },
      { name: 'Cybersecurity Analyst', path: 'cybersecurity-analyst' },
      { name: 'Data Ethics Officer', path: 'data-ethics-officer' },
      { name: 'AR/VR Developer', path: 'ar-vr-developer' },
    ],
  },
];


export const COMMON_CAREER_PATHS = [
  { name: 'Software Engineer', path: 'software-engineer', icon: 'Code' },
  { name: 'Doctor', path: 'doctor', icon: 'Heart' },
  { name: 'Accountant', path: 'accountant', icon: 'Briefcase' },
  { name: 'Civil Engineer', path: 'civil-engineer', icon: 'Cog' },
  { name: 'Marketing Manager', path: 'marketing-manager', icon: 'Megaphone' },
  { name: 'Graphic Designer', path: 'graphic-designer', icon: 'Palette' },
  { name: 'Lawyer', path: 'lawyer', icon: 'Scale' },
  { name: 'Teacher', path: 'teacher', icon: 'Book' },
  { name: 'Data Scientist', path: 'data-scientist', icon: 'Code' },
  { name: 'Nurse', path: 'nurse', icon: 'Heart' },
  { name: 'Architect', path: 'architect', icon: 'Cog' },
  { name: 'Hotel Manager', path: 'hotel-manager', icon: 'Briefcase' },
  { name: 'Chef', path: 'chef', icon: 'Briefcase' },
  { name: 'Psychologist', path: 'psychologist', icon: 'Heart' },
  { name: 'HR Manager', path: 'hr-manager', icon: 'Briefcase' },
  { name: 'Pharmacist', path: 'pharmacist', icon: 'Heart' },
  { name: 'Mechanical Engineer', path: 'mechanical-engineer', icon: 'Cog' },
  { name: 'Cybersecurity Specialist', path: 'cybersecurity-specialist', icon: 'Code' },
];

export const QUIZ_QUESTIONS = [
  {
    question: "Which of these activities do you enjoy the most?",
    options: [
      "Solving complex puzzles or math problems.",
      "Creating art, music, or stories.",
      "Helping and caring for others.",
      "Organizing projects and leading a team.",
      "Building or fixing things with your hands."
    ],
    key: "activity"
  },
  {
    question: "In a team project, what role do you naturally take on?",
    options: [
      "The leader, making decisions and delegating tasks.",
      "The creative one, coming up with new ideas.",
      "The analyst, focusing on data and logic.",
      "The supporter, ensuring everyone is working well together.",
      "The hands-on worker, executing the tasks."
    ],
    key: "role"
  },
  {
    question: "What kind of work environment do you prefer?",
    options: [
      "A fast-paced, dynamic office with lots of collaboration.",
      "A quiet, focused environment where I can concentrate.",
      "Outdoors or in a hands-on workshop.",
      "A creative studio or a flexible remote setting.",
      "A hospital, clinic, or a place where I can help people directly."
    ],
    key: "environment"
  },
  {
    question: "Which school subject did you find most interesting?",
    options: [
      "Mathematics or Physics",
      "Biology or Chemistry",
      "Art, Music, or Literature",
      "Business Studies or Economics",
      "History or Social Studies"
    ],
    key: "subject"
  },
  {
    question: "What is most important to you in a career?",
    options: [
      "High earning potential and financial security.",
      "Making a positive impact on society.",
      "Creative freedom and self-expression.",
      "Continuous learning and intellectual challenges.",
      "A stable and predictable work-life balance."
    ],
    key: "priority"
  }
];

export const LONG_QUIZ_QUESTIONS = [
  {
    question: "When faced with a complex problem, you are more likely to:",
    options: [
      "Break it down logically and analyze data to find the optimal solution.",
      "Brainstorm creative, unconventional ideas and experiment with different approaches.",
      "Collaborate with others to gather diverse perspectives and build consensus.",
      "Trust your intuition and past experiences to make a quick decision."
    ],
    key: "problemSolving"
  },
  {
    question: "Which work style best describes you?",
    options: [
      "Structured and organized: I prefer clear plans, deadlines, and predictable routines.",
      "Flexible and adaptable: I thrive in dynamic environments and enjoy tackling unexpected challenges.",
      "Independent and self-directed: I do my best work when I have autonomy and can manage my own projects.",
      "Collaborative and team-oriented: I get energized by working with others and sharing ideas."
    ],
    key: "workStyle"
  },
  {
    question: "What is your primary long-term career ambition?",
    options: [
      "To become a leading expert or specialist in my field.",
      "To climb the ladder and take on leadership and management responsibilities.",
      "To create my own business or work as a freelancer.",
      "To have a stable, secure job with a good work-life balance."
    ],
    key: "ambition"
  },
  {
    question: "You're most comfortable working with:",
    options: [
      "Data and abstract concepts (numbers, code, theories).",
      "People (helping, teaching, persuading, serving).",
      "Things (tools, machinery, physical objects, nature).",
      "Ideas and creative expression (designing, writing, innovating)."
    ],
    key: "workWith"
  },
  {
    question: "How do you prefer to learn new skills?",
    options: [
      "Through hands-on practice, trial, and error.",
      "By reading books, taking structured courses, and listening to experts.",
      "By observing others and getting mentorship.",
      "By deconstructing examples and understanding the underlying theory."
    ],
    key: "learningStyle"
  },
   {
    question: "How do you handle pressure and tight deadlines?",
    options: [
      "I become more focused and efficient, thriving on the challenge.",
      "I create a detailed plan and tackle tasks one by one.",
      "I find it stressful and prefer a calmer, more predictable pace.",
      "I communicate with my team to manage expectations and share the workload."
    ],
    key: "pressure"
  },
  {
    question: "What kind of impact do you want your work to have?",
    options: [
      "Innovate and create new technologies or products that change the world.",
      "Help individuals directly, improving their well-being or solving their problems.",
      "Contribute to the success and growth of an organization.",
      "Create art or content that inspires and entertains people."
    ],
    key: "impact"
  },
  {
    question: "When it comes to your work, you value:",
    options: [
      "Precision and accuracy, getting every detail right.",
      "The big picture and strategic thinking.",
      "Efficiency and productivity, finding the quickest way to get results.",
      "Creativity and originality, doing things in a new way."
    ],
    key: "workValue"
  },
  {
    question: "What is your attitude toward risk?",
    options: [
      "I'm a calculated risk-taker, willing to try new things if the potential reward is high.",
      "I'm cautious and prefer proven methods and stable environments.",
      "I'm an innovator, comfortable with high risk for a chance at a breakthrough.",
      "I avoid risk and prioritize security and stability above all."
    ],
    key: "riskAttitude"
  },
  {
    question: "A decade from now, you'd rather be known as:",
    options: [
      "A respected leader who built a successful team or company.",
      "A highly skilled expert whose opinion is sought after.",
      "A creative visionary who pushed the boundaries of their field.",
      "A reliable professional who made a steady, positive contribution."
    ],
    key: "reputation"
  },
  {
    question: "Which type of daily tasks would you find more fulfilling?",
    options: [
        "Engaging in a few long-term, deep-focus projects.",
        "Juggling a variety of different tasks and challenges throughout the day.",
        "Following a predictable routine with clearly defined tasks.",
        "Reacting to immediate needs and solving problems as they arise."
    ],
    key: "dailyTasks"
  },
  {
    question: "What does your ideal work-life balance look like?",
    options: [
        "A clear separation, with fixed hours and minimal work brought home.",
        "Integrated, where work and personal life can blend flexibly.",
        "Project-based, with intense work periods followed by significant downtime.",
        "I'm willing to dedicate long hours for a mission-driven or high-reward career."
    ],
    key: "workLifeBalance"
  },
  {
    question: "What gives you the greatest sense of professional satisfaction?",
    options: [
        "Completing a difficult task and achieving a tangible result.",
        "Seeing my ideas come to life and create something new.",
        "Receiving positive feedback and recognition from peers and leaders.",
        "Knowing that my work has helped someone or improved a system."
    ],
    key: "satisfactionSource"
  },
  {
    question: "When a project you're working on fails, what is your typical reaction?",
    options: [
        "Analyze what went wrong to learn for the next time.",
        "Feel discouraged, but bounce back quickly with a new approach.",
        "Seek feedback from others to understand different perspectives.",
        "Move on to the next challenge without dwelling on it."
    ],
    key: "failureReaction"
  },
  {
    question: "If you were leading a team, what would your style be?",
    options: [
        "Decisive and goal-oriented, providing clear direction.",
        "Collaborative and inclusive, seeking consensus from the team.",
        "Empowering and hands-off, trusting my team to deliver.",
        "Inspirational and visionary, motivating the team with a big-picture goal."
    ],
    key: "leadershipStyle"
  }
];