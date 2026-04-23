"use client";

import React, { useState, useCallback } from "react";
import {
  FormData,
  ConceptResult,
  INITIAL_FORM_DATA,
  STEP_TITLES,
} from "@/lib/types";
import { generateClientConcept } from "@/lib/generateConcept";
import StyleSelector from "./StyleSelector";
import FormStep from "./FormStep";
import OutputScreen from "./OutputScreen";
import PriceEstimator from "./PriceEstimator";

const TOTAL_STEPS = 6;

export default function StepWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [result, setResult] = useState<ConceptResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const isStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return formData.style !== "";
      case 2:
        return (
          formData.width !== "" &&
          formData.depth !== "" &&
          formData.openSides !== ""
        );
      case 3:
        return formData.budget !== "";
      case 4:
        return true; // Elements are optional
      case 5:
        return (
          formData.personality.tone !== "" &&
          formData.personality.aesthetic !== "" &&
          formData.personality.feel !== ""
        );
      case 6:
        return true; // Restrictions are optional
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setDirection("forward");
      setCurrentStep((s) => s + 1);
    } else {
      // Generate result
      setIsGenerating(true);
      // Simulated delay for polish
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const concept = generateClientConcept(formData);
      setResult(concept);
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection("back");
      setCurrentStep((s) => s - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
    setResult(null);
    setDirection("forward");
  };

  // If we have a result, show the output
  if (result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
              <OutputScreen result={result} onReset={handleReset} />
              <div className="lg:sticky lg:top-24">
                <PriceEstimator formData={formData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border-default)]" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-accent)] animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-[var(--color-gradient-end)] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Generating Your Concept
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Analyzing your preferences and crafting a unique design direction...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

            {/* ── Left: Wizard ── */}
            <div className="w-full">
              {/* Progress */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)] font-medium">
                    Step {currentStep} of {TOTAL_STEPS}
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    {STEP_TITLES[currentStep - 1]}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-bg-card)] overflow-hidden">
                  <div
                    className="h-full rounded-full progress-bar-fill transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Step dots */}
                <div className="flex justify-between px-1">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
                    (step) => (
                      <div
                        key={step}
                        className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${
                          step < currentStep
                            ? "bg-[var(--color-accent)]"
                            : step === currentStep
                              ? "bg-[var(--color-accent)] pulse-glow"
                              : "bg-[var(--color-bg-elevated)]"
                        }
                      `}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div
                key={currentStep}
                className={direction === "forward" ? "slide-up" : "fade-in"}
              >
                <div className="glass-card p-6 sm:p-8">
                  {currentStep === 1 ? (
                    <StyleSelector
                      selected={formData.style}
                      onSelect={(style) => updateFormData({ style })}
                    />
                  ) : (
                    <FormStep
                      step={currentStep}
                      formData={formData}
                      onChange={updateFormData}
                    />
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <button
                  id="btn-back"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`btn-secondary ${
                    currentStep === 1
                      ? "opacity-0 pointer-events-none"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M10 3L5 8L10 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back
                  </span>
                </button>

                <button
                  id="btn-next"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="btn-primary"
                >
                  <span className="flex items-center gap-2">
                    {currentStep === TOTAL_STEPS ? (
                      <>
                        Generate Concept
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M2 8H14M8 2L14 8L8 14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Next
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M6 3L11 8L6 13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* ── Right: Price Estimator ── */}
            <div className="lg:sticky lg:top-24">
              <PriceEstimator formData={formData} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] flex items-center justify-center shadow-lg shadow-[var(--color-accent-glow)]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="text-white"
            >
              <path
                d="M9 1L11.5 6.5L17 9L11.5 11.5L9 17L6.5 11.5L1 9L6.5 6.5L9 1Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight">
              Client Mind Translator
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] leading-tight">
              Booth Concept Generator
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
          Ready
        </div>
      </div>
    </header>
  );
}
