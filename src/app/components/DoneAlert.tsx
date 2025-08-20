"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DoneAlert() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (sp.get("done") === "1") {
      alert("Rutina finalizada con éxito");
      // Replace the URL to remove ?done=1 without reloading
      router.replace("/", { scroll: false });
    }
  }, [sp, router]);

  return null;
}
