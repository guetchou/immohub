import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export const RoleManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setCurrentRole(data?.user_type || "");
    } catch (error) {
      console.error("Error fetching role:", error);
      toast({
        title: "Error",
        description: "Could not fetch user role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ user_type: newRole })
        .eq("id", user?.id);

      if (error) throw error;

      setCurrentRole(newRole);
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Could not update role",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">User Role Management</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Current Role</label>
          <Select value={currentRole} onValueChange={updateRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TENANT">Tenant</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="AGENT">Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};