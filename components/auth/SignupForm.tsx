'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Next.js App Router
import { Button, Input, Card, CardHeader, CardBody } from '../ui';
import { CREATE_USER } from '../../lib/graphql';
import { useMutation } from '@apollo/client';
import { STRINGS } from '../../constants/StringConstant';
import { toast } from 'react-toastify';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
    const router = useRouter(); 
  const [createUser, { loading: mutationLoading }] = useMutation(CREATE_USER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = STRINGS.VALIDATION.REQUIRED;
    }

    if (!formData.email) {
      newErrors.email = STRINGS.VALIDATION.REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = STRINGS.VALIDATION.INVALID_EMAIL;
    }

    if (!formData.phone) {
      newErrors.phone = STRINGS.VALIDATION.REQUIRED;
    }

    if (!formData.password) {
      newErrors.password = STRINGS.VALIDATION.REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = STRINGS.VALIDATION.PASSWORD_MIN_LENGTH;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = STRINGS.VALIDATION.REQUIRED;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = STRINGS.VALIDATION.PASSWORDS_DONT_MATCH;
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
      const { data } = await createUser({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          },
        },
      });
      
      if (data?.createUser) {
        // Show success message first
        setShowSuccess(true);
        setErrors({});
        toast.success(`Welcome to BadhoSa, ${formData.name}! 🎉`);
        
        // After 2 seconds, redirect to login page
        setTimeout(() => {
          router.replace('/auth');
          onSwitchToLogin();
        }, 2000);
      } else {
        toast.error(STRINGS.VALIDATION.SIGNUP_FAILED);
        setErrors({ general: STRINGS.VALIDATION.SIGNUP_FAILED });
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{STRINGS.AUTH.CREATE_ACCOUNT}</h2>
        <p className="text-gray-600">{STRINGS.AUTH.JOIN_TRAVELERS}</p>
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}
          
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {STRINGS.VALIDATION.SIGNUP_SUCCESS}
            </div>
          )}
          
          <Input
            type="text"
            label={STRINGS.AUTH.NAME}
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            errorMessage={errors.name}
            required
          />
          
          <Input
            type="email"
            label={STRINGS.AUTH.EMAIL}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            errorMessage={errors.email}
            required
          />
          
          <Input
            type="tel"
            label={STRINGS.AUTH.PHONE}
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={!!errors.phone}
            errorMessage={errors.phone}
            required
          />
          
          {/* Password Field with Eye Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {STRINGS.AUTH.PASSWORD}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
          
          {/* Confirm Password Field with Eye Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {STRINGS.AUTH.CONFIRM_PASSWORD}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-indigo-900 rounded focus:ring-indigo-500"
              required
            />
            <span className="ml-2 text-sm text-gray-600">
              {STRINGS.AUTH.TERMS_AGREEMENT}{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                {STRINGS.AUTH.TERMS_OF_SERVICE}
              </a>{' '}
              {STRINGS.AUTH.AND}{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                {STRINGS.AUTH.PRIVACY_POLICY}
              </a>
            </span>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || mutationLoading || showSuccess}
            className="w-full bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isLoading || mutationLoading ? STRINGS.AUTH.CREATING_ACCOUNT : "Let's GO!!"}
          </button>
          
          <div className="text-center">
            <span className="text-gray-600">{STRINGS.AUTH.ALREADY_HAVE_ACCOUNT} </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {STRINGS.AUTH.SIGN_IN_LINK}
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
