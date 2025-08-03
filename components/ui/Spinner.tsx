import { Loader } from "lucide-react";

export function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <Loader
        className="h-10 w-10 animate-spin text-muted-foreground"
        style={{ animationDuration: "2s" }}
      />
    </div>
  );
}
