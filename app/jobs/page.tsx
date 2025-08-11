"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, DollarSign, Heart, Users, Calendar, Filter, ChevronDown, Star, Building2, User, CheckCircle, AlertCircle, Car, Languages } from 'lucide-react'
import Link from "next/link"

// Simple Select Component
const SimpleSelect = ({ value, onValueChange, placeholder, options }: {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 py-2 text-left bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 flex items-center justify-between"
      >
        <span className={value ? "text-slate-900" : "text-slate-500"}>
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value)
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [shiftTypeFilter, setShiftTypeFilter] = useState("")
  const [genderPreferenceFilter, setGenderPreferenceFilter] = useState("")
  const [requirementsFilter, setRequirementsFilter] = useState("")

  // Enhanced job data based on the form structure
  const jobs = [
    {
      id: 1,
      title: "🚨 Caregiver Needed – Full Week Shift (Day & Night) in Clackamas, OR",
      company: "Johnson Family Care",
      location: "Clackamas, OR",
      isOpen: true,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      shiftTypes: ["Day shift", "Night shift", "Live-in", "Ongoing"],
      duration: "Full-time, 7 days",
      genderPreference: "Female",
      drivingRequired: true,
      licenseRequired: true,
      englishRequired: true,
      communicationLevel: "Fluent",
      requirements: ["Tier 1", "First Aid/CPR", "Experience Required", "Willing to live on site", "Reliable and available"],
      salary: "$5,500-6,500/month",
      description: "Seeking a dedicated live-in caregiver for our 82-year-old mother with dementia. Must be comfortable with 24/7 care including personal hygiene, medication management, and companionship.",
      additionalNotes: "Strong communication skills are essential. Must stay on-site 7 days straight with weekends off every other week.",
      contactInfo: "@Johnson_care_team",
      posted: "2 days ago",
      urgent: true,
      applicants: 12
    },
    {
      id: 2,
      title: "Weekend Caregiver for Elderly Gentleman - Atlanta, GA",
      company: "Martinez Family",
      location: "Atlanta, GA",
      isOpen: true,
      startDate: "2024-01-20",
      endDate: "2024-06-20",
      shiftTypes: ["Weekend", "12-hour", "Ongoing"],
      duration: "Part-time weekends",
      genderPreference: "No preference",
      drivingRequired: false,
      licenseRequired: false,
      englishRequired: true,
      communicationLevel: "Intermediate",
      requirements: ["Tier 2", "Experience Required", "Reliable and available"],
      salary: "$25-30/hour",
      description: "Looking for a compassionate weekend caregiver for our 75-year-old father. Light housekeeping, meal preparation, and companionship during weekend hours.",
      additionalNotes: "Must be available Saturdays and Sundays, 8am-8pm. Experience with mobility assistance preferred.",
      contactInfo: "(404) 555-0123",
      posted: "1 week ago",
      urgent: false,
      applicants: 8
    },
    {
      id: 3,
      title: "Overnight Caregiver - Assisted Living Support",
      company: "Wilson Care Services",
      location: "San Diego, CA",
      isOpen: true,
      startDate: "2024-01-25",
      endDate: "2024-01-25",
      shiftTypes: ["Night shift", "One-time"],
      duration: "One-night shift only",
      genderPreference: "Female",
      drivingRequired: false,
      licenseRequired: false,
      englishRequired: true,
      communicationLevel: "Basic",
      requirements: ["First Aid/CPR", "Reliable and available"],
      salary: "$200-250/night",
      description: "Emergency overnight care needed for elderly woman recovering from surgery. Monitor vital signs, assist with bathroom needs, and provide comfort.",
      additionalNotes: "Must be comfortable with overnight shifts and have experience with post-surgical care.",
      contactInfo: "wilson.care@email.com",
      posted: "3 days ago",
      urgent: true,
      applicants: 5
    },
    {
      id: 4,
      title: "Part-time Child Caregiver - After School Care",
      company: "Thompson Family",
      location: "Austin, TX",
      isOpen: true,
      startDate: "2024-02-01",
      endDate: "2024-05-30",
      shiftTypes: ["Day shift", "Ongoing"],
      duration: "Part-time, 3 hours daily",
      genderPreference: "No preference",
      drivingRequired: true,
      licenseRequired: true,
      englishRequired: true,
      communicationLevel: "Fluent",
      requirements: ["Experience Required", "Reliable and available", "Background check required"],
      salary: "$18-22/hour",
      description: "Seeking reliable after-school caregiver for our 8-year-old son. Pick up from school, homework help, light snacks, and supervised play until parents return.",
      additionalNotes: "Must have own transportation and clean driving record. CPR certification preferred but not required.",
      contactInfo: "@Thompson_family_care",
      posted: "5 days ago",
      urgent: false,
      applicants: 15
    },
    {
      id: 5,
      title: "Senior Companion - Daily Living Assistance",
      company: "Davis Family Care",
      location: "Phoenix, AZ",
      isOpen: true,
      startDate: "2024-01-18",
      endDate: "2024-12-31",
      shiftTypes: ["Day shift", "Ongoing"],
      duration: "Full-time, 5 days",
      genderPreference: "Male",
      drivingRequired: true,
      licenseRequired: true,
      englishRequired: true,
      communicationLevel: "Intermediate",
      requirements: ["Tier 1", "Experience Required", "Reliable and available"],
      salary: "$20-25/hour",
      description: "Full-time companion needed for active 70-year-old gentleman. Assistance with daily activities, transportation to appointments, light housekeeping, and social engagement.",
      additionalNotes: "Must be comfortable with pets (small dog). Flexible schedule appreciated for medical appointments.",
      contactInfo: "(602) 555-0198",
      posted: "1 day ago",
      urgent: false,
      applicants: 7
    },
    {
      id: 6,
      title: "Specialized Pediatric Care - Complex Medical Needs",
      company: "Children's Care Network",
      location: "Miami, FL",
      isOpen: true,
      startDate: "2024-02-05",
      endDate: "2024-08-05",
      shiftTypes: ["Day shift", "12-hour", "Ongoing"],
      duration: "Full-time, specialized care",
      genderPreference: "Female",
      drivingRequired: false,
      licenseRequired: false,
      englishRequired: true,
      communicationLevel: "Fluent",
      requirements: ["Tier 1", "Tier 2", "First Aid/CPR", "Experience Required", "Specialized training required"],
      salary: "$35-45/hour",
      description: "Specialized care for 12-year-old child with complex medical needs including tracheostomy care, ventilator management, and developmental support.",
      additionalNotes: "RN or LPN license required. Experience with pediatric trach/vent care essential. Family training provided.",
      contactInfo: "pediatric.care@ccn.org",
      posted: "1 week ago",
      urgent: true,
      applicants: 3
    },
    {
      id: 7,
      title: "Respite Care - Alzheimer's Support",
      company: "Anderson Family",
      location: "Seattle, WA",
      isOpen: false,
      startDate: "2024-01-10",
      endDate: "2024-01-10",
      shiftTypes: ["Weekend", "12-hour"],
      duration: "Weekend respite care",
      genderPreference: "No preference",
      drivingRequired: false,
      licenseRequired: false,
      englishRequired: true,
      communicationLevel: "Intermediate",
      requirements: ["Experience Required", "Alzheimer's care experience", "Patient and understanding"],
      salary: "$28-35/hour",
      description: "Weekend respite care for family caring for loved one with mid-stage Alzheimer's. Provide relief for primary caregivers during weekend hours.",
      additionalNotes: "Experience with Alzheimer's care required. Must be patient and understanding of behavioral changes.",
      contactInfo: "(206) 555-0167",
      posted: "2 weeks ago",
      urgent: false,
      applicants: 18
    }
  ]

  // Filter options based on form structure
  const locationOptions = [
    { value: "", label: "All Locations" },
    { value: "clackamas-or", label: "Clackamas, OR" },
    { value: "atlanta-ga", label: "Atlanta, GA" },
    { value: "san-diego-ca", label: "San Diego, CA" },
    { value: "austin-tx", label: "Austin, TX" },
    { value: "phoenix-az", label: "Phoenix, AZ" },
    { value: "miami-fl", label: "Miami, FL" },
    { value: "seattle-wa", label: "Seattle, WA" }
  ]

  const shiftTypeOptions = [
    { value: "", label: "All Shift Types" },
    { value: "day-shift", label: "Day Shift" },
    { value: "night-shift", label: "Night Shift" },
    { value: "12-hour", label: "12-Hour" },
    { value: "live-in", label: "Live-in" },
    { value: "weekend", label: "Weekend" },
    { value: "one-time", label: "One-time" },
    { value: "ongoing", label: "Ongoing" }
  ]

  const genderPreferenceOptions = [
    { value: "", label: "All Gender Preferences" },
    { value: "male", label: "Male Preferred" },
    { value: "female", label: "Female Preferred" },
    { value: "no-preference", label: "No Preference" }
  ]

  const requirementsOptions = [
    { value: "", label: "All Requirements" },
    { value: "tier-1", label: "Tier 1" },
    { value: "tier-2", label: "Tier 2" },
    { value: "first-aid", label: "First Aid/CPR" },
    { value: "experience", label: "Experience Required" },
    { value: "driving", label: "Driving Required" },
    { value: "live-in", label: "Willing to Live On-site" }
  ]

  // Filter jobs based on search criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.replace('-', ' ').replace('ga', 'GA').replace('or', 'OR').replace('ca', 'CA').replace('tx', 'TX').replace('az', 'AZ').replace('fl', 'FL').replace('wa', 'WA'))
    
    const matchesShiftType = !shiftTypeFilter || job.shiftTypes.some(shift => 
      shift.toLowerCase().includes(shiftTypeFilter.replace('-', ' '))
    )
    
    const matchesGender = !genderPreferenceFilter || 
      (genderPreferenceFilter === 'no-preference' && job.genderPreference === 'No preference') ||
      job.genderPreference.toLowerCase().includes(genderPreferenceFilter)
    
    const matchesRequirements = !requirementsFilter || job.requirements.some(req => 
      req.toLowerCase().includes(requirementsFilter.replace('-', ' ').replace('first aid', 'first aid/cpr'))
    )
    
    return matchesSearch && matchesLocation && matchesShiftType && matchesGender && matchesRequirements
  })

  const getStatusBadge = (isOpen: boolean, urgent: boolean) => {
    if (!isOpen) {
      return <Badge variant="secondary" className="bg-slate-100 text-slate-600">🔴 Closed</Badge>
    }
    if (urgent) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">🚨 Urgent</Badge>
    }
    return <Badge className="bg-green-100 text-green-700 border-green-200">🟢 Open</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30">
      {/* Hero Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Caregiving Job
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Discover meaningful opportunities to make a difference in families' lives across the United States
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-base">
                <Heart className="w-4 h-4 mr-2" />
                {jobs.filter(job => job.isOpen).length} Active Jobs
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-base">
                <Users className="w-4 h-4 mr-2" />
                Trusted Families
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-base">
                <Star className="w-4 h-4 mr-2" />
                Top Rated Platform
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-base rounded-2xl border-2 border-slate-200 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <SimpleSelect
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                  placeholder="All Locations"
                  options={locationOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Shift Type</label>
                <SimpleSelect
                  value={shiftTypeFilter}
                  onValueChange={setShiftTypeFilter}
                  placeholder="All Shift Types"
                  options={shiftTypeOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Gender Preference</label>
                <SimpleSelect
                  value={genderPreferenceFilter}
                  onValueChange={setGenderPreferenceFilter}
                  placeholder="All Preferences"
                  options={genderPreferenceOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Requirements</label>
                <SimpleSelect
                  value={requirementsFilter}
                  onValueChange={setRequirementsFilter}
                  placeholder="All Requirements"
                  options={requirementsOptions}
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-slate-600 font-medium">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setLocationFilter("")
                  setShiftTypeFilter("")
                  setGenderPreferenceFilter("")
                  setRequirementsFilter("")
                }}
                className="text-slate-600 hover:text-slate-800"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-2xl font-bold text-slate-900">{job.title}</h3>
                              {getStatusBadge(job.isOpen, job.urgent)}
                            </div>
                            <div className="flex items-center text-slate-600 mb-2">
                              <Building2 className="w-4 h-4 mr-2" />
                              <span className="font-medium">{job.company}</span>
                            </div>
                          </div>
                        </div>

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center text-slate-600">
                            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Clock className="w-4 h-4 mr-2 text-green-600" />
                            <span>{job.duration}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                            <span className="font-semibold">{job.salary}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <User className="w-4 h-4 mr-2 text-orange-600" />
                            <span>{job.genderPreference}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Languages className="w-4 h-4 mr-2 text-indigo-600" />
                            <span>{job.communicationLevel} English</span>
                          </div>
                          {job.drivingRequired && (
                            <div className="flex items-center text-slate-600">
                              <Car className="w-4 h-4 mr-2 text-red-600" />
                              <span>Driving Required</span>
                            </div>
                          )}
                        </div>

                        {/* Shift Types */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-900 mb-2">Shift Types:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.shiftTypes.map((shift, index) => (
                              <Badge key={index} variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                                {shift}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-700 mb-4 leading-relaxed text-base">
                          {job.description}
                        </p>

                        {/* Requirements */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-900 mb-2">Requirements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-slate-600 border-slate-300">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Additional Notes */}
                        {job.additionalNotes && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Additional Notes:
                            </h4>
                            <p className="text-blue-800 text-sm">{job.additionalNotes}</p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Posted {job.posted}</span>
                            <span>•</span>
                            <span>{job.applicants} applicants</span>
                            <span>•</span>
                            <span>Contact: {job.contactInfo}</span>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="lg:ml-8 flex-shrink-0">
                        {job.isOpen ? (
                          <Link href="/signup">
                            <Button 
                              size="lg" 
                              className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-base font-semibold rounded-2xl"
                            >
                              Apply Now
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            size="lg" 
                            disabled
                            className="w-full lg:w-auto px-8 py-4 text-base font-semibold rounded-2xl"
                          >
                            Position Closed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No jobs found</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or clearing the filters to see more opportunities.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setLocationFilter("")
                    setShiftTypeFilter("")
                    setGenderPreferenceFilter("")
                    setRequirementsFilter("")
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
