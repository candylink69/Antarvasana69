import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center text-center">
      {/* 404 Text */}
      <h1 className="mb-4 text-8xl font-bold text-primary">404</h1>
      
      {/* Message */}
      <h2 className="mb-4 text-2xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>

      {/* Back Button */}
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <Home className="h-5 w-5" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

