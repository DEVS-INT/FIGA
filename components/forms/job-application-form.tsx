'use client'

import { useState } from 'react'
import { Button, Input, Textarea, Label, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from '@/components/ui'
import { Upload, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react'

export function JobApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    experience: '',
    certifications: '',
    availability: '',
    references: '',
    coverLetter: '',
    hasTransportation: false,
    hasLicense: false,
    backgroundCheckConsent: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Job application submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Caregiver Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="San Francisco"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Experience & Qualifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Experience & Qualifications</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Caregiving Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  placeholder="Describe your caregiving experience, including years of experience and types of care provided..."
                  value={formData.experience}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Training</Label>
                <Textarea
                  id="certifications"
                  name="certifications"
                  placeholder="List any relevant certifications (CNA, HHA, CPR, First Aid, etc.)"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  name="availability"
                  placeholder="Describe your availability (days, hours, live-in, etc.)"
                  value={formData.availability}
                  onChange={handleChange}
                  className="min-h-[80px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasTransportation"
                  name="hasTransportation"
                  checked={formData.hasTransportation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasTransportation: !!checked }))}
                />
                <Label htmlFor="hasTransportation">I have reliable transportation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLicense"
                  name="hasLicense"
                  checked={formData.hasLicense}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasLicense: !!checked }))}
                />
                <Label htmlFor="hasLicense">I have a valid driver's license</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backgroundCheckConsent"
                  name="backgroundCheckConsent"
                  checked={formData.backgroundCheckConsent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, backgroundCheckConsent: !!checked }))}
                  required
                />
                <Label htmlFor="backgroundCheckConsent">I consent to a background check</Label>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Cover Letter</h3>
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Tell us about yourself</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Tell us why you want to be a caregiver and what makes you a good fit..."
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className="pl-10 min-h-[120px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Resume</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 mb-2">Upload your resume</p>
              <Button type="button" variant="outline">
                Choose File
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
