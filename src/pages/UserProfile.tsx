import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    company_name: user?.company_name || "",
    website: user?.website || "",
  });

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: profile
      });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="w-24 h-24" />
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name || "Utilisateur"}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="company_name">Société</Label>
            <Input
              id="company_name"
              value={profile.company_name}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateProfile}>
                  Enregistrer
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Modifier
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;