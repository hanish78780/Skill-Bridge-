
import { motion } from 'framer-motion';

const StatsTicker = () => {
    return (
        <section className="bg-indigo-900 text-white py-12 relative overflow-hidden border-y border-indigo-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-indigo-800 md:divide-x-0">
                    {[
                        { label: 'Developers', value: '10k+' },
                        { label: 'Projects Created', value: '500+' },
                        { label: 'Countries', value: '50+' },
                        { label: 'Active Now', value: '1,204' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-300">
                                {stat.value}
                            </div>
                            <div className="text-indigo-300 font-medium tracking-wide text-sm mt-1 uppercase">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsTicker;
