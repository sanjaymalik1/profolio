"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DragComponent = ({ children, isDragging }: { children: React.ReactNode; isDragging: boolean }) => (
  <motion.div
    animate={{ 
      scale: isDragging ? 0.95 : 1,
      opacity: isDragging ? 0.5 : 1
    }}
    className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 font-medium cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
  >
    {children}
  </motion.div>
);

const CanvasComponent = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="bg-white border border-slate-200 rounded-lg p-3 mb-2 shadow-sm"
  >
    {children}
  </motion.div>
);

export default function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [canvasItems, setCanvasItems] = useState<string[]>([]);
  
  const steps = [
    { title: "Drag & Drop", description: "Add sections to your portfolio" },
    { title: "Customize", description: "Edit content and styling" },
    { title: "Publish", description: "Deploy instantly to the web" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const nextStep = (prev + 1) % 3;
        
        if (nextStep === 0) {
          setCanvasItems([]);
        }
        else if (nextStep === 1 && canvasItems.length === 0) {
          setTimeout(() => setCanvasItems(["Hero", "About", "Projects"]), 600);
        }
        
        return nextStep;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [canvasItems.length]);

  return (
    <div className="relative">
      {/* Product Window */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Browser Chrome */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs font-medium text-slate-600">ProFolio Editor</div>
          <div className="w-16"></div>
        </div>

        {/* Editor Interface */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-4 gap-4 h-72">
            {/* Sidebar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sections</div>
              <div className="space-y-2">
                <DragComponent isDragging={step === 0}>Hero</DragComponent>
                <DragComponent isDragging={step === 0}>About</DragComponent>
                <DragComponent isDragging={step === 0}>Projects</DragComponent>
                <DragComponent isDragging={false}>Skills</DragComponent>
                <DragComponent isDragging={false}>Contact</DragComponent>
              </div>
            </div>

            {/* Canvas */}
            <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Canvas</div>
              <div className="space-y-2">
                <AnimatePresence>
                  {canvasItems.map((item, index) => (
                    <CanvasComponent key={item}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 font-medium">{item}</span>
                        {step === 1 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                          />
                        )}
                      </div>
                      {step === 1 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-2 pt-2 border-t border-slate-200"
                        >
                          <div className="flex gap-2">
                            <div className="h-1.5 bg-slate-200 rounded flex-1"></div>
                            <div className="h-1.5 bg-slate-200 rounded flex-1"></div>
                          </div>
                        </motion.div>
                      )}
                    </CanvasComponent>
                  ))}
                </AnimatePresence>
                
                {canvasItems.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Drop sections here to start building
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs ${
                  i === step ? 'text-blue-600 font-medium' : 'text-slate-400'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  i === step ? 'bg-blue-600' : 'bg-slate-300'
                }`}></div>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
          {step === 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-medium text-green-600 flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
              Published
            </motion.div>
          )}
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl blur-3xl -z-10"></div>
    </div>
  );
}