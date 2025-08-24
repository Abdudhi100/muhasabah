"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  loading?: boolean;
  label?: string; // default: "Submit"
  loadingLabel?: string; // default: "Submitting..."
}

export default function SubmitButton({
  loading = false,
  label = "Submit",
  loadingLabel = "Submitting...",
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={loading} className="w-full">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingLabel : label}
    </Button>
  );
}
