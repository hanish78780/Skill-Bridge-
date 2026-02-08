import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, FileText, MessageCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Button from '../components/UI/Button';

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-900 dark:text-white">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="p-5 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/50">
                    {answer}
                </div>
            </motion.div>
        </div>
    );
};

const ContactForm = () => {
    const [status, setStatus] = useState('idle');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h3>
            {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-xl text-center">
                    <p className="font-bold">Message sent successfully!</p>
                    <p className="text-sm mt-1">We'll get back to you at hanishsinghal7878@gmail.com shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <select
                            id="subject"
                            name="subject"
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="feedback">Feedback</option>
                            <option value="bug">Report a Bug</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows="4"
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>
                    <Button type="submit" disabled={status === 'submitting'} className="w-full shadow-lg shadow-indigo-500/20">
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            )}
        </div>
    );
};

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            question: "How do I create a project?",
            answer: "To create a project, navigate to your Dashboard or the Projects page and click the 'Create Project' button. You'll need to fill in details like title, description, and required skills."
        },
        {
            question: "Is SkillBridge free to use?",
            answer: "SkillBridge offers both free and premium features. Browsing projects and creating a profile is free. Creating a project requires a nominal fee to maintain platform quality."
        },
        {
            question: "How can I join a team?",
            answer: "Browse the 'Discover Projects' page, find a project that matches your skills, and click 'Request to Join'. The project owner will review your profile and application."
        },
        {
            question: "How do I verify my profile?",
            answer: "Complete your profile by adding a bio, uploading an avatar, and listing your skills. Connecting your GitHub and LinkedIn accounts also helps build trust."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Hero Section */}
                <div className="bg-indigo-600 dark:bg-indigo-900 py-20 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden mb-12">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">How can we help you?</h1>
                        <p className="text-lg text-indigo-100 mb-8">Find answers, support, and guides for your SkillBridge journey.</p>

                        <div className="relative max-w-xl mx-auto">
                            <label htmlFor="faq-search" className="sr-only">Search</label>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="faq-search"
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 shadow-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    {/* Support Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-indigo-500 hover:-translate-y-1 transition-transform">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Detailed PDF guides on platform features and best practices.</p>
                            <a href="#" className="text-indigo-600 font-semibold hover:underline flex items-center">Download PDF Guide &rarr;</a>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-purple-500 hover:-translate-y-1 transition-transform">
                            <div className="bg-purple-50 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Community Forum</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Join the conversation, ask questions, and share your experiences.</p>
                            <a href="#" className="text-purple-600 font-semibold hover:underline">Visit Community &rarr;</a>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-pink-500 hover:-translate-y-1 transition-transform">
                            <div className="bg-pink-50 dark:bg-pink-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Contact Support</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Can't find what you need? Reach out to us directly.</p>
                            <a href="mailto:hanishsinghal7878@gmail.com" className="text-pink-600 font-semibold hover:underline">hanishsinghal7878@gmail.com &rarr;</a>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* FAQs */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq, index) => (
                                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default HelpCenter;
