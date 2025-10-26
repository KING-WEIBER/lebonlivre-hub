import { CheckCircle, Circle, Clock } from "lucide-react";

interface OrderTrackingStepsProps {
  currentStatus: string;
}

const TRACKING_STEPS = [
  { id: "en_attente", label: "Commande validée" },
  { id: "confirmée", label: "Confirmée" },
  { id: "en_preparation", label: "En préparation" },
  { id: "expédiée", label: "Expédiée" },
  { id: "livrée", label: "Livrée / Prête à récupérer" },
];

export function OrderTrackingSteps({ currentStatus }: OrderTrackingStepsProps) {
  const getCurrentStepIndex = () => {
    const index = TRACKING_STEPS.findIndex(step => step.id === currentStatus);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-4">
      {TRACKING_STEPS.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isPending = index > currentStepIndex;

        return (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              {isCompleted && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              {isCurrent && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                </div>
              )}
              {isPending && (
                <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center">
                  <Circle className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              {index < TRACKING_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <p
                className={`font-medium ${
                  isCurrent
                    ? "text-accent"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-muted-foreground mt-1">
                  Étape en cours
                </p>
              )}
              {isCompleted && (
                <p className="text-sm text-muted-foreground mt-1">Terminé</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
