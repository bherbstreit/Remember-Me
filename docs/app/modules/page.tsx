'use client'

import { useState } from 'react'
import { Heart, ChevronRight, Check, X } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { griefModules } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ModulesPage() {
  const [currentStage, setCurrentStage] = useState(1)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [dismissedStages, setDismissedStages] = useState<number[]>([])

  const progress = (completedStages.length / griefModules.length) * 100

  const handleOk = (stage: number) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages(prev => [...prev, stage])
    }
    if (stage < griefModules.length) {
      setCurrentStage(stage + 1)
    }
  }

  const handleDismiss = (stage: number) => {
    if (!dismissedStages.includes(stage)) {
      setDismissedStages(prev => [...prev, stage])
    }
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
              <Heart className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
              Navigating Stages of Grief
            </h1>
            <p className="text-muted-foreground">
              Take your time. There&apos;s no right way to grieve.
            </p>
          </header>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Your Progress</span>
              <span>{completedStages.length} of {griefModules.length} completed</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Module Cards */}
          <div className="space-y-4">
            {griefModules.map((module) => {
              const isCompleted = completedStages.includes(module.stage)
              const isDismissed = dismissedStages.includes(module.stage)
              const isCurrent = module.stage === currentStage
              const isLocked = module.stage > currentStage && !completedStages.includes(module.stage - 1)

              if (isDismissed) return null

              return (
                <div
                  key={module.id}
                  className={cn(
                    'p-5 rounded-2xl border transition-all',
                    isCompleted 
                      ? 'bg-primary/5 border-primary/20'
                      : isCurrent
                        ? 'bg-card border-border shadow-lg'
                        : isLocked
                          ? 'bg-muted/50 border-border/50 opacity-50'
                          : 'bg-card border-border'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Stage indicator */}
                    <div 
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium',
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : isCurrent
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        module.stage
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {module.description}
                      </p>

                      {isCurrent && !isCompleted && (
                        <>
                          <p className="text-foreground leading-relaxed mb-4">
                            {module.content}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleOk(module.stage)}
                              className="rounded-xl"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Got it
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDismiss(module.stage)}
                              className="rounded-xl"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Dismiss
                            </Button>
                          </div>
                        </>
                      )}

                      {isCompleted && (
                        <button 
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                          onClick={() => setCurrentStage(module.stage)}
                        >
                          Review
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Support message */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border text-center">
            <p className="text-muted-foreground mb-2">
              Need someone to talk to?
            </p>
            <p className="text-foreground font-medium">
              National Suicide Prevention Lifeline: 988
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Available 24/7 for emotional support
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
