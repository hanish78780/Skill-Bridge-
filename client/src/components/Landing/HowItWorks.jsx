
import { motion } from 'framer-motion';
import { UserPlus, Code2, Users, Star } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        title: "Create Your Profile",
        desc: "Showcase your skills, experience, and availability to attract the right teams.",
        color: "bg-blue-500"
    },
    {
        icon: Code2,
        title: "Find a Project",
        desc: "Browse projects filtered by your tech stack and difficulty level.",
        color: "bg-indigo-500"
    },
    {
        icon: Users,
        title: "Collaborate",
        desc: "Join a team, use our Kanban board, and chat in real-time to build software.",
        color: "bg-purple-500"
    },
    {
        icon: Star,
        title: "Build Reputation",
        desc: "Get rated by peers, earn verification badges, and level up your career.",
        color: "bg-pink-500"
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How SkillBridge Works</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        From solo developer to team lead in four simple steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Decorator Line */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 pt-12 group hover:shadow-lg transition-all"
                        >
                            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <step.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">{step.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center text-sm leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
