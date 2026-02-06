
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    const words = ["Projects", "Mentors", "Collaboration", "Opportunity"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px] dark:bg-purple-900/20"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] dark:bg-indigo-900/20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold tracking-wide border border-indigo-100 dark:border-indigo-800"
                    >
                        🚀 The #1 Platform for Developers
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1]">
                        Find your next <br />
                        <span className="relative inline-block h-[1.1em] overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            <motion.span
                                key={index}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "backOut" }}
                                className="absolute left-0 top-0"
                            >
                                {words[index]}
                            </motion.span>
                            <span className="invisible">{words[0]}</span> {/* Spacer */}
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg"
                    >
                        Join thousands of developers using SkillBridge to collaborate on projects, track progress with Kanban, and build a portfolio that gets you hired.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link to="/register">
                            <Button size="lg" className="w-full sm:w-auto text-lg shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform">
                                Get Started Free <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/projects">
                            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                                Explore Projects
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="flex items-center gap-6 pt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Free Forever
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> No Credit Card
                        </div>
                    </div>
                </div>

                {/* Parallax Image Section */}
                <motion.div
                    style={{ y: y1 }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-20 blur-2xl animate-pulse"></div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        <div className="rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                                alt="Team Collaboration"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
