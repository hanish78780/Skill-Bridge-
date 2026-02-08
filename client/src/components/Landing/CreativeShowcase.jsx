import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreativeShowcase = () => {
    return (
        <section className="bg-gray-50 dark:bg-slate-900 w-full overflow-hidden py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Card 1: Global Talent Content */}
                <div className="relative bg-zinc-900 dark:bg-slate-800/50 rounded-[3rem] p-12 md:p-20 overflow-hidden border border-white/5 shadow-2xl">
                    {/* Background VR Effect */}
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1622979135228-5b1ed31720d2?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-color-dodge pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500 mb-6">
                                Global talent network
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-2">Post your job</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    It's free and easy! Get lots of competitive bids that suit your budget.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-2">Choose freelancers</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    No job is too big or complex. Find freelancers for jobs of any size.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-2">Pay safely</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Only pay for work when you are 100% satisfied. Protected payments.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-2">We're here to help</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Let our team of expert recruiters save you time finding talent.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Link to="/register" className="inline-block group">
                                <span className="px-8 py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                    Find Talent <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Card 2: Creative Showcase Grid */}
                <div className="bg-zinc-900 dark:bg-slate-800/50 rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-white">Inspiring Work</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-center">
                        <div className="space-y-4 translate-y-8">
                            {/* Dashboard UI */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                                    alt="Dashboard Interface"
                                    className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-4 -translate-y-8">
                            {/* Poster Art */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                                    alt="Poster Art"
                                    className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-4 translate-y-8">
                            {/* Product Design */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80"
                                    alt="Product Design"
                                    className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-4 -translate-y-8">
                            {/* Mobile App */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80"
                                    alt="Mobile App"
                                    className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CreativeShowcase;
