import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package, Truck, Home } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "en_attente":
        return {
          label: "En attente",
          icon: Clock,
          variant: "secondary" as const,
        };
      case "confirmée":
        return {
          label: "Confirmée",
          icon: CheckCircle,
          variant: "default" as const,
        };
      case "en_preparation":
        return {
          label: "En préparation",
          icon: Package,
          variant: "default" as const,
        };
      case "expédiée":
        return {
          label: "Expédiée",
          icon: Truck,
          variant: "default" as const,
        };
      case "livrée":
        return {
          label: "Livrée",
          icon: Home,
          variant: "default" as const,
        };
      case "annulée":
        return {
          label: "Annulée",
          icon: CheckCircle,
          variant: "destructive" as const,
        };
      default:
        return {
          label: status,
          icon: Clock,
          variant: "secondary" as const,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
