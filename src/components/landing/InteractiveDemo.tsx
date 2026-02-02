"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DragComponent = ({ children, isDragging }: { children: React.ReactNode; isDragging: boolean }) => (
  <motion.div
    animate={{ 
      scale: isDragging ? 0.8 : 1,
      opacity: isDragging ? 0.6 : 1
    }}
    className="bg-blue-100 border border-blue-300 rounded p-1 sm:p-2 text-[10px] sm:text-xs text-blue-700 cursor-pointer"
  >
    {children}
  </motion.div>
);

const CanvasComponent = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-white border rounded p-2 sm:p-3 mb-1 sm:mb-2 shadow-sm"
  >
    {children}
  </motion.div>
);

export default function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [canvasItems, setCanvasItems] = useState<string[]>([]);
  
  const steps = [
    { title: "Drag & Drop", description: "Add components to your portfolio" },
    { title: "Customize", description: "Edit content and styling" },
    { title: "Publish", description: "Deploy instantly to the web" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const nextStep = (prev + 1) % 3;
        
        // Reset demo state when starting over
        if (nextStep === 0) {
          setCanvasItems([]);
        }
        // Add components during drag step
        else if (nextStep === 1 && canvasItems.length === 0) {
          setTimeout(() => setCanvasItems(["About", "Projects"]), 800);
        }
        
        return nextStep;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [canvasItems.length]);

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-semibold">Profolio Editor</div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 h-36 sm:h-48">
        {/* Sidebar */}
        <div className="bg-white/10 rounded-md sm:rounded-lg p-2 sm:p-3">
          <div className="text-xs font-medium mb-1 sm:mb-2 opacity-80 hidden sm:block">Components</div>
          <div className="space-y-1 sm:space-y-2">
            <DragComponent isDragging={step === 0}>About Me</DragComponent>
            <DragComponent isDragging={step === 0}>Projects</DragComponent>
            <DragComponent isDragging={false}>Skills</DragComponent>
            <DragComponent isDragging={false}>Contact</DragComponent>
          </div>
        </div>

        {/* Canvas */}
        <div className="col-span-2 bg-white/5 rounded-md sm:rounded-lg p-2 sm:p-3 border border-dashed sm:border-2 border-white/20">
          <div className="text-xs font-medium mb-1 sm:mb-2 opacity-80 hidden sm:block">Canvas</div>
          <div className="space-y-1 sm:space-y-2">
            <AnimatePresence>
              {canvasItems.map((item, index) => (
                <CanvasComponent key={item}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-gray-700 font-medium">{item}</span>
                    {step === 1 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"
                      />
                    )}
                  </div>
                  {step === 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-1 sm:mt-2 space-y-1"
                    >
                      <div className="h-0.5 sm:h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-0.5 sm:h-1 bg-gray-200 rounded w-3/4"></div>
                    </motion.div>
                  )}
                </CanvasComponent>
              ))}
            </AnimatePresence>
            
            {canvasItems.length === 0 && (
              <div className="text-[10px] sm:text-xs text-white/50 text-center py-6 sm:py-8">
                Drag components here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-3 sm:mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${step === 0 ? 'bg-blue-400' : 'bg-white/30'}`}></div>
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${step === 1 ? 'bg-blue-400' : 'bg-white/30'}`}></div>
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${step === 2 ? 'bg-blue-400' : 'bg-white/30'}`}></div>
        </div>
        
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-right"
        >
          <div className="text-xs sm:text-sm font-medium">{steps[step].title}</div>
          <div className="text-[10px] sm:text-xs opacity-80 hidden sm:block">{steps[step].description}</div>
        </motion.div>
        
        {step === 2 && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-green-500 hover:bg-green-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium transition-colors"
          >
            🚀 Live
          </motion.button>
        )}
      </div>
    </div>
  );
}