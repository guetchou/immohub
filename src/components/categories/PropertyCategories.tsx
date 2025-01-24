import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
}

const PropertyCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log("Fetching property categories...");
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('property_categories')
        .select('id, name, description, parent_id');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      if (data) {
        // Create a new array with only serializable properties and explicit type conversion
        const serializedCategories = data.map(category => ({
          id: String(category.id || ''),
          name: String(category.name || ''),
          description: category.description,
          parent_id: category.parent_id ? String(category.parent_id) : null
        }));
        
        // Use JSON.stringify to ensure the data is fully serializable
        const serializedData = JSON.stringify(serializedCategories);
        console.log("Fetched categories:", serializedData);
        
        // Parse the stringified data back to ensure we're working with clean objects
        setCategories(JSON.parse(serializedData));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMainCategories = () => {
    return categories.filter(cat => !cat.parent_id);
  };

  const getSubCategories = (parentId: string) => {
    return categories.filter(cat => cat.parent_id === parentId);
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-real-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-real-primary mb-6 text-center">
        Catégories de Biens
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getMainCategories().map((mainCat) => (
          <div key={mainCat.id} className="space-y-4">
            <Button
              variant={selectedCategory === mainCat.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(
                selectedCategory === mainCat.id ? null : mainCat.id
              )}
            >
              <Folder className="mr-2 h-4 w-4" />
              {mainCat.name}
            </Button>
            {selectedCategory === mainCat.id && (
              <div className="pl-4 space-y-2">
                {getSubCategories(mainCat.id).map((subCat) => (
                  <Button
                    key={subCat.id}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedCategory(subCat.id)}
                  >
                    {subCat.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCategories;