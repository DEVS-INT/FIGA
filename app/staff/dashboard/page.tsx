"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  AlertCircle,
  Edit,
  MessageSquare,
  Building,
  Send,
  Plus,
  Filter,
  Check,
  Eye,
  Search,
  Download,
  Upload,
  Calendar,
  Clock,
  Shield,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Star,
  BarChart2,
  Clipboard,
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

import { toast } from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"



export default function StaffDashboard() {

  const [activeTab, setActiveTab] = useState("overview")
  const [showPostJobDialog, setShowPostJobDialog] = useState(false)
  const [showCreateEmployerDialog, setShowCreateEmployerDialog] = useState(false)
  const [showSendMessageDialog, setShowSendMessageDialog] = useState(false)
  const [showSendToEmployerDialog, setShowSendToEmployerDialog] = useState(false)
  const [showCaregiverDetails, setShowCaregiverDetails] = useState(false)
  const [showEmployerDetails, setShowEmployerDetails] = useState(false)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [selectedCaregiver, setSelectedCaregiver] = useState<any>(null)
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [selectedEmployerForCaregiver, setSelectedEmployerForCaregiver] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [jobFormData, setJobFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
  })
  const [employerFormData, setEmployerFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  })
  const [caregiverFilter, setCaregiverFilter] = useState({
    skill: "",
    location: "",
    status: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New caregiver registration requires verification", read: false, date: "2024-07-22" },
    { id: 2, message: "Employer requested more candidates", read: false, date: "2024-07-21" },
    { id: 3, message: "System maintenance scheduled", read: true, date: "2024-07-20" },
  ])
  const [unreadNotifications, setUnreadNotifications] = useState(2)
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState("")

  // Mock staff user data
  const staffData = {
    name: "John Doe",
    email: "john.doe@figacare.com",
    role: "Staff Coordinator",
    profileImage: "/placeholder.svg?height=32&width=32",
    joinDate: "2023-03-01",
    lastLogin: "2024-07-22 09:45 AM",
  }

  // Mock data for staff dashboard
  const stats = [
    { label: "Total Caregivers", value: "150", icon: User, color: "text-blue-600", trend: "up", change: "5% from last month" },
    { label: "Total Employers", value: "45", icon: Building, color: "text-purple-600", trend: "up", change: "2% from last month" },
    { label: "Active Jobs", value: "25", icon: Briefcase, color: "text-green-600", trend: "down", change: "3% from last week" },
    { label: "Pending Verifications", value: "5", icon: AlertCircle, color: "text-yellow-600", trend: "same", change: "No change" },
  ]

  const mockCaregivers = [
    {
      id: 1,
      name: "Alice Smith",
      email: "alice.s@example.com",
      phone: "555-111-2222",
      location: "Portland, OR",
      skills: ["Caregiving", "First Aid", "CPR Certified"],
      status: "Active",
      isVerified: true,
      profileImage: "/placeholder.svg?height=32&width=32",
      experience: "5 years",
      rating: 4.8,
      availability: "Full-time",
      languages: ["English", "Spanish"],
      certifications: ["CNA", "First Aid", "CPR"],
      bio: "Compassionate caregiver with extensive experience in elderly care and dementia support.",
      references: [
        { name: "Jane Miller", phone: "555-123-4567", relation: "Previous Employer" },
        { name: "Robert Johnson", phone: "555-987-6543", relation: "Client Family" }
      ],
      documents: ["Resume.pdf", "Certifications.pdf"],
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob.j@example.com",
      phone: "555-333-4444",
      location: "Beaverton, OR",
      skills: ["Patient Care", "CPR", "Medication Management"],
      status: "Inactive",
      isVerified: false,
      profileImage: "/placeholder.svg?height=32&width=32",
      experience: "3 years",
      rating: 4.2,
      availability: "Part-time",
      languages: ["English"],
      certifications: ["CPR"],
      bio: "Dedicated to providing quality care with a focus on patient comfort and dignity.",
      references: [
        { name: "Sarah Williams", phone: "555-456-7890", relation: "Previous Client" }
      ],
      documents: ["Resume.pdf"],
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      phone: "555-555-6666",
      location: "Vancouver, WA",
      skills: ["Dementia Care", "Medication Management", "Mobility Assistance"],
      status: "Active",
      isVerified: true,
      profileImage: "/placeholder.svg?height=32&width=32",
      experience: "7 years",
      rating: 4.9,
      availability: "Live-in",
      languages: ["English", "Russian"],
      certifications: ["CNA", "Dementia Care Specialist"],
      bio: "Specialized in dementia care with a gentle approach and excellent references.",
      references: [
        { name: "Michael Davis", phone: "555-789-0123", relation: "Agency Director" },
        { name: "Emily Wilson", phone: "555-234-5678", relation: "Client Daughter" }
      ],
      documents: ["Resume.pdf", "Certifications.pdf", "BackgroundCheck.pdf"],
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana.p@example.com",
      phone: "555-777-8888",
      location: "Portland, OR",
      skills: ["Live-in Care", "Cooking", "Housekeeping"],
      status: "Pending Verification",
      isVerified: false,
      profileImage: "/placeholder.svg?height=32&width=32",
      experience: "2 years",
      rating: 4.5,
      availability: "Flexible",
      languages: ["English", "French"],
      certifications: ["First Aid"],
      bio: "Provides comprehensive care including household tasks and meal preparation.",
      references: [
        { name: "Thomas Anderson", phone: "555-345-6789", relation: "Previous Client" }
      ],
      documents: ["Resume.pdf"],
    },
  ]

  const mockEmployers = [
    {
      id: 1,
      name: "Elderly Care Solutions",
      contact: "Jane Doe",
      email: "jane@elderlycare.com",
      phone: "503-123-4567",
      status: "Active",
      address: "123 Main St, Portland, OR 97201",
      jobsPosted: 12,
      lastActive: "2024-07-20",
      rating: 4.7,
      preferences: ["Certified caregivers", "Experience with dementia"],
      notes: "Prefers caregivers with CNA certification. Quick to respond.",
    },
    {
      id: 2,
      name: "Home Health Partners",
      contact: "Mark Smith",
      email: "mark@homehealth.com",
      phone: "503-987-6543",
      status: "Active",
      address: "456 Oak Ave, Beaverton, OR 97005",
      jobsPosted: 8,
      lastActive: "2024-07-18",
      rating: 4.3,
      preferences: ["Bilingual caregivers", "Flexible availability"],
      notes: "Often needs last-minute coverage. Good payment history.",
    },
    {
      id: 3,
      name: "Compassionate Care Inc.",
      contact: "Sarah Lee",
      email: "sarah@compassionate.com",
      phone: "503-555-1234",
      status: "Pending",
      address: "789 Pine Blvd, Vancouver, WA 98660",
      jobsPosted: 3,
      lastActive: "2024-07-15",
      rating: 4.0,
      preferences: ["Special needs experience", "Own transportation"],
      notes: "New client. Requires thorough vetting of candidates.",
    },
  ]

  const mockJobs = [
    {
      id: 1,
      title: "Live-in Caregiver",
      company: "Elderly Care Solutions",
      location: "Portland, OR",
      status: "Open",
      postedDate: "2024-07-20",
      applicants: 8,
      type: "Full-time",
      salary: "$3,200/month",
      description: "Provide 24/7 care for elderly client with mild dementia. Private room provided.",
      requirements: "CNA certification, dementia experience, clean background check",
      benefits: "Private room, meals included, health insurance after 90 days",
    },
    {
      id: 2,
      title: "Part-time CNA",
      company: "Home Health Partners",
      location: "Beaverton, OR",
      status: "Open",
      postedDate: "2024-07-18",
      applicants: 5,
      type: "Part-time",
      salary: "$22/hour",
      description: "Assist with daily living activities for multiple clients in assisted living facility.",
      requirements: "Active CNA license, reliable transportation, 1+ year experience",
      benefits: "Flexible scheduling, paid training, retirement matching",
    },
    {
      id: 3,
      title: "Dementia Specialist",
      company: "Compassionate Care Inc.",
      location: "Vancouver, WA",
      status: "Closed",
      postedDate: "2024-07-15",
      applicants: 12,
      type: "Full-time",
      salary: "$25/hour",
      description: "Specialized care for client with advanced dementia. Behavioral management skills required.",
      requirements: "Dementia certification, 3+ years experience, references",
      benefits: "Health benefits, paid time off, continuing education allowance",
    },
  ]

  const recentActivities = [
    { id: 1, action: "Posted new job", entity: "Live-in Caregiver", time: "2 hours ago", user: "John Doe" },
    { id: 2, action: "Verified caregiver", entity: "Alice Smith", time: "Yesterday", user: "John Doe" },
    { id: 3, action: "Contacted employer", entity: "Home Health Partners", time: "2 days ago", user: "John Doe" },
    { id: 4, action: "Updated profile", entity: "Staff settings", time: "3 days ago", user: "John Doe" },
  ]

  const filteredCaregivers = mockCaregivers.filter((caregiver) => {
    const matchesSearch = searchQuery
      ? caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caregiver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caregiver.phone.includes(searchQuery)
      : true
    const matchesSkill = caregiverFilter.skill
      ? caregiver.skills.some((s) => s.toLowerCase().includes(caregiverFilter.skill.toLowerCase()))
      : true
    const matchesLocation = caregiverFilter.location
      ? caregiver.location.toLowerCase().includes(caregiverFilter.location.toLowerCase())
      : true
    const matchesStatus = caregiverFilter.status ? caregiver.status === caregiverFilter.status : true
    return matchesSearch && matchesSkill && matchesLocation && matchesStatus
  })

  const handleJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setJobFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePostJob = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Posting new job:", jobFormData)
      toast(`Job Posted Successfully: The ${jobFormData.title} position has been posted.`)
      setIsLoading(false)
      setShowPostJobDialog(false)
      setJobFormData({
        title: "",
        company: "",
        location: "",
        type: "",
        salary: "",
        description: "",
        requirements: "",
        benefits: "",
      })
    }, 1500)
  }

  const handleEmployerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEmployerFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateEmployerAccount = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Creating employer account:", employerFormData)
 

      toast(`Employer Account Created: The ${employerFormData.companyName} has been added to the system.`)
      setIsLoading(false)
      setShowCreateEmployerDialog(false)
      setEmployerFormData({ companyName: "", contactPerson: "", email: "", phone: "", address: "" })
    }, 1500)
  }

  const handleSendMessage = () => {
    if (selectedCaregiver && messageContent) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        console.log(`Sending message to ${selectedCaregiver.name}: ${messageContent}`)
   
        toast(`Message Sent: Your message has been sent to ${selectedCaregiver.name}.`)
        
        setIsLoading(false)
        setShowSendMessageDialog(false)
        setMessageContent("")
        setSelectedCaregiver(null)
      }, 1000)
    }
  }

  const handleSendToEmployer = () => {
    if (selectedCaregiver && selectedEmployerForCaregiver) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        console.log(`Sending ${selectedCaregiver.name} to employer ${selectedEmployerForCaregiver}`)


         toast(`Profile Shared: ${selectedCaregiver.name}'s profile has been shared with ${selectedEmployerForCaregiver}.`)
        setIsLoading(false)
        setShowSendToEmployerDialog(false)
        setSelectedEmployerForCaregiver("")
        setSelectedCaregiver(null)
      }, 1000)
    }
  }

  const handleVerifyCaregiver = (caregiverId: number) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log(`Verifying caregiver with ID: ${caregiverId}`)

      toast(`Caregiver Verified: The caregiver account has been successfully verified.`)
      setIsLoading(false)
    }, 1000)
  }

  const handleMarkNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ))
    setUnreadNotifications(Math.max(0, unreadNotifications - 1))
  }

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})))
    setUnreadNotifications(0)
  }

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">FigaCare Staff Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  if (!showNotifications && unreadNotifications > 0) {
                    handleMarkAllNotificationsAsRead()
                  }
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <Button variant="link" size="sm" onClick={handleMarkAllNotificationsAsRead}>
                        Mark all as read
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                          onClick={() => handleMarkNotificationAsRead(notification.id)}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <Button variant="link" size="sm" className="w-full">
                      View all notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={staffData.profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {staffData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{staffData.name}</span>
                  <ChevronDown className="h-4 w-4 hidden md:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="w-16 h-16">
                <AvatarImage src={staffData.profileImage || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {staffData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {staffData.name}</h1>
                <p className="text-gray-600">
                  {staffData.role} since {staffData.joinDate}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Last login: {staffData.lastLogin}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <BarChart2 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-blue-100 rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="caregivers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Caregivers
            </TabsTrigger>
            <TabsTrigger value="employers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Employers
            </TabsTrigger>
            <TabsTrigger
              value="job-management"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Job Management
            </TabsTrigger>
            <TabsTrigger
              value="account-management"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Account Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          {stat.trend === "up" ? (
                            <ChevronUp className="h-4 w-4 text-green-500" />
                          ) : stat.trend === "down" ? (
                            <ChevronDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <span className="h-4 w-4">-</span>
                          )}
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your recent actions in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                          <ActivityIcon action={activity.action} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          <p className="text-sm text-gray-600">{activity.entity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks you can perform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setShowPostJobDialog(true)}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Post a New Job
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setShowCreateEmployerDialog(true)}
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Add New Employer
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setActiveTab("caregivers")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Verify Caregivers
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                    >
                      <Clipboard className="w-4 h-4 mr-2" />
                      Generate Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="caregivers" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Caregivers</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search caregivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setCaregiverFilter({ skill: "", location: "", status: "" })}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="skill-filter">Skill</Label>
                <Input
                  id="skill-filter"
                  placeholder="Filter by skill"
                  value={caregiverFilter.skill}
                  onChange={(e) => setCaregiverFilter((prev) => ({ ...prev, skill: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location-filter">Location</Label>
                <Input
                  id="location-filter"
                  placeholder="Filter by location"
                  value={caregiverFilter.location}
                  onChange={(e) => setCaregiverFilter((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={caregiverFilter.status}
                  onValueChange={(value) => setCaregiverFilter((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredCaregivers.length} of {mockCaregivers.length} caregivers
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCaregivers.map((caregiver) => (
                      <TableRow key={caregiver.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={caregiver.profileImage} />
                              <AvatarFallback>
                                {caregiver.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{caregiver.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{caregiver.email}</span>
                            <span className="text-xs text-gray-500">{caregiver.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{caregiver.location}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {caregiver.skills.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="truncate">
                                {skill}
                              </Badge>
                            ))}
                            {caregiver.skills.length > 3 && (
                              <Badge variant="outline" className="bg-gray-100">
                                +{caregiver.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={caregiver.status === "Active" ? "default" : 
                                     caregiver.status === "Pending Verification" ? "secondary" : "destructive"}
                          >
                            {caregiver.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{caregiver.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedCaregiver(caregiver)
                                  setShowCaregiverDetails(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedCaregiver(caregiver)
                                  setShowSendMessageDialog(true)
                                }}
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedCaregiver(caregiver)
                                  setShowSendToEmployerDialog(true)
                                }}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Send to Employer
                              </DropdownMenuItem>
                              {!caregiver.isVerified && (
                                <DropdownMenuItem 
                                  onClick={() => handleVerifyCaregiver(caregiver.id)}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Verify Account
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employers" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Manage Employers</h2>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowCreateEmployerDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Employer Account
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Jobs Posted</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmployers.map((employer) => (
                      <TableRow key={employer.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{employer.name}</TableCell>
                        <TableCell>{employer.contact}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{employer.email}</span>
                            <span className="text-xs text-gray-500">{employer.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={employer.status === "Active" ? "default" : "secondary"}
                          >
                            {employer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{employer.jobsPosted}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{employer.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedEmployer(employer)
                                  setShowEmployerDetails(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Contact
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job-management" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
              <div className="flex space-x-2">
                <Button onClick={() => setShowPostJobDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockJobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={job.status === "Open" ? "default" : "secondary"}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.applicants}</TableCell>
                        <TableCell>{job.postedDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedJob(job)
                                  setShowJobDetails(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Applicants
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account-management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Account Settings</CardTitle>
                    <CardDescription>Manage your staff profile and settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="staff-name">Name</Label>
                        <Input id="staff-name" value={staffData.name} />
                      </div>
                      <div>
                        <Label htmlFor="staff-email">Email</Label>
                        <Input id="staff-email" value={staffData.email} type="email" />
                      </div>
                      <div>
                        <Label htmlFor="staff-role">Role</Label>
                        <Input id="staff-role" value={staffData.role} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="staff-join-date">Join Date</Label>
                        <Input id="staff-join-date" value={staffData.joinDate} readOnly />
                      </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Information</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Change Password</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your account security settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="two-factor" className="sr-only" />
                          <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-alerts">Login Alerts</Label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="login-alerts" className="sr-only" checked />
                          <div className="block bg-blue-600 w-10 h-6 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Get notified when your account is accessed.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Login Activity</CardTitle>
                    <CardDescription>Recent sign-ins to your account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Successful login</p>
                          <p className="text-sm text-gray-600">Portland, OR, United States</p>
                          <p className="text-xs text-gray-500">Today at {staffData.lastLogin.split(" ")[2]} {staffData.lastLogin.split(" ")[3]}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Successful login</p>
                          <p className="text-sm text-gray-600">Portland, OR, United States</p>
                          <p className="text-xs text-gray-500">Yesterday at 10:15 AM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Post New Job Dialog */}
        <Dialog open={showPostJobDialog} onOpenChange={setShowPostJobDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post New Job</DialogTitle>
              <DialogDescription>Fill in the details to post a new job on behalf of an employer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title*</Label>
                  <Input 
                    id="job-title" 
                    name="title" 
                    value={jobFormData.title} 
                    onChange={handleJobFormChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-company">Company*</Label>
                  <Input
                    id="job-company"
                    name="company"
                    value={jobFormData.company}
                    onChange={handleJobFormChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-location">Location*</Label>
                  <Input
                    id="job-location"
                    name="location"
                    value={jobFormData.location}
                    onChange={handleJobFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-type">Job Type*</Label>
                  <Select
                    name="type"
                    value={jobFormData.type}
                    onValueChange={(value) =>
                      handleJobFormChange({ target: { name: "type", value } } as React.ChangeEvent<HTMLSelectElement>)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Live-in">Live-in</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Per Diem">Per Diem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-salary">Salary/Compensation</Label>
                  <Input
                    id="job-salary"
                    name="salary"
                    value={jobFormData.salary}
                    onChange={handleJobFormChange}
                    placeholder="$X/week or $Y/year"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-start-date">Start Date</Label>
            
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-description">Description*</Label>
                <Textarea
                  id="job-description"
                  name="description"
                  value={jobFormData.description}
                  onChange={handleJobFormChange}
                  className="min-h-[100px]"
                  required
                  placeholder="Describe the job responsibilities and expectations..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-requirements">Requirements*</Label>
                <Textarea
                  id="job-requirements"
                  name="requirements"
                  value={jobFormData.requirements}
                  onChange={handleJobFormChange}
                  className="min-h-[80px]"
                  placeholder="List requirements, e.g., CNA, First Aid, Driver's License"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-benefits">Benefits</Label>
                <Textarea
                  id="job-benefits"
                  name="benefits"
                  value={jobFormData.benefits}
                  onChange={handleJobFormChange}
                  className="min-h-[80px]"
                  placeholder="List benefits, e.g., Health Insurance, Paid Time Off"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPostJobDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePostJob} disabled={isLoading}>
                {isLoading ? "Posting..." : "Post Job"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Employer Account Dialog */}
        <Dialog open={showCreateEmployerDialog} onOpenChange={setShowCreateEmployerDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Employer Account</DialogTitle>
              <DialogDescription>Enter details to create a new employer account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employer-company-name">Company Name*</Label>
                <Input
                  id="employer-company-name"
                  name="companyName"
                  value={employerFormData.companyName}
                  onChange={handleEmployerFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer-contact-person">Contact Person*</Label>
                <Input
                  id="employer-contact-person"
                  name="contactPerson"
                  value={employerFormData.contactPerson}
                  onChange={handleEmployerFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer-email">Email*</Label>
                <Input
                  id="employer-email"
                  name="email"
                  type="email"
                  value={employerFormData.email}
                  onChange={handleEmployerFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer-phone">Phone</Label>
                <Input
                  id="employer-phone"
                  name="phone"
                  type="tel"
                  value={employerFormData.phone}
                  onChange={handleEmployerFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer-address">Address</Label>
                <Input
                  id="employer-address"
                  name="address"
                  value={employerFormData.address}
                  onChange={handleEmployerFormChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateEmployerDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEmployerAccount} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Message Dialog */}
        <Dialog open={showSendMessageDialog} onOpenChange={setShowSendMessageDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Message to {selectedCaregiver?.name}</DialogTitle>
              <DialogDescription>Compose your message to the caregiver.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="message-content">Message*</Label>
                <Textarea
                  id="message-content"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Type your message here..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSendMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={!messageContent || isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send to Employer Dialog */}
        <Dialog open={showSendToEmployerDialog} onOpenChange={setShowSendToEmployerDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send {selectedCaregiver?.name} to Employer</DialogTitle>
              <DialogDescription>Select an employer to send this caregiver's profile to.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="select-employer">Select Employer*</Label>
                <Select value={selectedEmployerForCaregiver} onValueChange={setSelectedEmployerForCaregiver}>
                  <SelectTrigger id="select-employer">
                    <SelectValue placeholder="Choose an employer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployers.map((employer) => (
                      <SelectItem key={employer.id} value={employer.name}>
                        {employer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message-to-employer">Optional Message</Label>
                <Textarea
                  id="message-to-employer"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Add a note for the employer (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSendToEmployerDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendToEmployer} disabled={!selectedEmployerForCaregiver || isLoading}>
                {isLoading ? "Sending..." : "Send Profile"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Caregiver Details Dialog */}
        <Dialog open={showCaregiverDetails} onOpenChange={setShowCaregiverDetails}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Caregiver Profile: {selectedCaregiver?.name}</DialogTitle>
              <DialogDescription>Detailed information about the caregiver.</DialogDescription>
            </DialogHeader>
            {selectedCaregiver && (
              <div className="grid gap-6 py-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedCaregiver.profileImage} />
                      <AvatarFallback>
                        {selectedCaregiver.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <p className="font-medium">{selectedCaregiver.name}</p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Badge 
                          variant={selectedCaregiver.status === "Active" ? "default" : 
                                   selectedCaregiver.status === "Pending Verification" ? "secondary" : "destructive"}
                        >
                          {selectedCaregiver.status}
                        </Badge>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="font-medium">{selectedCaregiver.email}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="font-medium">{selectedCaregiver.phone}</p>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <p className="font-medium">{selectedCaregiver.location}</p>
                      </div>
                      <div>
                        <Label>Experience</Label>
                        <p className="font-medium">{selectedCaregiver.experience}</p>
                      </div>
                      <div>
                        <Label>Rating</Label>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{selectedCaregiver.rating}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Availability</Label>
                        <p className="font-medium">{selectedCaregiver.availability}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCaregiver.skills.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Certifications</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCaregiver.certifications.map((cert: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Languages</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCaregiver.languages.map((lang: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Bio</Label>
                      <p className="mt-2 text-sm text-gray-700">{selectedCaregiver.bio}</p>
                    </div>

                    <div>
                      <Label>Documents</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCaregiver.documents.map((doc: string, idx: number) => (
                          <Button key={idx} variant="outline" size="sm" className="gap-2">
                            <FileText className="h-4 w-4" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>References</Label>
                  <div className="mt-2 space-y-3">
                    {selectedCaregiver.references.map((ref: any, idx: number) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <p className="font-medium">{ref.name}</p>
                        <p className="text-sm text-gray-600">{ref.relation}</p>
                        <p className="text-sm text-gray-600">{ref.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCaregiverDetails(false)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowCaregiverDetails(false)
                  setShowSendMessageDialog(true)
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Employer Details Dialog */}
        <Dialog open={showEmployerDetails} onOpenChange={setShowEmployerDetails}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Employer: {selectedEmployer?.name}</DialogTitle>
              <DialogDescription>Detailed information about the employer.</DialogDescription>
            </DialogHeader>
            {selectedEmployer && (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Company Name</Label>
                      <p className="font-medium">{selectedEmployer.name}</p>
                    </div>
                    <div>
                      <Label>Contact Person</Label>
                      <p className="font-medium">{selectedEmployer.contact}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{selectedEmployer.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="font-medium">{selectedEmployer.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Address</Label>
                      <p className="font-medium">{selectedEmployer.address}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge 
                        variant={selectedEmployer.status === "Active" ? "default" : "secondary"}
                      >
                        {selectedEmployer.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Jobs Posted</Label>
                      <p className="font-medium">{selectedEmployer.jobsPosted}</p>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{selectedEmployer.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label>Preferences</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEmployer.preferences.map((pref: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <p className="mt-2 text-sm text-gray-700">{selectedEmployer.notes}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmployerDetails(false)}>
                Close
              </Button>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Contact Employer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Job Details Dialog */}
        <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
              <DialogDescription>Detailed information about the job posting.</DialogDescription>
            </DialogHeader>
            {selectedJob && (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Company</Label>
                      <p className="font-medium">{selectedJob.company}</p>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <p className="font-medium">{selectedJob.location}</p>
                    </div>
                    <div>
                      <Label>Job Type</Label>
                      <p className="font-medium">{selectedJob.type}</p>
                    </div>
                    <div>
                      <Label>Salary/Compensation</Label>
                      <p className="font-medium">{selectedJob.salary}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <Badge 
                        variant={selectedJob.status === "Open" ? "default" : "secondary"}
                      >
                        {selectedJob.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Posted Date</Label>
                      <p className="font-medium">{selectedJob.postedDate}</p>
                    </div>
                    <div>
                      <Label>Applicants</Label>
                      <p className="font-medium">{selectedJob.applicants}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label>Job Description</Label>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
                  </div>

                  <div>
                    <Label>Requirements</Label>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{selectedJob.requirements}</p>
                  </div>

                  <div>
                    <Label>Benefits</Label>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{selectedJob.benefits}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowJobDetails(false)}>
                Close
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                View Applicants
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function ActivityIcon({ action }: { action: string }) {
  if (action.includes("Posted")) return <Briefcase className="h-4 w-4" />
  if (action.includes("Verified")) return <CheckCircle className="h-4 w-4" />
  if (action.includes("Contacted")) return <Mail className="h-4 w-4" />
  return <Edit className="h-4 w-4" />
}

function MoreHorizontal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}