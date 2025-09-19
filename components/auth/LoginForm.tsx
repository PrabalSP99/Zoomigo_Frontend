'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card, CardHeader, CardBody } from '../ui';
import { LOGIN_USER } from '../../lib/graphql';
import { useMutation } from '@apollo/client';
import { STRINGS } from '../../constants/StringConstant';
import { toast } from 'react-toastify';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const { login } = useAuth();
  const [loginUser, { loading: mutationLoading }] = useMutation(LOGIN_USER);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = STRINGS.VALIDATION.REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = STRINGS.VALIDATION.INVALID_EMAIL;
    }

    if (!formData.password) {
      newErrors.password = STRINGS.VALIDATION.REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = STRINGS.VALIDATION.PASSWORD_MIN_LENGTH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data } = await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });
      
      if (data?.loginUser) {
        const { user, token } = data.loginUser;
        login(user, token);
        toast.success(`Welcome back, ${user.name}! 🚗`);
        onSuccess();
      } else {
        toast.error(STRINGS.VALIDATION.LOGIN_FAILED);
        setErrors({ general: STRINGS.VALIDATION.LOGIN_FAILED });
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : STRINGS.VALIDATION.GENERAL_ERROR;
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-white border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{STRINGS.AUTH.WELCOME_BACK}</h2>
        <p className="text-gray-600">{STRINGS.AUTH.SIGN_IN_TO_ACCOUNT}</p>
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {STRINGS.AUTH.EMAIL}
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          
          {/* Password Field with Eye Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {STRINGS.AUTH.PASSWORD}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 8.178a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-8.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-900 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">{STRINGS.AUTH.REMEMBER_ME}</span>
            </label>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {STRINGS.AUTH.FORGOT_PASSWORD}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || mutationLoading}
            className="w-full bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isLoading || mutationLoading ? STRINGS.AUTH.SIGNING_IN : "Hit the Road!!"}
          </button>
          
          <div className="text-center">
            <span className="text-gray-600">{STRINGS.AUTH.DONT_HAVE_ACCOUNT} </span>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {STRINGS.AUTH.SIGN_UP_LINK}
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
