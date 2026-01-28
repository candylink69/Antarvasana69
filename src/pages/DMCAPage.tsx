import { Link } from 'react-router-dom';

const DMCAPage = () => {
  return (
    <div className="page-container">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="story-title mb-4 text-3xl font-bold md:text-4xl">
            DMCA Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Digital Millennium Copyright Act Notice
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-invert max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Copyright Infringement Claims
              </h2>
              <p>
                Antarvasana69 respects the intellectual property rights of others 
                and expects users to do the same. We will respond to notices of 
                alleged copyright infringement that comply with the Digital 
                Millennium Copyright Act (DMCA).
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Filing a DMCA Notice
              </h2>
              <p className="mb-4">
                If you believe that your copyrighted work has been copied in a 
                way that constitutes copyright infringement, please provide us 
                with the following information:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>A physical or electronic signature of the copyright owner</li>
                <li>Identification of the copyrighted work claimed to be infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information (address, phone, email)</li>
                <li>A statement that you have a good faith belief that the use is not authorized</li>
                <li>A statement that the information is accurate and under penalty of perjury</li>
              </ul>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Contact for DMCA Notices
              </h2>
              <p>
                Please send all DMCA notices to our designated agent at:
              </p>
              <p className="mt-4 font-medium text-foreground">
                contact@antarvasana69.com
              </p>
            </section>

            <section className="rounded-lg bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Counter-Notice
              </h2>
              <p>
                If you believe your content was removed by mistake or 
                misidentification, you may submit a counter-notice with the 
                required information as specified by the DMCA.
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

export default DMCAPage;

