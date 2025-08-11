"use client"

import { AuthGuard } from '@/components/auth'
import { Container, Section } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, RadioGroup, RadioGroupItem, Switch, Separator, Badge, Progress } from '@/components/ui'
import { Save, Send, MapPin, Clock, User, CheckCircle, MessageSquare, Calendar } from 'lucide-react'
import { useState } from 'react'

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    isJobOpen: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    shiftTypes: [] as string[],
    duration: "",
    preferredGender: "",
    drivingRequired: false,
    licenseRequired: false,
    englishRequired: false,
    communicationLevel: "",
    requirements: [] as string[],
    otherRequirement: "",
    additionalNotes: "",
    contactInfo: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleShiftTypeChange = (shiftType: string, checked: boolean | string) => {
    const isChecked = checked === true
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        shiftTypes: [...prev.shiftTypes, shiftType]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        shiftTypes: prev.shiftTypes.filter(type => type !== shiftType)
      }))
    }
  }

  const handleRequirementChange = (requirement: string, checked: boolean | string) => {
    const isChecked = checked === true
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter(req => req !== requirement)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    // Basic validation
    if (!formData.jobTitle || !formData.location || !formData.isJobOpen || formData.shiftTypes.length === 0) {
      setSubmitMessage("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitMessage("Job posted successfully! 🎉")
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          jobTitle: "",
          location: "",
          isJobOpen: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          shiftTypes: [],
          duration: "",
          preferredGender: "",
          drivingRequired: false,
          licenseRequired: false,
          englishRequired: false,
          communicationLevel: "",
          requirements: [],
          otherRequirement: "",
          additionalNotes: "",
          contactInfo: ""
        })
        setSubmitMessage("")
      }, 3000)
    } catch (error) {
      setSubmitMessage("Failed to post job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <AuthGuard requireAuth={false} >
      <Section padding="xl">
        <Container size="xl">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Post a Caregiver Job</h1>
              <p className="text-slate-600">Find the perfect caregiver for your needs</p>
            </div>

            {submitMessage && (
              <div className={`p-4 rounded-lg text-center ${
                submitMessage.includes('successfully') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Fill out all required fields to post your job</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Job Title & Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">
                          Job Title <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>
                        </Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g., Caregiver Needed – Full Week Shift (Day & Night) in Clackamas, OR"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">
                          Location (City, State) <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>
                        </Label>
                        <Input
                          id="location"
                          placeholder="e.g., Portland, OR"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>
                        Is this job still open? <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>
                      </Label>
                      <RadioGroup
                        value={formData.isJobOpen}
                        onValueChange={(value: string) => setFormData(prev => ({ ...prev, isJobOpen: value }))}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="job-open-yes" />
                          <Label htmlFor="job-open-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="job-open-no" />
                          <Label htmlFor="job-open-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Schedule & Shift Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Schedule & Shift Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>
                        Shift Type <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          "Day shift",
                          "Night shift", 
                          "12-hour",
                          "Live-in",
                          "Weekend",
                          "One-time",
                          "Ongoing"
                        ].map((shiftType) => (
                          <div key={shiftType} className="flex items-center space-x-2">
                            <Checkbox
                              id={`shift-${shiftType}`}
                              checked={formData.shiftTypes.includes(shiftType)}
                              onCheckedChange={(checked) => handleShiftTypeChange(shiftType, checked)}
                            />
                            <Label htmlFor={`shift-${shiftType}`} className="text-sm">
                              {shiftType}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (Optional)</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., Full-time, 5 days or One-day shift only"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Caregiver Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Caregiver Preferences
                    </h3>
                    <div className="space-y-3">
                      <Label>Preferred Gender</Label>
                      <RadioGroup
                        value={formData.preferredGender}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, preferredGender: value }))}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="gender-male" />
                          <Label htmlFor="gender-male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="gender-female" />
                          <Label htmlFor="gender-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no-preference" id="gender-no-pref" />
                          <Label htmlFor="gender-no-pref">No preference</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Driving Required?</Label>
                          <p className="text-sm text-gray-500">Must be able to drive</p>
                        </div>
                        <Switch
                          checked={formData.drivingRequired}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, drivingRequired: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Driver's License Required?</Label>
                          <p className="text-sm text-gray-500">Must have valid license</p>
                        </div>
                        <Switch
                          checked={formData.licenseRequired}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, licenseRequired: checked }))}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>English Communication Required?</Label>
                        <p className="text-sm text-gray-500">Must communicate in English</p>
                      </div>
                      <Switch
                        checked={formData.englishRequired}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, englishRequired: checked }))}
                      />
                    </div>

                    {formData.englishRequired && (
                      <div className="space-y-2">
                        <Label>Level of English Communication Required</Label>
                        <Select
                          value={formData.communicationLevel}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, communicationLevel: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select communication level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="fluent">Fluent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Caregiver Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                      Caregiver Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Tier 1",
                        "Tier 2", 
                        "OIS",
                        "First Aid/CPR",
                        "Experience Required",
                        "Willing to live on site",
                        "Reliable and available"
                      ].map((requirement) => (
                        <div key={requirement} className="flex items-center space-x-2">
                          <Checkbox
                            id={`req-${requirement}`}
                            checked={formData.requirements.includes(requirement)}
                            onCheckedChange={(checked) => handleRequirementChange(requirement, checked)}
                          />
                          <Label htmlFor={`req-${requirement}`}>
                            {requirement}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otherRequirement">Other Requirements</Label>
                      <Input
                        id="otherRequirement"
                        placeholder="Specify any other requirements"
                        value={formData.otherRequirement}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherRequirement: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-teal-600" />
                      Additional Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes / Expectations</Label>
                      <Textarea
                        id="additionalNotes"
                        placeholder="e.g., Strong communication skills are essential or Must stay on-site 5 days straight"
                        rows={4}
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactInfo">Contact Info for Support</Label>
                      <Input
                        id="contactInfo"
                        placeholder="e.g., @Ethio_care_team or Phone Number"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post Job"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </AuthGuard>
  )
}
