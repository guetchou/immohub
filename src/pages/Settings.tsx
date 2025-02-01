import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun, Globe, Lock } from "lucide-react";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Apparence
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Mode sombre</Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifs">Notifications par email</Label>
              <Switch id="email-notifs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifs">Notifications push</Label>
              <Switch id="push-notifs" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Langue et région
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Langue</Label>
              <Button variant="outline">Français</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sécurité
          </h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              Changer le mot de passe
            </Button>
            <Button variant="outline" className="w-full">
              Activer l'authentification à deux facteurs
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;