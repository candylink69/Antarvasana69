import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="page-container">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="story-title mb-4 text-3xl font-bold md:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Your privacy is important to us
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-invert max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Information We Collect
              </h2>
              <p>
                We use localStorage to store your age verification consent. 
                We do not collect personal information unless you voluntarily 
                provide it through our contact form.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Cookies and Tracking
              </h2>
              <p>
                We may use cookies to improve your browsing experience. 
                Third-party services (such as advertising partners) may also 
                use cookies. You can disable cookies in your browser settings.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                How We Use Information
              </h2>
              <p className="mb-4">Information collected may be used to:</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Verify you are of legal age to access content</li>
                <li>Improve website functionality</li>
                <li>Respond to your inquiries</li>
                <li>Analyze site usage patterns</li>
              </ul>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Third-Party Services
              </h2>
              <p>
                Our website may contain links to external sites or use 
                third-party services for analytics and advertising. These 
                services have their own privacy policies.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Data Security
              </h2>
              <p>
                We implement reasonable security measures to protect your 
                information. However, no internet transmission is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Contact Us
              </h2>
              <p>
                If you have questions about this privacy policy, please contact 
                us at contact@antarvasana69.com.
              </p>
            </section>
          </div>
        </article>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

