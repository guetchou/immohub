import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface SocialShareProps {
  title: string;
  url: string;
}

const SocialShare = ({ title, url }: SocialShareProps) => {
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Lien copié dans le presse-papier');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('facebook')}
        className="hover:text-blue-600"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('twitter')}
        className="hover:text-blue-400"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('linkedin')}
        className="hover:text-blue-700"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('copy')}
        className="hover:text-gray-700"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialShare;