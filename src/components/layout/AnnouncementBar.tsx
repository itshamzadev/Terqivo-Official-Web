import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../SettingsContext';

export function AnnouncementBar() {
  const { settings, isLoading } = useSettings();

  if (isLoading || !settings?.announcement?.enabled) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
      <div className="container mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span>{settings.announcement.text}</span>
        {settings.announcement.linkLabel && (
          <Link 
            to={settings.announcement.linkUrl} 
            target={settings.announcement.openInNewTab ? "_blank" : undefined}
            rel={settings.announcement.openInNewTab ? "noopener noreferrer" : undefined}
            className="inline-flex items-center underline underline-offset-4 hover:text-accent transition-colors"
          >
            {settings.announcement.linkLabel} <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
