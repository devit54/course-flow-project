
import React, { useState, useEffect } from 'react';
import { coursesData } from '../../data/courses.js';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface LessonViewerProps {
  courseId: number;
  lessonId: number;
  onNavigate: (page: string, courseId?: number, lessonId?: number) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ courseId, lessonId, onNavigate }) => {
  const course = coursesData.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);
  const { completeLesson, isLessonCompleted, getProgress } = useAuth();
  
  const [videoProgress, setVideoProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (course && lesson) {
      setIsCompleted(isLessonCompleted(courseId, lessonId));
    }
  }, [course, lesson, courseId, lessonId, isLessonCompleted]);

  if (!course || !lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy bài học</p>
        <Button onClick={() => onNavigate('course-detail', courseId)} className="mt-4">
          Quay lại khóa học
        </Button>
      </div>
    );
  }

  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = course.lessons[currentLessonIndex + 1];
  const prevLesson = course.lessons[currentLessonIndex - 1];
  const courseProgress = getProgress(courseId);

  const handleMarkComplete = () => {
    completeLesson(courseId, lessonId);
    setIsCompleted(true);
    toast.success('Đã đánh dấu bài học hoàn thành!');
  };

  const handleQuiz = () => {
    onNavigate('quiz', courseId, lessonId);
  };

  // Simulate video progress
  const handleVideoProgress = () => {
    if (videoProgress < 100) {
      setVideoProgress(prev => Math.min(prev + 10, 100));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                  <p className="text-gray-600 mt-1">Thời lượng: {lesson.duration}</p>
                </div>
                <div className="flex gap-2">
                  {isCompleted && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Hoàn thành
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Video Player Simulation */}
              <div className="aspect-video bg-black rounded-lg mb-6 relative overflow-hidden">
                <img
                  src={course.image}
                  alt={lesson.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={handleVideoProgress}
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full w-16 h-16"
                    disabled={videoProgress === 100}
                  >
                    {videoProgress === 100 ? '✓' : '▶'}
                  </Button>
                </div>
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <button className="hover:text-gray-300">⏪</button>
                      <button 
                        onClick={handleVideoProgress}
                        className="hover:text-gray-300"
                      >
                        {videoProgress === 100 ? '⏸' : '▶'}
                      </button>
                      <button className="hover:text-gray-300">⏩</button>
                      <select className="bg-transparent border border-white/30 rounded px-2 py-1 text-sm">
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>
                    </div>
                    <div className="text-sm">
                      {Math.round(videoProgress)}% / 100%
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-white/30 rounded-full h-1">
                      <div
                        className="bg-white h-1 rounded-full transition-all"
                        style={{ width: `${videoProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Nội dung bài học</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Trong bài học này, chúng ta sẽ tìm hiểu về <strong>{lesson.title}</strong>. 
                      Đây là một phần quan trọng trong khóa học <strong>{course.title}</strong>.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Bạn sẽ học được các kiến thức cơ bản và nâng cao, cùng với những ví dụ thực tế 
                      giúp bạn hiểu rõ hơn về chủ đề này. Hãy chắc chắn rằng bạn đã xem hết video 
                      và hoàn thành các bài tập để đạt hiệu quả học tập tốt nhất.
                    </p>
                  </div>
                </div>

                {/* Downloads */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Tài liệu bổ sung</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">📄</span>
                        <span>Slide bài giảng - {lesson.title}.pdf</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Tải xuống
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">📝</span>
                        <span>Bài tập thực hành - {lesson.title}.docx</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  {!isCompleted && (
                    <Button 
                      onClick={handleMarkComplete}
                      className="btn-gradient"
                    >
                      Đánh dấu hoàn thành
                    </Button>
                  )}
                  <Button 
                    onClick={handleQuiz}
                    variant="outline"
                  >
                    Làm bài kiểm tra
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Nội dung khóa học</CardTitle>
              <div className="text-sm text-gray-600">
                {courseProgress}% hoàn thành
              </div>
              <Progress value={courseProgress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.lessons.map((l, index) => {
                  const completed = isLessonCompleted(courseId, l.id);
                  const current = l.id === lessonId;
                  
                  return (
                    <div
                      key={l.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        current 
                          ? 'bg-elearning-primary text-white' 
                          : completed 
                            ? 'bg-green-50 hover:bg-green-100' 
                            : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onNavigate('lesson', courseId, l.id)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        current
                          ? 'bg-white text-elearning-primary'
                          : completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                      }`}>
                        {completed ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${current ? 'text-white' : ''}`}>
                          {l.title}
                        </p>
                        <p className={`text-xs ${current ? 'text-white/80' : 'text-gray-500'}`}>
                          {l.duration}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Navigation */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                {prevLesson && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('lesson', courseId, prevLesson.id)}
                    className="flex-1"
                  >
                    ← Trước
                  </Button>
                )}
                {nextLesson && (
                  <Button
                    size="sm"
                    onClick={() => onNavigate('lesson', courseId, nextLesson.id)}
                    className="flex-1"
                  >
                    Tiếp →
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
