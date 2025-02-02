import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: `Mode ${theme === "dark" ? "clair" : "sombre"} activé`,
      duration: 2000,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-gray-700 dark:text-gray-300"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;