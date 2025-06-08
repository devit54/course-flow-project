
import React, { useState } from 'react';
import { coursesData } from '../../data/courses.js';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface PaymentProps {
  courseId: number;
  onNavigate: (page: string, courseId?: number) => void;
}

const Payment: React.FC<PaymentProps> = ({ courseId, onNavigate }) => {
  const course = coursesData.find(c => c.id === courseId);
  const { enrollCourse } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  });

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formatted.length <= 5) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    // Format CVV
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '');
      if (formatted.length <= 3) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Vui lòng nhập số thẻ hợp lệ');
        return false;
      }
      if (!formData.expiryDate || formData.expiryDate.length < 5) {
        toast.error('Vui lòng nhập ngày hết hạn hợp lệ');
        return false;
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        toast.error('Vui lòng nhập mã CVV hợp lệ');
        return false;
      }
      if (!formData.cardName.trim()) {
        toast.error('Vui lòng nhập tên chủ thẻ');
        return false;
      }
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('Vui lòng nhập email hợp lệ');
      return false;
    }
    
    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      enrollCourse(courseId);
      setLoading(false);
      toast.success('Thanh toán thành công! Chúc mừng bạn đã đăng ký khóa học.');
      onNavigate('course-detail', courseId);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thanh toán</CardTitle>
              <CardDescription>
                Chọn phương thức thanh toán và điền thông tin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Payment Methods */}
                <div>
                  <Label className="text-base font-medium">Phương thức thanh toán</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <span>💳</span>
                        Thẻ tín dụng / Thẻ ghi nợ
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <Label htmlFor="ewallet" className="flex items-center gap-2 cursor-pointer">
                        <span>📱</span>
                        Ví điện tử (MoMo, ZaloPay)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                        <span>🏦</span>
                        Chuyển khoản ngân hàng
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Tên chủ thẻ</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="NGUYEN VAN A"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* E-wallet Info */}
                {paymentMethod === 'ewallet' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Bạn sẽ được chuyển hướng đến ứng dụng ví điện tử để hoàn tất thanh toán.
                    </p>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {paymentMethod === 'bank' && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">Thông tin chuyển khoản:</p>
                    <div className="text-sm space-y-1">
                      <p><strong>Ngân hàng:</strong> Vietcombank</p>
                      <p><strong>Số tài khoản:</strong> 1234567890</p>
                      <p><strong>Chủ tài khoản:</strong> CÔNG TY E-LEARNING</p>
                      <p><strong>Nội dung:</strong> Thanh toan khoa hoc {courseId}</p>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gradient"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Đang xử lý...' : `Thanh toán ${formatPrice(course.price)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{course.description}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Giảng viên:</span>
                  <span>{course.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời lượng:</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số bài học:</span>
                  <span>{course.lessons.length} bài</span>
                </div>
                <div className="flex justify-between">
                  <span>Cấp độ:</span>
                  <span>{course.level}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-elearning-primary">{formatPrice(course.price)}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>✓ Truy cập trọn đời</p>
                <p>✓ Chứng chỉ hoàn thành</p>
                <p>✓ Hỗ trợ 24/7</p>
                <p>✓ Hoàn tiền trong 30 ngày</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
