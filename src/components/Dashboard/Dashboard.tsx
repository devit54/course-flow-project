
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { coursesData } from '../../data/courses.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DashboardProps {
  onNavigate: (page: string, courseId?: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, getProgress } = useAuth();

  const enrolledCourses = coursesData.filter(course => 
    user?.enrolledCourses?.includes(course.id)
  );

  const stats = {
    totalCourses: enrolledCourses.length,
    completedCourses: enrolledCourses.filter(course => getProgress(course.id) === 100).length,
    inProgress: enrolledCourses.filter(course => {
      const progress = getProgress(course.id);
      return progress > 0 && progress < 100;
    }).length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Chào mừng trở lại, {user?.name}!
          </h1>
          <p className="text-gray-600">Tiếp tục hành trình học tập của bạn</p>
        </div>
        <Button 
          onClick={() => onNavigate('courses')}
          className="btn-gradient"
        >
          Khám phá khóa học
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-elearning-primary">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-elearning-warning">{stats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-elearning-success">{stats.completedCourses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Khóa học của tôi</h2>
        {enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào</p>
              <Button 
                onClick={() => onNavigate('courses')}
                className="btn-gradient"
              >
                Khám phá khóa học ngay
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const progress = getProgress(course.id);
              return (
                <Card key={course.id} className="card-hover">
                  <CardHeader>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tiến độ</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <Button
                        onClick={() => onNavigate('course-detail', course.id)}
                        className="w-full"
                        variant={progress === 0 ? "default" : "outline"}
                      >
                        {progress === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
