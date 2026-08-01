import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center text-center px-4">
      <div className="bg-muted rounded-full p-6 mb-8">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
        The page you are looking for doesn't exist or has been moved to another structural node.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link to="/">Return Home</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
