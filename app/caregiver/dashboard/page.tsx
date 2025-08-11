'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, XCircle, Clock, User, Briefcase, Star, MapPin, Calendar, AlertCircle, TrendingUp, Award, Phone, Mail, Edit, MessageSquare, Building } from 'lucide-react'
import Link from 'next/link'

import { RatingSystem } from '@/components/RatingSystem'

export default function EmployeeDashboard() {
  const [isActive, setIsActive] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  // Mock user data
  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Portland, OR',
    profileImage: '/professional-woman-diverse.png',
    joinDate: '2024-01-15',
    rating: 4.8,
    completedJobs: 12,
    skills: ['Caregiving', 'First Aid/CPR', 'Patient Care', 'Communication'],
    certifications: ['CNA', 'First Aid/CPR', 'Tier 1', 'OIS']
  }

  // Mock applications data with detailed information
  const applications = [
    {
      id: 1,
      jobTitle: 'Senior Caregiver - Full Week Shift',
      company: 'FIGA LLC',
      location: 'Clackamas, OR',
      jobType: 'Healthcare',
      workType: 'Live-in',
      salary: '$3,500/week',
      appliedDate: '2024-01-20',
      status: 'accepted',
      message: 'Congratulations! You have been selected for this position. The employer was impressed with your experience and certifications. Please contact our staff for next steps.',
      workDetails: {
        startDate: '2024-01-25',
        schedule: 'Sunday morning to Friday morning',
        salary: '$3,500/week',
        contact: 'Staff Coordinator: (503) 905-1648'
      },
      jobDescription: 'Full week shift caregiver needed for day and night coverage. Must be reliable and experienced with elderly care.',
      requirements: ['Valid driver\'s license', 'All required documents (Tiers, OIS, First Aid/CPR)', 'Clear English communication'],
      benefits: ['Competitive weekly pay', 'Accommodation provided', 'Meals included'],
      companyRating: null
    },
    {
      id: 2,
      jobTitle: 'Software Developer - React/Node.js',
      company: 'TechStart Inc',
      location: 'Portland, OR',
      jobType: 'Technology',
      workType: 'Remote',
      salary: '$85,000/year',
      appliedDate: '2024-01-18',
      status: 'rejected',
      message: 'Thank you for your application. While your qualifications are strong, we selected a candidate with more specialized experience in this particular tech stack.',
      feedback: [
        'Consider gaining more experience with React hooks and context',
        'Strengthen your Node.js backend development skills',
        'Build more full-stack projects to showcase your abilities'
      ],
      jobDescription: 'Full-stack developer position working with modern React and Node.js technologies.',
      requirements: ['3+ years React experience', 'Node.js proficiency', 'Database knowledge'],
      benefits: ['Remote work', 'Health insurance', 'Flexible hours'],
      companyRating: 4.2
    },
    {
      id: 3,
      jobTitle: 'Marketing Coordinator',
      company: 'Creative Agency',
      location: 'Beaverton, OR',
      jobType: 'Marketing',
      workType: 'Hybrid',
      salary: '$55,000/year',
      appliedDate: '2024-01-22',
      status: 'pending',
      message: 'Your application is currently under review by our staff. We will notify you once a decision has been made.',
      jobDescription: 'Marketing coordinator position for creative campaigns and social media management.',
      requirements: ['Marketing degree preferred', 'Social media experience', 'Creative thinking'],
      benefits: ['Hybrid work', 'Creative environment', 'Professional development'],
      companyRating: null
    }
  ]

  const activeJobs = applications.filter(app => app.status === 'accepted')
  const stats = [
    { label: 'Applications Submitted', value: '8', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Jobs Accepted', value: '1', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Profile Rating', value: '4.8', icon: Star, color: 'text-yellow-600' },
    { label: 'Completed Jobs', value: '12', icon: TrendingUp, color: 'text-purple-600' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'Healthcare': return 'bg-blue-100 text-blue-800'
      case 'Technology': return 'bg-purple-100 text-purple-800'
      case 'Marketing': return 'bg-green-100 text-green-800'
      case 'Finance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApplicationClick = (application: any) => {
    setSelectedApplication(application)
  }

  const handleRateCompany = (company: any) => {
    setSelectedCompany(company)
    setShowRatingDialog(true)
  }

  const submitCompanyRating = (rating: number, comment: string) => {
    console.log('Company rating submitted:', { company: selectedCompany, rating, comment })
    setShowRatingDialog(false)
    setSelectedCompany(null)
  }

  // Application Detail Modal
  if (selectedApplication) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header
        <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/">
                <FIGALogo size="md" />
              </Link>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedApplication(null)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  ← Back to Dashboard
                </Button>
                <Avatar>
                  <AvatarImage src={userData.profileImage || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header> */}

        <div className="  max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >
                <div className="flex justify-between items-center h-16">

                  <div>
                    
                  </div>
                <div className="flex items-right space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedApplication(null)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  ← Back to Dashboard
                </Button>
                <Avatar>
                  <AvatarImage src={userData.profileImage || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

                </div>
                
                
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{selectedApplication.jobTitle}</h1>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {getStatusIcon(selectedApplication.status)}
                      <span className="ml-1 capitalize">{selectedApplication.status}</span>
                    </Badge>
                    <Badge className={getJobTypeColor(selectedApplication.jobType)}>
                      {selectedApplication.jobType}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      {selectedApplication.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      {selectedApplication.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      {selectedApplication.workType}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      {selectedApplication.salary}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className={`p-4 rounded-lg mb-6 ${
                selectedApplication.status === 'accepted' ? 'bg-green-50 border border-green-200' :
                selectedApplication.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                'bg-yellow-50 border border-yellow-200'
              }`}>
                <p className={`text-sm ${
                  selectedApplication.status === 'accepted' ? 'text-green-800' :
                  selectedApplication.status === 'rejected' ? 'text-red-800' :
                  'text-yellow-800'
                }`}>
                  <strong>Staff Message:</strong> {selectedApplication.message}
                </p>
              </div>

              {/* Job Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedApplication.jobDescription}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedApplication.requirements.map((req: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 p-3 justify-start">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedApplication.benefits.map((benefit: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200 p-3 justify-start">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Work Details for Accepted Jobs */}
                {selectedApplication.status === 'accepted' && selectedApplication.workDetails && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 mb-4">Work Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                      <div><strong>Start Date:</strong> {selectedApplication.workDetails.startDate}</div>
                      <div><strong>Schedule:</strong> {selectedApplication.workDetails.schedule}</div>
                      <div><strong>Salary:</strong> {selectedApplication.workDetails.salary}</div>
                      <div><strong>Contact:</strong> {selectedApplication.workDetails.contact}</div>
                    </div>
                  </div>
                )}

                {/* Feedback for Rejected Applications */}
                {selectedApplication.status === 'rejected' && selectedApplication.feedback && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-orange-900 mb-4">Improvement Suggestions</h2>
                    <ul className="list-disc list-inside space-y-2 text-orange-800">
                      {selectedApplication.feedback.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Company Rating Section */}
                {selectedApplication.status === 'accepted' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Your Experience</h3>
                        <p className="text-gray-600">Share your experience working with {selectedApplication.company}</p>
                      </div>
                      <Button 
                        onClick={() => handleRateCompany(selectedApplication.company)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Rate Company
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <FIGALogo size="md" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Professional Dashboard</span>
              <Avatar>
                <AvatarImage src={userData.profileImage || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userData.profileImage || "/placeholder.svg?height=64&width=64"} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userData.name}
                </h1>
                <p className="text-gray-600">
                  Professional since {userData.joinDate}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="active-status" className="text-sm font-medium">
                  {isActive ? 'Active' : 'Inactive'}
                </Label>
                <Switch
                  id="active-status"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          {!isActive && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">
                  Your profile is currently inactive. You won't receive new job matches until you activate your profile.
                </p>
              </div>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-blue-100 rounded-lg p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger 
              value="active-jobs" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Active Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Applications</CardTitle>
                  <CardDescription>Your latest job applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
                    <div 
                      key={app.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleApplicationClick(app)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{app.jobTitle}</p>
                        <p className="text-sm text-gray-600">{app.company} • {app.location}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Profile Status</CardTitle>
                  <CardDescription>Your professional profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completeness</span>
                    <span className="font-semibold text-blue-600">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verification Status</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{userData.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Status</span>
                    <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {applications.length} Total Applications
              </Badge>
            </div>

            <div className="space-y-6">
              {applications.map((app) => (
                <Card 
                  key={app.id} 
                  className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleApplicationClick(app)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {app.jobTitle}
                          </h3>
                          <Badge className={getStatusColor(app.status)}>
                            {getStatusIcon(app.status)}
                            <span className="ml-1 capitalize">{app.status}</span>
                          </Badge>
                          <Badge className={getJobTypeColor(app.jobType)}>
                            {app.jobType}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {app.company}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {app.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Applied {app.appliedDate}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {app.salary}
                          </div>
                        </div>

                        <p className="text-gray-700 line-clamp-2">{app.jobDescription}</p>
                      </div>

                      <div className="ml-6">
                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active-jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Active Jobs</h2>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {activeJobs.length} Active Position{activeJobs.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {activeJobs.length > 0 ? (
              <div className="space-y-6">
                {activeJobs.map((job) => (
                  <Card key={job.id} className="bg-white shadow-sm border-0 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.jobTitle}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Active
                        </Badge>
                      </div>

                      {job.workDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                              <span><strong>Start:</strong> {job.workDetails.startDate}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span><strong>Schedule:</strong> {job.workDetails.schedule}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
                              <span><strong>Salary:</strong> {job.workDetails.salary}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 mr-2 text-gray-500" />
                              <span><strong>Contact:</strong> {job.workDetails.contact}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Jobs</h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any active job positions at the moment.
                  </p>
                  <Link href="/jobs">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Browse Available Opportunities
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Profile Information</CardTitle>
                <CardDescription>Your professional profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userData.profileImage || "/placeholder.svg?height=96&width=96"} />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{userData.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-600 mt-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {userData.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {userData.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {userData.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {userData.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Display existing ratings */}
            <RatingSystem
              type="display-ratings"
              existingRatings={[
                {
                  id: '1',
                  raterName: 'TechStart Inc',
                  raterImage: '/company-logo.png',
                  rating: 5,
                  comment: 'Excellent communication and technical skills. Would definitely work with again.',
                  date: '2024-01-15',
                  helpful: 3
                },
                {
                  id: '2',
                  raterName: 'Healthcare Plus',
                  raterImage: '/healthcare-logo.png',
                  rating: 4,
                  comment: 'Very professional and reliable. Great attention to detail.',
                  date: '2024-01-10',
                  helpful: 5
                }
              ]}
            />
          </TabsContent>
        </Tabs>

        {/* Company Rating Dialog */}
        <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rate Company Experience</DialogTitle>
              <DialogDescription>
                Please rate your experience working with {selectedCompany}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <RatingSystem
                type="employee-rating-company"
                targetName={selectedCompany}
                onSubmitRating={submitCompanyRating}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
