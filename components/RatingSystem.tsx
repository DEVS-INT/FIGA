'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, MessageSquare, ThumbsUp } from 'lucide-react'

interface RatingSystemProps {
  type: 'employer-rating-employee' | 'employee-rating-company' | 'display-ratings'
  targetName?: string
  targetImage?: string
  onSubmitRating?: (rating: number, comment: string) => void
  existingRatings?: Array<{
    id: string
    raterName: string
    raterImage?: string
    rating: number
    comment: string
    date: string
    helpful?: number
  }>
  rating?: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export const RatingSystem = ({ 
  type, 
  targetName, 
  targetImage, 
  onSubmitRating,
  existingRatings = [],
  rating: initialRating = 0,
  maxRating = 5,
  size = 'md',
  showNumber = true,
  className = ''
}: RatingSystemProps) => {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    if (onSubmitRating) {
      onSubmitRating(rating, comment)
    }
    
    setRating(0)
    setComment('')
    setIsSubmitting(false)
  }

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className="flex">
          {[...Array(maxRating)].map((_, index) => (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                index < currentRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        {showNumber && (
          <span className="text-sm text-gray-600 ml-2">
            {currentRating.toFixed(1)}
          </span>
        )}
      </div>
    )
  }

  if (type === 'display-ratings') {
    return (
      <Card className="bg-white border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {existingRatings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No ratings yet</p>
            </div>
          ) : (
            existingRatings.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.raterImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {review.raterName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{review.raterName}</p>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    {review.helpful && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful} found this helpful</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-blue-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {type === 'employer-rating-employee' ? 'Rate Employee Performance' : 'Rate Company Experience'}
        </CardTitle>
        {targetName && (
          <div className="flex items-center space-x-3 mt-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={targetImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {targetName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{targetName}</p>
              <p className="text-sm text-gray-600">
                {type === 'employer-rating-employee' ? 'Professional' : 'Company'}
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating
          </label>
          {renderStars(rating, true)}
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Share your experience
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              type === 'employer-rating-employee'
                ? "Describe the employee's performance, reliability, and professionalism..."
                : "Share your experience working with this company..."
            }
            className="focus:border-blue-500 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" className="border-gray-300 text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Submit Rating
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
