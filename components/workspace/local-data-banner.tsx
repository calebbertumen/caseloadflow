import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LOCAL_DATA_LIMITATION,
  LOCAL_DATA_NOTICE,
  LOCAL_SAVE_BENEFIT,
} from "@/lib/constants";

type Props = {
  /** Shorter variant for tight layouts */
  compact?: boolean;
};

export function LocalDataBanner({ compact }: Props) {
  if (compact) {
    return (
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="text-primary" aria-hidden />
        <AlertDescription className="text-muted-foreground sm:text-sm">
          <span className="font-medium text-foreground">{LOCAL_SAVE_BENEFIT}</span>{" "}
          {LOCAL_DATA_NOTICE}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-primary/20 bg-primary/5">
      <Info className="text-primary" aria-hidden />
      <div className="space-y-2">
        <AlertTitle className="text-foreground">Saved in this browser</AlertTitle>
        <AlertDescription className="text-muted-foreground sm:text-sm">
          <p>{LOCAL_SAVE_BENEFIT}</p>
          <p className="mt-2">{LOCAL_DATA_NOTICE}</p>
          <p className="mt-2">{LOCAL_DATA_LIMITATION}</p>
        </AlertDescription>
      </div>
    </Alert>
  );
}
