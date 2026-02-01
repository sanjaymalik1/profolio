"use client";

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Lightbulb, 
  GripVertical, 
  Settings, 
  Eye, 
  Save,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const OnboardingGuide: React.FC = () => {
  const { state } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if user has seen onboarding before
  useEffect(() => {
    const seen = localStorage.getItem('profolio_onboarding_seen');
    if (!seen && state?.sections?.length === 0) {
      // Show onboarding only for new users with no sections
      setIsOpen(true);
    }
    setHasSeenOnboarding(!!seen);
  }, [state?.sections?.length]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Profolio Editor!',
      description: 'Let\'s get you started building your portfolio',
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Profolio is a powerful drag-and-drop portfolio builder that lets you create 
            professional portfolios without any coding knowledge.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What you can do:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Drag sections to build your portfolio</li>
              <li>• Customize content in real-time</li>
              <li>• Preview on different devices</li>
              <li>• Save and export your work</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'drag-drop',
      title: 'Drag & Drop Sections',
      description: 'Build your portfolio by dragging sections from the palette',
      icon: <GripVertical className="w-6 h-6 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            On the left sidebar, you'll find different portfolio sections like Hero, About, 
            Skills, Projects, and Contact.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">How to add sections:</h4>
            <ol className="space-y-1 text-sm text-green-800">
              <li>1. Find the section you want in the left palette</li>
              <li>2. Drag it to the canvas in the center</li>
              <li>3. Drop it where you want it to appear</li>
              <li>4. Repeat to add more sections</li>
            </ol>
          </div>
          <Badge variant="outline" className="text-xs">
            💡 Tip: Start with a Hero section for your introduction!
          </Badge>
        </div>
      )
    },
    {
      id: 'customize',
      title: 'Customize Your Content',
      description: 'Edit section properties to personalize your portfolio',
      icon: <Settings className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Click on any section in the canvas to select it. The properties panel 
            on the right will show customization options for that section.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">What you can customize:</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Text content (name, bio, descriptions)</li>
              <li>• Images and media</li>
              <li>• Contact information</li>
              <li>• Skills and projects</li>
              <li>• Social media links</li>
            </ul>
          </div>
          <Badge variant="outline" className="text-xs">
            💡 Changes appear instantly in the preview!
          </Badge>
        </div>
      )
    },
    {
      id: 'preview',
      title: 'Preview Your Portfolio',
      description: 'See how your portfolio looks on different devices',
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Switch between Canvas and Preview tabs to see your portfolio in action. 
            Test how it looks on desktop, tablet, and mobile devices.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Preview features:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Real-time updates as you edit</li>
              <li>• Responsive design testing</li>
              <li>• Full-screen preview mode</li>
              <li>• Mobile-first optimization</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'save',
      title: 'Save & Export',
      description: 'Keep your work safe and share it with the world',
      icon: <Save className="w-6 h-6 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Your work is automatically saved every 5 seconds. You can also manually 
            save, load previous versions, and export your portfolio.
          </p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">Save & Export options:</h4>
            <ul className="space-y-1 text-sm text-orange-800">
              <li>• Auto-save every 5 seconds</li>
              <li>• Manual save with custom names</li>
              <li>• Load previous portfolio versions</li>
              <li>• Export as JSON or HTML</li>
              <li>• Import existing portfolios</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('profolio_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
    setIsOpen(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    handleFinish();
  };

  const showOnboarding = () => {
    setIsOpen(true);
    setCurrentStep(0);
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Trigger button for users who have seen onboarding */}
      {hasSeenOnboarding && (
        <Button variant="outline" size="sm" onClick={showOnboarding}>
          <Lightbulb className="w-4 h-4 mr-2" />
          Guide
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentStepData.icon}
                <div>
                  <DialogTitle>{currentStepData.title}</DialogTitle>
                  <DialogDescription>{currentStepData.description}</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
          </DialogHeader>

          <div className="py-6">
            {currentStepData.content}
          </div>

          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-gray-500"
            >
              Skip Tutorial
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              {isLastStep ? (
                <Button onClick={handleFinish}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};