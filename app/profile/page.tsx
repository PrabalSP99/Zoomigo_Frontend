'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, Button, Input } from '../../components/ui';
import Header from '../../components/ui/Header';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    licenseNumber: '',
    licenseExpiry: '',
    DOB: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.name.split(' ')[0] || '',
        lastName: user.lastName || user.name.split(' ')[1] || '',
        email: user.email,
        phone: user.phone || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        licenseNumber: '',
        licenseExpiry: '',
        DOB: user.DOB || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    // TODO: Implement profile update with GraphQL
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (user) {
      setFormData({
        firstName: user.firstName || user.name.split(' ')[0] || '',
        lastName: user.lastName || user.name.split(' ')[1] || '',
        email: user.email,
        phone: user.phone || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        licenseNumber: '',
        licenseExpiry: '',
        DOB: user.DOB || '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
        <Header currentPage="profile" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
      <Header currentPage="profile" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 shadow-sm">
              <CardBody className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200"
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </CardHeader>
              <CardBody>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                      type="text"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <Input
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <Input
                    type="tel"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <Input
                    type="date"
                    label="Date of Birth"
                    value={formData.DOB}
                    onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <Input
                    type="text"
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      type="text"
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                      type="text"
                      label="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      disabled={!isEditing}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                      type="text"
                      label="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      disabled={!isEditing}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Driver&apos;s License Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        label="License Number"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        disabled={!isEditing}
                        className="focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Input
                        type="date"
                        label="License Expiry Date"
                        value={formData.licenseExpiry}
                        onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                        disabled={!isEditing}
                        className="focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-6 border-t">
                      <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="flex-1 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200">
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>

            {/* Security Settings */}
            <Card className="bg-white border-0 shadow-sm mt-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                    <div>
                      <h4 className="font-medium text-indigo-900">Change Password</h4>
                      <p className="text-sm text-indigo-700">Update your password for better security</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200">
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                    <div>
                      <h4 className="font-medium text-indigo-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-indigo-700">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200">
                      Enable
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Account Actions */}
            <Card className="bg-white border-0 shadow-sm mt-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-900">Delete Account</h4>
                      <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-100">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
