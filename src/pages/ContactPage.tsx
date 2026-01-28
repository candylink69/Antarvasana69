import { useState, useEffect } from 'react';
import { dataSource } from '@/lib/dataSource';
import { Mail, Instagram } from 'lucide-react';

const ContactPage = () => {
  const [contact, setContact] = useState({ email: '', instagram: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await dataSource.getSiteConfig();
        setContact(config.contact);
      } catch (error) {
        console.error('Failed to load contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return (
    <div className="page-container">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="story-title mb-4 text-3xl font-bold md:text-4xl">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions or feedback? Reach out to us.
          </p>
        </header>

        {/* Contact Cards */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-lg bg-card"></div>
            <div className="h-24 animate-pulse rounded-lg bg-card"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Email */}
            <a
              href={`mailto:${contact.email}`}
              className="story-card flex items-center gap-4 p-6 transition-colors hover:border-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">{contact.email}</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="story-card flex items-center gap-4 p-6 transition-colors hover:border-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Instagram className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Instagram</h3>
                <p className="text-muted-foreground">{contact.instagram}</p>
              </div>
            </a>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 rounded-lg bg-card p-6 text-center">
          <p className="text-muted-foreground">
            We typically respond within 24-48 hours. For urgent matters, 
            please reach out via Instagram DM.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

