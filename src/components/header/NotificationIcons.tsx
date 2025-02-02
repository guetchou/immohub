import { Link } from "react-router-dom";
import { MessageSquare, Heart, Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationIconsProps {
  unreadMessages: number;
  favoritesCount: number;
  isAuthenticated: boolean;
}

const NotificationIcons = ({ unreadMessages, favoritesCount, isAuthenticated }: NotificationIconsProps) => {
  return (
    <>
      {isAuthenticated && (
        <>
          <Link to="/favorites">
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 relative">
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-real-primary">
                  {favoritesCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/messages">
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 relative">
              <MessageSquare className="h-5 w-5" />
              {unreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-real-primary">
                  {unreadMessages}
                </Badge>
              )}
            </Button>
          </Link>
        </>
      )}

      <Link to="/calculator">
        <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
          <Calculator className="h-5 w-5" />
        </Button>
      </Link>

      <Link to="/customer-service">
        <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
          <Phone className="h-5 w-5" />
        </Button>
      </Link>
    </>
  );
};

export default NotificationIcons;