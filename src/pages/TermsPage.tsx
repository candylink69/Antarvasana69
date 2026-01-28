import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="page-container">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="story-title mb-4 text-3xl font-bold md:text-4xl">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Please read these terms carefully before using our website
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-invert max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                1. Age Requirement
              </h2>
              <p>
                You must be at least 18 years of age to access this website. 
                By using this site, you confirm that you are of legal age in 
                your jurisdiction. We are not responsible for any unauthorized 
                access by minors.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                2. Content Guidelines
              </h2>
              <p>
                All content on this website is for entertainment purposes only. 
                Stories are works of fiction. Any resemblance to actual persons, 
                living or dead, or actual events is purely coincidental.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                3. Intellectual Property
              </h2>
              <p>
                All content on this site, including stories, graphics, and 
                design, is protected by copyright. You may not reproduce, 
                distribute, or create derivative works without written permission.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                4. User Conduct
              </h2>
              <p className="mb-4">Users agree not to:</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Attempt to copy or reproduce content from this website</li>
                <li>Use automated systems to access the site</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with the proper functioning of the website</li>
              </ul>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                5. Disclaimer
              </h2>
              <p>
                This website is provided "as is" without any warranties. We do 
                not guarantee uninterrupted access or that the site will be 
                error-free. Use of this site is at your own risk.
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                6. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. 
                Continued use of the website constitutes acceptance of any 
                changes.
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

export default TermsPage;

