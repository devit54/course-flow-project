
import React, { useState } from 'react';
import { coursesData } from '../../data/courses.js';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CourseDetailProps {
  courseId: number;
  onNavigate: (page: string, courseId?: number, lessonId?: number) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onNavigate }) => {
  const course = coursesData.find(c => c.id === courseId);
  const { user, isEnrolled, enrollCourse, getProgress, isLessonCompleted } = useAuth();
  const [reviews] = useState([
    { id: 1, name: 'Nguyễn Văn A', rating: 5, comment: 'Khóa học rất hữu ích và dễ hiểu!', date: '2024-01-15' },
    { id: 2, name: 'Trần Thị B', rating: 4, comment: 'Nội dung chi tiết, giảng viên giải thích rõ ràng.', date: '2024-01-10' },
    { id: 3, name: 'Lê Văn C', rating: 5, comment: 'Tuyệt vời! Đáng đồng tiền bát gạo.', date: '2024-01-05' }
  ]);

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy khóa học</p>
        <Button onClick={() => onNavigate('courses')} className="mt-4">
          Quay lại danh sách khóa học
        </Button>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const progress = enrolled ? getProgress(course.id) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleEnroll = () => {
    if (enrolled) {
      // Navigate to first incomplete lesson
      const firstIncompleteLesson = course.lessons.find(lesson => 
        !isLessonCompleted(course.id, lesson.id)
      );
      if (firstIncompleteLesson) {
        onNavigate('lesson', course.id, firstIncompleteLesson.id);
      }
    } else {
      onNavigate('payment', course.id);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-2 mb-3">
            <Badge>{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{course.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Giảng viên: <strong>{course.instructor}</strong></span>
            <span>Thời lượng: <strong>{course.duration}</strong></span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span><strong>{course.rating}</strong></span>
              <span className="text-gray-400">({course.reviews} đánh giá)</span>
            </div>
          </div>
        </div>
        
        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="text-center">
                <div className="text-3xl font-bold text-elearning-primary mb-2">
                  {formatPrice(course.price)}
                </div>
                {enrolled && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tiến độ hoàn thành</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleEnroll}
                className="w-full btn-gradient mb-4"
                size="lg"
              >
                {enrolled ? (progress === 0 ? 'Bắt đầu học' : 'Tiếp tục học') : 'Đăng ký khóa học'}
              </Button>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Số bài học:</span>
                  <span>{course.lessons.length} bài</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời lượng:</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cấp độ:</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chứng chỉ:</span>
                  <span>Có</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content */}
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="curriculum">Chương trình học</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({course.reviews})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung khóa học</CardTitle>
              <CardDescription>
                {course.lessons.length} bài học • {course.duration}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => {
                  const completed = enrolled && isLessonCompleted(course.id, lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {completed ? '✓' : index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                      {enrolled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNavigate('lesson', course.id, lesson.id)}
                        >
                          {completed ? 'Xem lại' : 'Học ngay'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá từ học viên</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(Math.round(course.rating))}
                </div>
                <span className="text-lg font-medium">{course.rating}</span>
                <span className="text-gray-500">({course.reviews} đánh giá)</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-elearning-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {review.name.charAt(0)}
                        </div>
                        <span className="font-medium">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetail;
