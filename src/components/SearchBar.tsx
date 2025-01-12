import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Rechercher une propriété..."
        className="pl-4 pr-12 py-2 w-full rounded-lg"
      />
      <Button
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SearchBar;