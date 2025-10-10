'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Badge,
  Modal
} from '../ui';
import { CREATE_PAYMENT } from '../../lib/graphql';

interface PaymentFormProps {
  bookingId: string;
  bookingData: {
    vehicle: {
      id: string;
      brand: string;
      model: string;
      year: number;
      type: string;
    };
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    pickupLocation: string;
    dropoffLocation: string;
    totalAmount: number;
    duration: number;
  };
  onPaymentSuccess: (paymentData: PaymentData) => void;
  onPaymentCancel: () => void;
}

interface PaymentData {
  id: string;
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'CASH';
  amount: number;
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'CASH';

export default function PaymentForm({ bookingId, bookingData, onPaymentSuccess, onPaymentCancel }: PaymentFormProps) {
  const router = useRouter();
  const [createPayment, { loading: paymentLoading, error: paymentError }] = useMutation(CREATE_PAYMENT);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [paymentData, setPaymentData] = useState({
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    bankName: '',
    walletType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const paymentMethods = [
    {
      id: 'UPI' as PaymentMethod,
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI ID or QR Code',
      popular: true
    },
    {
      id: 'CREDIT_CARD' as PaymentMethod,
      name: 'Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay',
      popular: true
    },
    {
      id: 'DEBIT_CARD' as PaymentMethod,
      name: 'Debit Card',
      icon: '💳',
      description: 'Debit card payment',
      popular: true
    },
    {
      id: 'NET_BANKING' as PaymentMethod,
      name: 'Net Banking',
      icon: '🏦',
      description: 'Direct bank transfer',
      popular: false
    },
    {
      id: 'CASH' as PaymentMethod,
      name: 'Cash Payment',
      icon: '💰',
      description: 'Pay in cash on pickup',
      popular: false
    }
  ];

  const validatePaymentData = () => {
    const newErrors: Record<string, string> = {};

    switch (selectedMethod) {
      case 'UPI':
        if (!paymentData.upiId) {
          newErrors.upiId = 'UPI ID is required';
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(paymentData.upiId)) {
          newErrors.upiId = 'Please enter a valid UPI ID';
        }
        break;
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        if (!paymentData.cardNumber) {
          newErrors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
          newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        if (!paymentData.cardExpiry) {
          newErrors.cardExpiry = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.cardExpiry)) {
          newErrors.cardExpiry = 'Please enter expiry in MM/YY format';
        }
        if (!paymentData.cardCvv) {
          newErrors.cardCvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(paymentData.cardCvv)) {
          newErrors.cardCvv = 'Please enter a valid CVV';
        }
        if (!paymentData.cardName) {
          newErrors.cardName = 'Cardholder name is required';
        }
        break;
      case 'NET_BANKING':
        if (!paymentData.bankName) {
          newErrors.bankName = 'Please select a bank';
        }
        break;
      case 'CASH':
        // No validation needed for cash payments
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async () => {
    if (!validatePaymentData()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Generate a mock transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Prepare payment metadata based on selected method
      const metadata: Record<string, string> = {};
      switch (selectedMethod) {
        case 'UPI':
          metadata.upiId = paymentData.upiId;
          break;
        case 'CREDIT_CARD':
        case 'DEBIT_CARD':
          metadata.cardNumber = paymentData.cardNumber.replace(/\s/g, '');
          metadata.cardExpiry = paymentData.cardExpiry;
          metadata.cardName = paymentData.cardName;
          break;
        case 'NET_BANKING':
          metadata.bankName = paymentData.bankName;
          break;
        case 'CASH':
          metadata.paymentType = 'cash_on_pickup';
          break;
      }

      // Get authentication token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('Authentication required');
      }

      // Call the backend to create payment
      const { data } = await createPayment({
        variables: {
          input: {
            bookingId,
            amount: bookingData.totalAmount,
            method: selectedMethod,
            transactionId,
            metadata
          }
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          }
        }
      });

      const paymentResult: PaymentData = {
        id: data.createPayment.id,
        method: selectedMethod,
        amount: bookingData.totalAmount,
        transactionId,
        status: 'SUCCESS'
      };

      setShowSuccessModal(true);
      onPaymentSuccess(paymentResult);
    } catch (err) {
      console.error('Payment failed:', err);
      if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Payment failed. Please try again.' });
      }
    } finally {
      setIsProcessing(false);
    }

  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank'
  ];


  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
              <p className="text-gray-600">Secure payment for your booking</p>
            </div>
            <Badge variant="success" className="bg-green-100 text-green-800">
              ₹{bookingData.totalAmount}
            </Badge>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Vehicle:</span>
                <p className="font-medium">{bookingData.vehicle.brand} {bookingData.vehicle.model}</p>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <p className="font-medium">{bookingData.duration} day{bookingData.duration !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <span className="text-gray-500">Pickup:</span>
                <p className="font-medium">{bookingData.startDate} at {bookingData.startTime}</p>
              </div>
              <div>
                <span className="text-gray-500">Return:</span>
                <p className="font-medium">{bookingData.endDate} at {bookingData.endTime}</p>
              </div>
            </div>
            <div className="border-t mt-3 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-green-600">₹{bookingData.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {(errors.general || paymentError) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">
                {errors.general || paymentError?.message || 'Payment failed. Please try again.'}
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                      {method.popular && (
                        <Badge variant="primary" className="text-xs mt-1">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Form Fields */}
          <div className="space-y-4">
            {selectedMethod === 'UPI' && (
              <div>
                <Input
                  type="text"
                  label="UPI ID"
                  placeholder="yourname@upi"
                  value={paymentData.upiId}
                  onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                  error={!!errors.upiId}
                  errorMessage={errors.upiId}
                  required
                />
                <div className="mt-2 text-sm text-gray-500">
                  Popular UPI apps: PhonePe, Google Pay, Paytm, BHIM
                </div>
              </div>
            )}

            {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
              <div className="space-y-4">
                <Input
                  type="text"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    cardNumber: formatCardNumber(e.target.value)
                  })}
                  error={!!errors.cardNumber}
                  errorMessage={errors.cardNumber}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={paymentData.cardExpiry}
                    onChange={(e) => setPaymentData({ ...paymentData, cardExpiry: e.target.value })}
                    error={!!errors.cardExpiry}
                    errorMessage={errors.cardExpiry}
                    required
                  />
                  <Input
                    type="text"
                    label="CVV"
                    placeholder="123"
                    value={paymentData.cardCvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cardCvv: e.target.value })}
                    error={!!errors.cardCvv}
                    errorMessage={errors.cardCvv}
                    required
                  />
                </div>
                <Input
                  type="text"
                  label="Cardholder Name"
                  placeholder="John Doe"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  error={!!errors.cardName}
                  errorMessage={errors.cardName}
                  required
                />
              </div>
            )}

            {selectedMethod === 'NET_BANKING' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank
                </label>
                <select
                  value={paymentData.bankName}
                  onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose your bank</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                )}
              </div>
            )}

            {selectedMethod === 'CASH' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">Cash Payment</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      You will pay ₹{bookingData.totalAmount} in cash when you pick up the vehicle. Please bring exact change.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                </p>
              </div>
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex gap-3 w-full">
            <Button
              onClick={handlePaymentSubmit}
              size="lg"
              fullWidth
              disabled={isProcessing || paymentLoading}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
            >
              {(isProcessing || paymentLoading) ? 'Processing Payment...' : `Pay ₹${bookingData.totalAmount}`}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onPaymentCancel}
              fullWidth
              disabled={isProcessing || paymentLoading}
            >
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Payment Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Payment Successful!"
        size="md"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Completed Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono">TXN{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-semibold">₹{bookingData.totalAmount}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/bookings')}
              fullWidth
              className="bg-green-600 hover:bg-green-700"
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              fullWidth
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
