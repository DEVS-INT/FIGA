"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Award, Calendar, Car, GraduationCap, MapPin, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  // Personal Information
  name: string
  sex: string
  phone: string
  telegram: string
  ageGroup: string
  
  // Certification & Experience
  certifications: string[]
  otherCertification: string
  experience: string
  otherExperience: string
  stateExperience: string
  
  // Availability
  availableDays: string[]
  otherDays: string
  availableShifts: string[]
  otherShifts: string
  
  // Driving & Care Abilities
  drivingAbility: string
  personalCareComfort: string
  
  // Education & Language
  collegeInfo: string
  englishSkills: string
  
  // Legal Status & Work Preferences
  yearsInUS: string
  workAuthorized: string
  currentlyEmployed: string
  reasonForLeaving: string[]
  otherReason: string
  preferredWorkType: string
}

const initialFormData: FormData = {
  name: '',
  sex: '',
  phone: '',
  telegram: '',
  ageGroup: '',
  certifications: [],
  otherCertification: '',
  experience: '',
  otherExperience: '',
  stateExperience: '',
  availableDays: [],
  otherDays: '',
  availableShifts: [],
  otherShifts: '',
  drivingAbility: '',
  personalCareComfort: '',
  collegeInfo: '',
  englishSkills: '',
  yearsInUS: '',
  workAuthorized: '',
  currentlyEmployed: '',
  reasonForLeaving: [],
  otherReason: '',
  preferredWorkType: ''
}

const sections = [
  { id: 'personal', title: 'Personal Information', icon: User },
  { id: 'certification', title: 'Certification & Experience', icon: Award },
  { id: 'availability', title: 'Availability', icon: Calendar },
  { id: 'driving', title: 'Driving & Care Abilities', icon: Car },
  { id: 'education', title: 'Education & Language', icon: GraduationCap },
  { id: 'legal', title: 'Legal Status & Work Preferences', icon: MapPin }
]

const englishLevels = [
  { value: '1', label: '1 - Very Limited (Basic words only)' },
  { value: '2', label: '2 - Limited (Simple phrases)' },
  { value: '3', label: '3 - Basic (Simple conversations)' },
  { value: '4', label: '4 - Elementary (Basic daily communication)' },
  { value: '5', label: '5 - Intermediate (Can handle most situations)' },
  { value: '6', label: '6 - Upper Intermediate (Comfortable in most contexts)' },
  { value: '7', label: '7 - Advanced (Fluent with minor errors)' },
  { value: '8', label: '8 - Proficient (Very fluent, rare errors)' },
  { value: '9', label: '9 - Expert (Near-native fluency)' },
  { value: '10', label: '10 - Native/Fluent (Perfect fluency)' }
]

export default function CaregiverIntakePage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentSection, setCurrentSection] = useState('personal')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleArrayUpdate = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[]
    if (checked) {
      updateFormData(field, [...currentArray, value])
    } else {
      updateFormData(field, currentArray.filter(item => item !== value))
    }
  }

  const validateSection = (sectionId: string): boolean => {
    const newErrors: Record<string, string> = {}

    switch (sectionId) {
      case 'personal':
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.sex) newErrors.sex = 'Sex is required'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.ageGroup) newErrors.ageGroup = 'Age group is required'
        break
      case 'certification':
        if (formData.certifications.length === 0) newErrors.certifications = 'At least one certification is required'
        if (!formData.experience) newErrors.experience = 'Experience level is required'
        if (!formData.stateExperience.trim()) newErrors.stateExperience = 'State experience is required'
        break
      case 'availability':
        if (formData.availableDays.length === 0) newErrors.availableDays = 'At least one available day is required'
        if (formData.availableShifts.length === 0) newErrors.availableShifts = 'At least one available shift is required'
        break
      case 'driving':
        if (!formData.drivingAbility.trim()) newErrors.drivingAbility = 'Driving ability information is required'
        if (!formData.personalCareComfort) newErrors.personalCareComfort = 'Personal care comfort level is required'
        break
      case 'education':
        if (!formData.englishSkills) newErrors.englishSkills = 'English communication skills level is required'
        break
      case 'legal':
        if (!formData.yearsInUS.trim()) newErrors.yearsInUS = 'Years in the US is required'
        if (!formData.workAuthorized) newErrors.workAuthorized = 'Work authorization status is required'
        if (!formData.currentlyEmployed) newErrors.currentlyEmployed = 'Current employment status is required'
        if (!formData.preferredWorkType) newErrors.preferredWorkType = 'Preferred work type is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getCompletedSections = () => {
    const completed = []
    if (formData.name && formData.sex && formData.phone && formData.ageGroup) completed.push('personal')
    if (formData.certifications.length > 0 && formData.experience && formData.stateExperience) completed.push('certification')
    if (formData.availableDays.length > 0 && formData.availableShifts.length > 0) completed.push('availability')
    if (formData.drivingAbility && formData.personalCareComfort) completed.push('driving')
    if (formData.englishSkills) completed.push('education')
    if (formData.yearsInUS && formData.workAuthorized && formData.currentlyEmployed && formData.preferredWorkType) completed.push('legal')
    return completed
  }

  const completedSections = getCompletedSections()
  const progress = (completedSections.length / sections.length) * 100

  const handleSubmit = async () => {
    // Validate all sections
    let allValid = true
    for (const section of sections) {
      if (!validateSection(section.id)) {
        allValid = false
      }
    }

    if (!allValid) {
      alert('Please complete all required fields before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Application submitted successfully! We will review your application and get back to you soon.')
      // In a real app, you would redirect or show a success page
    } catch (error) {
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPersonalSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 font-medium">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter your full name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Sex <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.sex}
          onValueChange={(value) => updateFormData('sex', value)}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
        {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-slate-700 font-medium">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          placeholder="(555) 123-4567"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telegram" className="text-slate-700 font-medium">
          Telegram Username
        </Label>
        <Input
          id="telegram"
          value={formData.telegram}
          onChange={(e) => updateFormData('telegram', e.target.value)}
          placeholder="@username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ageGroup" className="text-slate-700 font-medium">
          Age Group <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.ageGroup} onValueChange={(value) => updateFormData('ageGroup', value)}>
          <SelectTrigger className={errors.ageGroup ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select your age group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20-25">20-25</SelectItem>
            <SelectItem value="25-30">25-30</SelectItem>
            <SelectItem value="30-35">30-35</SelectItem>
            <SelectItem value="35-40">35-40</SelectItem>
            <SelectItem value="40-45">40-45</SelectItem>
            <SelectItem value="45+">45+</SelectItem>
          </SelectContent>
        </Select>
        {errors.ageGroup && <p className="text-red-500 text-sm">{errors.ageGroup}</p>}
      </div>
    </div>
  )

  const renderCertificationSection = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Certifications or Trainings <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['Tier 1', 'Tier 2', 'OIS', 'First Aid and CPR', 'HBS'].map((cert) => (
            <div key={cert} className="flex items-center space-x-2">
              <Checkbox
                id={cert}
                checked={formData.certifications.includes(cert)}
                onCheckedChange={(checked) => handleArrayUpdate('certifications', cert, checked as boolean)}
              />
              <Label htmlFor={cert}>{cert}</Label>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other-cert"
              checked={formData.certifications.includes('Other')}
              onCheckedChange={(checked) => handleArrayUpdate('certifications', 'Other', checked as boolean)}
            />
            <Label htmlFor="other-cert">Other:</Label>
          </div>
          {formData.certifications.includes('Other') && (
            <Input
              value={formData.otherCertification}
              onChange={(e) => updateFormData('otherCertification', e.target.value)}
              placeholder="Specify other certification"
              className="ml-6"
            />
          )}
        </div>
        {errors.certifications && <p className="text-red-500 text-sm">{errors.certifications}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Group Home / Caregiving Experience <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.experience}
          onValueChange={(value) => updateFormData('experience', value)}
          className="space-y-2"
        >
          {['Less than 1 year', '1 year', '2 years', '3 years', 'More than 3 years', 'No Experience'].map((exp) => (
            <div key={exp} className="flex items-center space-x-2">
              <RadioGroupItem value={exp} id={exp} />
              <Label htmlFor={exp}>{exp}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="other-exp" />
            <Label htmlFor="other-exp">Other:</Label>
          </div>
        </RadioGroup>
        {formData.experience === 'Other' && (
          <Input
            value={formData.otherExperience}
            onChange={(e) => updateFormData('otherExperience', e.target.value)}
            placeholder="Specify other experience"
            className="ml-6"
          />
        )}
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stateExperience" className="text-slate-700 font-medium">
          State Experience <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="stateExperience"
          value={formData.stateExperience}
          onChange={(e) => updateFormData('stateExperience', e.target.value)}
          placeholder="Describe your experience working in this state..."
          rows={4}
          className={errors.stateExperience ? 'border-red-500' : ''}
        />
        {errors.stateExperience && <p className="text-red-500 text-sm">{errors.stateExperience}</p>}
      </div>
    </div>
  )

  const renderAvailabilitySection = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Available Days <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={formData.availableDays.includes(day)}
                onCheckedChange={(checked) => handleArrayUpdate('availableDays', day, checked as boolean)}
              />
              <Label htmlFor={day}>{day}</Label>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other-days"
              checked={formData.availableDays.includes('Other')}
              onCheckedChange={(checked) => handleArrayUpdate('availableDays', 'Other', checked as boolean)}
            />
            <Label htmlFor="other-days">Other:</Label>
          </div>
          {formData.availableDays.includes('Other') && (
            <Input
              value={formData.otherDays}
              onChange={(e) => updateFormData('otherDays', e.target.value)}
              placeholder="Specify other availability"
              className="ml-6"
            />
          )}
        </div>
        {errors.availableDays && <p className="text-red-500 text-sm">{errors.availableDays}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Available Shifts <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          {['Day shift', 'Night shift', 'Weekends'].map((shift) => (
            <div key={shift} className="flex items-center space-x-2">
              <Checkbox
                id={shift}
                checked={formData.availableShifts.includes(shift)}
                onCheckedChange={(checked) => handleArrayUpdate('availableShifts', shift, checked as boolean)}
              />
              <Label htmlFor={shift}>{shift}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other-shifts"
              checked={formData.availableShifts.includes('Other')}
              onCheckedChange={(checked) => handleArrayUpdate('availableShifts', 'Other', checked as boolean)}
            />
            <Label htmlFor="other-shifts">Other:</Label>
          </div>
          {formData.availableShifts.includes('Other') && (
            <Input
              value={formData.otherShifts}
              onChange={(e) => updateFormData('otherShifts', e.target.value)}
              placeholder="Specify other shifts"
              className="ml-6"
            />
          )}
        </div>
        {errors.availableShifts && <p className="text-red-500 text-sm">{errors.availableShifts}</p>}
      </div>
    </div>
  )

  const renderDrivingSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="drivingAbility" className="text-slate-700 font-medium">
          Driving Ability & License Experience <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="drivingAbility"
          value={formData.drivingAbility}
          onChange={(e) => updateFormData('drivingAbility', e.target.value)}
          placeholder="Describe your driving experience, license status, and comfort level with driving..."
          rows={4}
          className={errors.drivingAbility ? 'border-red-500' : ''}
        />
        {errors.drivingAbility && <p className="text-red-500 text-sm">{errors.drivingAbility}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Comfort with Personal Care Tasks <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.personalCareComfort}
          onValueChange={(value) => updateFormData('personalCareComfort', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="comfort-yes" />
            <Label htmlFor="comfort-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="comfort-no" />
            <Label htmlFor="comfort-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="comfort-other" />
            <Label htmlFor="comfort-other">Other</Label>
          </div>
        </RadioGroup>
        {errors.personalCareComfort && <p className="text-red-500 text-sm">{errors.personalCareComfort}</p>}
      </div>
    </div>
  )

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="collegeInfo" className="text-slate-700 font-medium">
          College/University Information (Optional)
        </Label>
        <Textarea
          id="collegeInfo"
          value={formData.collegeInfo}
          onChange={(e) => updateFormData('collegeInfo', e.target.value)}
          placeholder="Describe your educational background, degrees, relevant coursework..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="englishSkills" className="text-slate-700 font-medium">
          English Communication Skills <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.englishSkills} onValueChange={(value) => updateFormData('englishSkills', value)}>
          <SelectTrigger className={errors.englishSkills ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select your English proficiency level" />
          </SelectTrigger>
          <SelectContent>
            {englishLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.englishSkills && <p className="text-red-500 text-sm">{errors.englishSkills}</p>}
      </div>
    </div>
  )

  const renderLegalSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="yearsInUS" className="text-slate-700 font-medium">
          Years in the US <span className="text-red-500">*</span>
        </Label>
        <Input
          id="yearsInUS"
          value={formData.yearsInUS}
          onChange={(e) => updateFormData('yearsInUS', e.target.value)}
          placeholder="e.g., 5 years"
          className={errors.yearsInUS ? 'border-red-500' : ''}
        />
        {errors.yearsInUS && <p className="text-red-500 text-sm">{errors.yearsInUS}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Authorized to Work in the U.S.? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.workAuthorized}
          onValueChange={(value) => updateFormData('workAuthorized', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="auth-yes" />
            <Label htmlFor="auth-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="auth-no" />
            <Label htmlFor="auth-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="auth-other" />
            <Label htmlFor="auth-other">Other</Label>
          </div>
        </RadioGroup>
        {errors.workAuthorized && <p className="text-red-500 text-sm">{errors.workAuthorized}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Currently Employed? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.currentlyEmployed}
          onValueChange={(value) => updateFormData('currentlyEmployed', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="emp-yes" />
            <Label htmlFor="emp-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="emp-no" />
            <Label htmlFor="emp-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="emp-other" />
            <Label htmlFor="emp-other">Other</Label>
          </div>
        </RadioGroup>
        {errors.currentlyEmployed && <p className="text-red-500 text-sm">{errors.currentlyEmployed}</p>}
      </div>

      {formData.currentlyEmployed === 'No' && (
        <div className="space-y-3">
          <Label className="text-slate-700 font-medium">
            Reason for leaving last job (select all that apply)
          </Label>
          <div className="space-y-2">
            {[
              'Uncomfortable caregiving setting',
              'Low payment',
              'Disagreement with owner/provider',
              'Interpersonal challenges with residents',
              'Relocated'
            ].map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <Checkbox
                  id={reason}
                  checked={formData.reasonForLeaving.includes(reason)}
                  onCheckedChange={(checked) => handleArrayUpdate('reasonForLeaving', reason, checked as boolean)}
                />
                <Label htmlFor={reason}>{reason}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other-reason"
                checked={formData.reasonForLeaving.includes('Other')}
                onCheckedChange={(checked) => handleArrayUpdate('reasonForLeaving', 'Other', checked as boolean)}
              />
              <Label htmlFor="other-reason">Other:</Label>
            </div>
            {formData.reasonForLeaving.includes('Other') && (
              <Input
                value={formData.otherReason}
                onChange={(e) => updateFormData('otherReason', e.target.value)}
                placeholder="Specify other reason"
                className="ml-6"
              />
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">
          Preferred Work Type <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.preferredWorkType}
          onValueChange={(value) => updateFormData('preferredWorkType', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Full-time" id="work-full" />
            <Label htmlFor="work-full">Full-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Part-time" id="work-part" />
            <Label htmlFor="work-part">Part-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Any" id="work-any" />
            <Label htmlFor="work-any">Any</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="work-other" />
            <Label htmlFor="work-other">Other</Label>
          </div>
        </RadioGroup>
        {errors.preferredWorkType && <p className="text-red-500 text-sm">{errors.preferredWorkType}</p>}
      </div>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'personal': return renderPersonalSection()
      case 'certification': return renderCertificationSection()
      case 'availability': return renderAvailabilitySection()
      case 'driving': return renderDrivingSection()
      case 'education': return renderEducationSection()
      case 'legal': return renderLegalSection()
      default: return renderPersonalSection()
    }
  }

  const currentSectionIndex = sections.findIndex(s => s.id === currentSection)
  const isLastSection = currentSectionIndex === sections.length - 1
  const isFirstSection = currentSectionIndex === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30">
   {/* Header */}
<div className="bg-white border-b border-slate-200 shadow-sm">
  <div className="container mx-auto px-4 py-4 sm:py-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Caregiver Application</h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Complete your profile to get matched with opportunities
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-medium text-slate-900">{Math.round(progress)}% Complete</div>
          <div className="text-xs text-slate-600">{completedSections.length} of {sections.length} sections</div>
        </div>
        <div className="w-full sm:w-32">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Application Sections</CardTitle>
                <CardDescription>Click any section to navigate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section, index) => {
                  const IconComponent = section.icon
                  const isCompleted = completedSections.includes(section.id)
                  const isCurrent = currentSection === section.id
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                        isCurrent 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : isCurrent 
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs opacity-75">
                          {isCompleted ? 'Complete' : 'Pending'}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {(() => {
                    const section = sections.find(s => s.id === currentSection)
                    const IconComponent = section?.icon || User
                    return <IconComponent className="w-6 h-6 text-blue-600" />
                  })()}
                  <div>
                    <CardTitle className="text-xl">
                      {sections.find(s => s.id === currentSection)?.title}
                    </CardTitle>
                    <CardDescription>
                      Section {currentSectionIndex + 1} of {sections.length}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.keys(errors).length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      Please correct the errors below before continuing.
                    </AlertDescription>
                  </Alert>
                )}

                {renderCurrentSection()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!isFirstSection) {
                        setCurrentSection(sections[currentSectionIndex - 1].id)
                      }
                    }}
                    disabled={isFirstSection}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Save progress (in a real app, this would save to localStorage or API)
                        alert('Progress saved!')
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Progress
                    </Button>

                    {isLastSection ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          if (validateSection(currentSection)) {
                            setCurrentSection(sections[currentSectionIndex + 1].id)
                          }
                        }}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
