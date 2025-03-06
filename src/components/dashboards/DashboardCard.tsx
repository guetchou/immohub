
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

export interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  description?: string;
  action?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  linkTo?: string;
}

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  action, 
  trend,
  linkTo
}: DashboardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const card = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`hover:shadow-md transition-all ${isHovered ? 'border-primary' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
          
          {description && <p className="text-muted-foreground text-sm mt-2">{description}</p>}
          {action && <div className="mt-4">{action}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block">{card}</Link>;
  }

  return card;
};

export default DashboardCard;
