import Hero from '../components/Landing/Hero';
import StatsTicker from '../components/Landing/StatsTicker';
import HowItWorks from '../components/Landing/HowItWorks';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { Zap, Code, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <PageTransition>
            <div className="overflow-x-hidden">
                <Hero />
                <StatsTicker />
                <HowItWorks />

                {/* Features Grid (Refined) */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Code className="h-6 w-6 text-white" />,
                                    title: "Project Management",
                                    desc: "Track tasks with our intuitive Kanban board adapted for developers.",
                                    color: "bg-blue-600"
                                },
                                {
                                    icon: <Users className="h-6 w-6 text-white" />,
                                    title: "Team Formation",
                                    desc: "Find teammates based on time zone, tech stack, and experience.",
                                    color: "bg-purple-600"
                                },
                                {
                                    icon: <Zap className="h-6 w-6 text-white" />,
                                    title: "Skill Verification",
                                    desc: "Earn badges for your profile by completing real-world projects.",
                                    color: "bg-indigo-600"
                                }
                            ].map((feature, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={idx}
                                    className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 shadow-sm hover:shadow-xl transition-all group"
                                >
                                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">{feature.desc}</p>
                                    <Link to="/register" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                                        Learn more <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-indigo-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to accelerate your career?</h2>
                        <p className="text-indigo-200 text-xl mb-10 max-w-2xl mx-auto">
                            Join the community of developers building their future today. No credit card required.
                        </p>
                        <Link to="/register" className="inline-block bg-white text-indigo-900 font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-105 hover:shadow-white/20 transition-all text-lg">
                            Start Building Now
                        </Link>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default Home;
