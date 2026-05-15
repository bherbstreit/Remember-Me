'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight,
  Upload,
  Check,
  Copy,
  Link2,
  Plus,
  X,
  Globe,
  Users,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fontOptions, motifOptions, type FontOption, type Motif } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3 | 4

interface FormData {
  // Step 1
  fullName: string
  dateOfBirth: string
  dateOfPassing: string
  profilePhoto: string | null
  coverPhoto: string | null
  relationship: string
  
  // Step 2
  favoriteColor: string
  nameFont: FontOption
  motifs: Motif[]
  
  // Step 3
  privacy: 'public' | 'family-only' | 'private'
  contributionsOpen: boolean
  
  // Step 4
  inviteEmails: string[]
}

const initialFormData: FormData = {
  fullName: '',
  dateOfBirth: '',
  dateOfPassing: '',
  profilePhoto: null,
  coverPhoto: null,
  relationship: '',
  favoriteColor: '#9B8EC4',
  nameFont: 'cormorant',
  motifs: [],
  privacy: 'public',
  contributionsOpen: true,
  inviteEmails: [],
}

const colorPresets = [
  '#9B8EC4', // Lavender
  '#E8A0B4', // Pink/Rose
  '#C4789B', // Dusty Rose
  '#D4A017', // Gold/Amber
  '#7BA38F', // Sage Green
  '#8B9DC3', // Periwinkle
  '#C9A66B', // Warm Gold
  '#A67B5B', // Warm Brown
]

const relationships = [
  'Parent', 'Child', 'Spouse', 'Sibling', 'Grandparent', 
  'Grandchild', 'Friend', 'Partner', 'Other'
]

export default function CreateProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [newEmail, setNewEmail] = useState('')
  const [copied, setCopied] = useState(false)

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as Step)
    } else {
      // Submit and redirect
      router.push('/')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
    }
  }

  const addEmail = () => {
    if (newEmail && !formData.inviteEmails.includes(newEmail)) {
      updateFormData('inviteEmails', [...formData.inviteEmails, newEmail])
      setNewEmail('')
    }
  }

  const removeEmail = (email: string) => {
    updateFormData('inviteEmails', formData.inviteEmails.filter(e => e !== email))
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://rememberme.app/invite/${Date.now()}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleMotif = (motif: Motif) => {
    if (formData.motifs.includes(motif)) {
      updateFormData('motifs', formData.motifs.filter(m => m !== motif))
    } else if (formData.motifs.length < 3) {
      updateFormData('motifs', [...formData.motifs, motif])
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.dateOfBirth && formData.dateOfPassing && formData.relationship
      case 2:
        return formData.favoriteColor && formData.nameFont
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-6 max-w-xl">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          {step === 1 ? (
            <Link
              href="/"
              className="p-2 rounded-full bg-card hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="p-2 rounded-full bg-card hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-serif font-semibold text-foreground">
              Create Memorial
            </h1>
            <p className="text-sm text-muted-foreground">
              Step {step} of 4
            </p>
          </div>
        </header>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                s <= step ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {step === 1 && (
            <Step1BasicInfo 
              formData={formData} 
              updateFormData={updateFormData}
              relationships={relationships}
            />
          )}
          
          {step === 2 && (
            <Step2Personalization 
              formData={formData} 
              updateFormData={updateFormData}
              colorPresets={colorPresets}
              toggleMotif={toggleMotif}
            />
          )}
          
          {step === 3 && (
            <Step3Privacy 
              formData={formData} 
              updateFormData={updateFormData}
            />
          )}
          
          {step === 4 && (
            <Step4Invite 
              formData={formData}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              addEmail={addEmail}
              removeEmail={removeEmail}
              copyInviteLink={copyInviteLink}
              copied={copied}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full h-12 rounded-xl text-base"
          >
            {step === 4 ? 'Create Memorial' : 'Continue'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Step 1: Basic Info
function Step1BasicInfo({ 
  formData, 
  updateFormData,
  relationships
}: { 
  formData: FormData
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  relationships: string[]
}) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
          Basic Information
        </h2>
        <p className="text-muted-foreground">
          Tell us about your loved one
        </p>
      </div>

      {/* Photo uploads */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Profile Photo
          </label>
          <button className="w-full aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground bg-card">
            <Upload className="w-6 h-6" />
            <span className="text-xs">Upload</span>
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cover Photo
          </label>
          <button className="w-full aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground bg-card">
            <Upload className="w-6 h-6" />
            <span className="text-xs">Upload</span>
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => updateFormData('fullName', e.target.value)}
          placeholder="Enter their full name"
          className="w-full p-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date of Passing
          </label>
          <input
            type="date"
            value={formData.dateOfPassing}
            onChange={(e) => updateFormData('dateOfPassing', e.target.value)}
            className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Relationship */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Relationship
        </label>
        <select
          value={formData.relationship}
          onChange={(e) => updateFormData('relationship', e.target.value)}
          className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Select relationship</option>
          {relationships.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </>
  )
}

// Step 2: Personalization
function Step2Personalization({ 
  formData, 
  updateFormData,
  colorPresets,
  toggleMotif
}: { 
  formData: FormData
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  colorPresets: string[]
  toggleMotif: (motif: Motif) => void
}) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
          Personalization
        </h2>
        <p className="text-muted-foreground">
          Make their memorial unique
        </p>
      </div>

      {/* Color picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Favorite Color
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          This color will be used throughout their memorial
        </p>
        <div className="flex flex-wrap gap-3">
          {colorPresets.map(color => (
            <button
              key={color}
              onClick={() => updateFormData('favoriteColor', color)}
              className={cn(
                'w-10 h-10 rounded-full transition-all',
                formData.favoriteColor === color 
                  ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' 
                  : 'hover:scale-105'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={formData.favoriteColor}
            onChange={(e) => updateFormData('favoriteColor', e.target.value)}
            className="w-10 h-10 rounded-full cursor-pointer bg-transparent"
          />
        </div>
      </div>

      {/* Font selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Name Font
        </label>
        <div className="grid grid-cols-2 gap-3">
          {fontOptions.map(font => (
            <button
              key={font.value}
              onClick={() => updateFormData('nameFont', font.value)}
              className={cn(
                'p-4 rounded-xl border transition-all text-left',
                formData.nameFont === font.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <span className={cn(
                'text-lg',
                font.value === 'cormorant' && 'font-cormorant',
                font.value === 'playfair' && 'font-playfair',
                font.value === 'dancing' && 'font-dancing',
                font.value === 'eb-garamond' && 'font-eb-garamond',
              )}>
                {formData.fullName || 'Sample Name'}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {font.label} • {font.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Motif selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Image Motifs <span className="text-muted-foreground">(select up to 3)</span>
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          These will appear as decorative elements throughout the memorial
        </p>
        <div className="grid grid-cols-4 gap-2">
          {motifOptions.map(motif => (
            <button
              key={motif.value}
              onClick={() => toggleMotif(motif.value)}
              disabled={formData.motifs.length >= 3 && !formData.motifs.includes(motif.value)}
              className={cn(
                'p-3 rounded-xl border transition-all flex flex-col items-center gap-1',
                formData.motifs.includes(motif.value)
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50',
                formData.motifs.length >= 3 && !formData.motifs.includes(motif.value) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="text-xl">{motif.icon}</span>
              <span className="text-xs text-muted-foreground">{motif.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// Step 3: Privacy & Access
function Step3Privacy({ 
  formData, 
  updateFormData
}: { 
  formData: FormData
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void
}) {
  const privacyOptions = [
    { 
      value: 'public' as const, 
      label: 'Public', 
      description: 'Anyone can find and view this memorial',
      icon: Globe
    },
    { 
      value: 'family-only' as const, 
      label: 'Family Only', 
      description: 'Only family members can view',
      icon: Users
    },
    { 
      value: 'private' as const, 
      label: 'Private', 
      description: 'Invite only - completely private',
      icon: Lock
    },
  ]

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
          Privacy & Access
        </h2>
        <p className="text-muted-foreground">
          Control who can see and contribute
        </p>
      </div>

      {/* Privacy options */}
      <div className="space-y-3 mb-6">
        {privacyOptions.map(option => {
          const Icon = option.icon
          return (
            <button
              key={option.value}
              onClick={() => updateFormData('privacy', option.value)}
              className={cn(
                'w-full p-4 rounded-xl border transition-all flex items-start gap-4 text-left',
                formData.privacy === option.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                formData.privacy === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{option.label}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              {formData.privacy === option.value && (
                <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* Contributions toggle */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Open Contributions</h3>
            <p className="text-sm text-muted-foreground">
              {formData.contributionsOpen 
                ? 'Anyone with access can share memories'
                : 'Only you can approve memories before they appear'
              }
            </p>
          </div>
          <button
            onClick={() => updateFormData('contributionsOpen', !formData.contributionsOpen)}
            className={cn(
              'w-12 h-7 rounded-full transition-colors relative',
              formData.contributionsOpen ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span 
              className={cn(
                'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                formData.contributionsOpen ? 'left-6' : 'left-1'
              )}
            />
          </button>
        </div>
      </div>
    </>
  )
}

// Step 4: Invite Contributors
function Step4Invite({ 
  formData,
  newEmail,
  setNewEmail,
  addEmail,
  removeEmail,
  copyInviteLink,
  copied
}: { 
  formData: FormData
  newEmail: string
  setNewEmail: (email: string) => void
  addEmail: () => void
  removeEmail: (email: string) => void
  copyInviteLink: () => void
  copied: boolean
}) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
          Invite Contributors
        </h2>
        <p className="text-muted-foreground">
          Invite family and friends to share memories
        </p>
      </div>

      {/* Email invites */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Add by Email
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEmail()}
            placeholder="Enter email address"
            className="flex-1 p-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={addEmail} className="rounded-xl">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {formData.inviteEmails.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.inviteEmails.map(email => (
              <span 
                key={email}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
              >
                {email}
                <button onClick={() => removeEmail(email)} className="hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Shareable link */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Or share a link
        </label>
        <button
          onClick={copyInviteLink}
          className="w-full p-4 rounded-xl bg-card border border-border flex items-center justify-between hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Link2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">
              rememberme.app/invite/...
            </span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Preview invite message */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Preview of invite message:</p>
        <p className="text-foreground text-sm">
          &quot;You&apos;ve been invited to contribute to{' '}
          <span className="font-medium">{formData.fullName || 'their loved one'}</span>&apos;s memorial on Remember Me. 
          Share your memories and help preserve their legacy.&quot;
        </p>
      </div>
    </>
  )
}
