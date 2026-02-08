import PageTransition from '../components/PageTransition';

const PrivacyPolicy = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Privacy Policy</h1>
                            <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="prose prose-indigo dark:prose-invert max-w-none">
                            <h3>1. Introduction</h3>
                            <p>
                                Welcome to SkillBridge. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </p>

                            <h3>2. Data We Collect</h3>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul>
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Profile Data:</strong> includes your username, password, projects created, skills, and feedback.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                            </ul>

                            <h3>3. How We Use Your Data</h3>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul>
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>

                            <h3>4. Data Security</h3>
                            <p>
                                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>

                            <h3>5. Contact Details</h3>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                <a href="mailto:hanishsinghal7878@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">hanishsinghal7878@gmail.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PrivacyPolicy;
