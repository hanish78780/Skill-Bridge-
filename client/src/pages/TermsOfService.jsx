import PageTransition from '../components/PageTransition';

const TermsOfService = () => {
    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="prose dark:prose-invert lg:prose-lg mx-auto">
                    <h1>Terms of Service</h1>
                    <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Agreement to Terms</h3>
                    <p>By accessing our website, you agree to be bound by these Terms of Service and to verify that you have read our Privacy Policy.</p>

                    <h3>2. Intellectual Property Rights</h3>
                    <p>Other than content you own, which you may have opted to include on this Website, under these Terms, SkillBridge and/or its licensors own all rights to the intellectual property and material contained in this Website.</p>

                    <h3>3. Restrictions</h3>
                    <p>You are specifically restricted from all of the following:</p>
                    <ul>
                        <li>Publishing any Website material in any other media;</li>
                        <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                        <li>Publicly performing and/or showing any Website material;</li>
                        <li>Using this Website in any way that is or may be damaging to this Website;</li>
                        <li>Using this Website in any way that impacts user access to this Website;</li>
                    </ul>

                    <h3>4. Service Availability</h3>
                    <p>We do not guarantee that our site, or any content on it, will always be available or be uninterrupted. We may suspend or withdraw or restrict the availability of all or any part of our site for business and operational reasons.</p>
                </article>
            </div>
        </PageTransition>
    );
};

export default TermsOfService;
