import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { addCredits } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState<{ credits: number; price: number }>({ credits: 5, price: 4.99 });
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const plans = [
    { credits: 5, price: 4.99, description: 'Starter Pack — Perfect for 5 job applications' },
    { credits: 15, price: 9.99, description: 'Pro Hunter — Best value for serious job hunters', popular: true },
    { credits: 40, price: 19.99, description: 'Unlimited Boost — Recommended for agencies' }
  ];

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
    setCvc(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvc.length < 3) {
      setError('Please enter a valid CVC.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter the cardholder name.');
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe payment gateway latency
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      addCredits(selectedPlan.credits);
      setTimeout(() => {
        setIsSuccess(false);
        setCardNumber('');
        setExpiry('');
        setCvc('');
        setName('');
        onClose();
      }, 2500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors z-10">
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
              Added <span className="text-emerald-500 font-black">+{selectedPlan.credits} credits</span> to your account.
            </p>
            <p className="text-xs text-gray-400">Your resume is ready for professional tailoring.</p>
          </div>
        ) : (
          <>
            {/* Left Side: Plan Selector */}
            <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900/40 border-r border-gray-150 dark:border-gray-700 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
                  <Sparkles className="h-3 w-3" /> Secure Credit Hub
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Choose Credit Package</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Purchase credits to tailor your resume for individual jobs with premium AI suggestions.</p>

                <div className="space-y-3">
                  {plans.map((plan) => (
                    <label
                      key={plan.credits}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan.credits === plan.credits
                          ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-900/10'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Most Popular
                        </span>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{plan.credits} AI Tailoring Credits</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{plan.description}</p>
                      </div>
                      <span className="text-lg font-black text-gray-900 dark:text-white">${plan.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Payments are simulated safely. Enter any details (use card 4242 4242...) to complete checkout. No real money will be charged.
                </p>
              </div>
            </div>

            {/* Right Side: Credit Card Details */}
            <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-md mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Card Information
                </h4>

                {error && (
                  <div className="p-3 mb-4 text-xs font-semibold bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">Card Number</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">CVC</label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="•••"
                        value={cvc}
                        onChange={handleCvcChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 transform active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Verifying with Gateway...</>
                  ) : (
                    <>Pay ${selectedPlan.price} Securely</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
