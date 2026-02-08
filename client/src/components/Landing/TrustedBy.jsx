import { motion } from 'framer-motion';

const TrustedBy = () => {
    const logos = [
        { name: "The New York Times", font: "font-serif" },
        { name: "CNBC", font: "font-bold" },
        { name: "The Wall Street Journal", font: "font-serif italic" },
        { name: "CNN", font: "font-black tracking-tighter" },
        { name: "Bloomberg", font: "font-semibold" },
        { name: "Yahoo! Finance", font: "font-bold text-purple-600" },
        { name: "Business Insider", font: "font-bold tracking-tight" },
        { name: "Forbes", font: "font-serif font-bold" }
    ];

    return (
        <section className="bg-gray-50 dark:bg-slate-900 py-10 border-b border-gray-200 dark:border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex overflow-hidden relative">
                    {/* Gradient Masks for fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-900 z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-slate-900 z-10"></div>

                    <motion.div
                        className="flex gap-16 items-center whitespace-nowrap"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            },
                        }}
                    >
                        {/* Duplicate logos 3 times to ensure seamless loop */}
                        {[...logos, ...logos, ...logos].map((logo, idx) => (
                            <span
                                key={idx}
                                className={`text-2xl sm:text-3xl text-gray-400 dark:text-gray-600 font-bold cursor-default ${logo.font} hover:text-gray-600 dark:hover:text-gray-400 transition-colors`}
                            >
                                {logo.name}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;
