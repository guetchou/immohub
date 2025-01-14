import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 bg-real-primary text-white">
              <h3 className="font-semibold">Chat avec ImmoHub</h3>
            </div>
            <div className="h-96 p-4 overflow-y-auto">
              {/* Chat messages will go here */}
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">
                      Bonjour ! Comment puis-je vous aider aujourd'hui ?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-real-primary"
                />
                <Button size="sm">
                  Envoyer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "h-12 w-12 rounded-full shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-real-primary hover:bg-real-primary/90"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingChatButton;