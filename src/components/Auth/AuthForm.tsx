
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast.success('Đăng nhập thành công!');
          onSuccess();
        } else {
          toast.error('Email hoặc mật khẩu không đúng!');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Mật khẩu xác nhận không khớp!');
          return;
        }
        
        if (formData.password.length < 6) {
          toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
          return;
        }

        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } else {
          toast.error('Email đã tồn tại!');
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            {isLogin ? 'Chào mừng bạn quay lại!' : 'Tạo tài khoản mới để bắt đầu học'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Nhập họ và tên"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-12 text-base border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 text-base border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 text-base border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-12 text-base border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white mt-6"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button
                type="button"
                className="ml-2 text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
          
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                onClick={() => toast.info('Chức năng quên mật khẩu sẽ được cập nhật sớm!')}
              >
                Quên mật khẩu?
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
