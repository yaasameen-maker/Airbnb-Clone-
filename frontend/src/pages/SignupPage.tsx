import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: UserRole.USER,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...signupData } = data;
      await signup(signupData);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create your account</CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Join us and start your adventure!
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('firstName')}
                  label="First name"
                  placeholder="John"
                  error={errors.firstName?.message}
                />

                <Input
                  {...register('lastName')}
                  label="Last name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                />
              </div>

              <Input
                {...register('email')}
                type="email"
                label="Email address"
                placeholder="you@example.com"
                error={errors.email?.message}
              />

              <div>
                <Input
                  {...register('password')}
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              <Input
                {...register('confirmPassword')}
                type="password"
                label="Confirm password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      {...register('role')}
                      type="radio"
                      value={UserRole.USER}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Guest</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('role')}
                      type="radio"
                      value={UserRole.HOST}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Host</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign up
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
