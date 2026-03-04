import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1>
        Daily<span className="text-primary">OS</span>
      </h1>
      <p className="text-lg italic">
        &quot;Your daily operating system. Build better days.&quot;
      </p>
      <div className="flex gap-6">
        <Button className="text-base">
          Create an account <ArrowRight />
        </Button>
        <Button variant="outline" className="text-base">Continue as guest</Button>
      </div>
    </div>
  );
}
