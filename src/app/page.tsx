"use client";

import React, { useState } from "react";
import { FormData, INITIAL_FORM_DATA } from "@/lib/types";
import BriefAnalyzer from "@/components/BriefAnalyzer";
import StepWizard from "@/components/StepWizard";

export default function Home() {
  const [prefilledData, setPrefilledData] = useState<Partial<FormData>>(INITIAL_FORM_DATA);
  const [applyCount, setApplyCount] = useState(0);

  const handleApply = (data: Partial<FormData>) => {
    setPrefilledData(data);
    // Increment so StepWizard's useEffect fires even with same data shape
    setApplyCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* BriefAnalyzer sits just below the sticky header (which is inside StepWizard) */}
      {/* We render a thin wrapper so the Header stays inside StepWizard's scroll context */}
      <div className="flex-1 flex flex-col">
        <StepWizard
          key={applyCount}
          initialData={applyCount > 0 ? prefilledData : undefined}
          analyzerSlot={<BriefAnalyzer onApply={handleApply} />}
        />
      </div>
    </div>
  );
}
