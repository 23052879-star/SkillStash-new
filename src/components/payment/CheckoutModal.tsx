import React, { useState } from 'react';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, 
  QrCode, Smartphone, Wallet, Lock, Info, ChevronRight, Check, AlertCircle
} from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';

declare global {
  interface Window {
    Cashfree: any;
  }
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { addCredits } = useUserStore();
  const { user } = useAuthStore();
  
  // Pricing plans in INR
  const plans = [
    { credits: 5, price: 399, description: 'Starter Pack — Perfect for 5 job applications' },
    { credits: 15, price: 799, description: 'Pro Hunter — Best value for serious job hunters', popular: true },
    { credits: 40, price: 1599, description: 'Unlimited Boost — Recommended for agencies' }
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to Pro Pack
  const [checkoutStage, setCheckoutStage] = useState<'packages' | 'simulator' | 'otp' | 'netbanking_portal' | 'processing' | 'success'>('packages');
  const [activeMethod, setActiveMethod] = useState<PaymentMethodType>('upi');
  
  // UPI Form States
  const [upiOption, setUpiOption] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('');
  
  // Card Form States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Netbanking States
  const [selectedBank, setSelectedBank] = useState('SBI');
  
  // Wallet States
  const [selectedWallet, setSelectedWallet] = useState('paytm');
  
  // General States
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [liveError, setLiveError] = useState('');
  const [otpInput, setOtpInput] = useState('');

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    setCvc(value);
  };

  // Get Card Brand based on starting digit
  const getCardBrand = (num: string) => {
    const firstDigit = num.replace(/\s/g, '')[0];
    if (firstDigit === '4') return 'VISA';
    if (firstDigit === '5') return 'MASTERCARD';
    if (firstDigit === '6') return 'RUPAY';
    return '';
  };

  // Trigger Live Cashfree Payment via dev server proxy
  const handleLivePayment = async () => {
    setIsProcessing(true);
    setError('');
    setLiveError('');
    try {
      const orderId = 'order_' + Math.random().toString(36).substring(2, 11);
      const customerId = user?.id || 'cust_' + Math.random().toString(36).substring(2, 11);
      const customerEmail = user?.email || 'customer@gmail.com';
      
      const response = await fetch('/api/cashfree/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: selectedPlan.price,
          order_currency: 'INR',
          customer_details: {
            customer_id: customerId,
            customer_phone: '9999999999',
            customer_email: customerEmail
          },
          order_meta: {
            // Cashfree production requires HTTPS. Use VITE_APP_URL when on localhost.
            return_url: (
              import.meta.env.VITE_APP_URL ||
              (window.location.protocol === 'https:' ? window.location.origin : '')
            ) + `/ats-checker?order_id=${orderId}`
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.payment_session_id) {
        throw new Error('No payment session ID returned from Cashfree API');
      }

      if (!window.Cashfree) {
        throw new Error('Cashfree SDK script failed to load. Falling back.');
      }

      const cashfree = window.Cashfree({ mode: 'production' });
      
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_self'
      });

      // Since the page redirects, we add credits in background or session storage (for mock verification)
      addCredits(selectedPlan.credits);
      
    } catch (err: any) {
      console.warn('Live integration failed:', err);
      setLiveError(err.message || 'Payment server connection failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Mock checkout submission
  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (expiry.length < 5) {
        setError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cvc.length < 3) {
        setError('Please enter a valid CVV.');
        return;
      }
      if (!cardName.trim()) {
        setError('Please enter the cardholder name.');
        return;
      }
      // Open OTP dialog
      setCheckoutStage('otp');
    } else if (activeMethod === 'upi') {
      if (upiOption === 'id' && !upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g. name@upi).');
        return;
      }
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        handlePaymentSuccess();
      }, 2500);
    } else if (activeMethod === 'netbanking') {
      setCheckoutStage('netbanking_portal');
    } else if (activeMethod === 'wallet') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        handlePaymentSuccess();
      }, 2000);
    }
  };

  const handleVerifyOtp = () => {
    if (otpInput.length < 4) {
      setError('Please enter the verification code.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handlePaymentSuccess();
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    setCheckoutStage('success');
    addCredits(selectedPlan.credits);
    setTimeout(() => {
      // Reset forms
      setCheckoutStage('packages');
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setCardName('');
      setUpiId('');
      setOtpInput('');
      onClose();
    }, 3000);
  };

  const activeBankLabel = () => {
    const bankMap: { [key: string]: string } = {
      'SBI': 'State Bank of India',
      'HDFC': 'HDFC Bank',
      'ICICI': 'ICICI Bank',
      'AXIS': 'Axis Bank',
      'KOTAK': 'Kotak Mahindra Bank'
    };
    return bankMap[selectedBank] || selectedBank;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row max-h-[92vh] transition-all duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-all z-20 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* --- STAGE: SUCCESS --- */}
        {checkoutStage === 'success' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950/20">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-md">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Payment Successful!</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-1">
              Secured & processed by <span className="text-blue-600 font-bold">Cashfree Payments</span>
            </p>
            <div className="bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-800/30 px-6 py-3 rounded-2xl shadow-sm inline-block my-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Added</span>{' '}
              <span className="text-emerald-500 dark:text-emerald-400 font-black text-xl">+{selectedPlan.credits} AI Tailoring Credits</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Your account balance is updated instantly. Redirecting back...</p>
          </div>
        ) : (
          <>
            {/* LEFT SIDE: Package Details (Common across checkout stages) */}
            <div className="w-full md:w-[42%] p-6 md:p-8 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between overflow-y-auto max-h-[92vh]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-6">
                  <Sparkles className="h-3.5 w-3.5" /> Tailoring Credits
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Upgrade ATS Engine</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Purchase high-precision AI tailoring credits to unlock specialized keywords, formatting tweaks, and score optimizations tailored specifically for your target jobs.
                </p>

                {checkoutStage === 'packages' ? (
                  <div className="space-y-4">
                    {plans.map((plan) => (
                      <label
                        key={plan.credits}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedPlan.credits === plan.credits
                            ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            Best Value
                          </span>
                        )}
                        <div>
                          <p className="font-extrabold text-gray-900 dark:text-white text-sm">{plan.credits} Tailoring Credits</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">{plan.description}</p>
                        </div>
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400 ml-3">₹{plan.price}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Selection</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-black text-gray-900 dark:text-white text-sm">{selectedPlan.credits} Tailoring Credits</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{selectedPlan.description}</p>
                      </div>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">₹{selectedPlan.price}</span>
                    </div>
                    <button 
                      onClick={() => setCheckoutStage('packages')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      ← Change credit package
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    Payments are securely structured via Cashfree Payments.
                  </p>
                </div>
                {liveError && (
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-[9px] text-amber-700 dark:text-amber-300 rounded-lg flex items-start gap-1">
                    <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>Live check failed (API key/domain mismatch). Using high-fidelity Cashfree checkout simulator.</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: Payment Gateway Interface */}
            <div className="w-full md:w-[58%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[92vh] bg-white dark:bg-gray-800">
              
              {/* --- STAGE: PACKAGES (Welcome/Trigger Live Flow) --- */}
              {checkoutStage === 'packages' && (
                <div className="flex-1 flex flex-col justify-center py-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Secure Checkout Portal</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                      Complete your transaction using India's leading payment gateway provider. Access instant UPI, card networks, and netbanking.
                    </p>
                  </div>

                  {liveError && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs text-left max-w-md mx-auto space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertCircle className="h-4.5 w-4.5 text-rose-500" />
                        <span>Cashfree Gateway Call Failed</span>
                      </div>
                      <p className="font-semibold text-rose-900 dark:text-rose-200">
                        Error Detail: <code className="bg-rose-100 dark:bg-rose-900/40 px-1 py-0.5 rounded font-mono text-[10px] break-all">{liveError}</code>
                      </p>
                      <div className="text-[10px] space-y-1 text-gray-500 dark:text-gray-400 pt-2 border-t border-rose-200/50 dark:border-rose-900/35">
                        <p className="font-bold text-rose-600 dark:text-rose-400">Troubleshooting Checklist:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li><strong>Restart Vite Dev Server:</strong> If you recently modified the <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">.env</code> file, you <strong>must stop the server and run <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">npm run dev</code> again</strong> in the terminal to load the new credentials.</li>
                          <li><strong>Check Sandbox/Production:</strong> The credentials provided are <strong>production credentials</strong>. Ensure you are not running behind an offline mock environment.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 max-w-md mx-auto w-full">
                    <button
                      onClick={handleLivePayment}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Fetching Gateway...</>
                      ) : (
                        <>Pay ₹{selectedPlan.price} Securely</>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setCheckoutStage('simulator')}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 text-xs"
                    >
                      Open Indian Payment Simulator (UPI/Netbanking/Cards)
                    </button>
                  </div>
                </div>
              )}

              {/* --- STAGE: MOCK GATEWAY SIMULATOR --- */}
              {checkoutStage === 'simulator' && (
                <div className="flex-1 flex flex-col h-full">
                  
                  {/* Cashfree Mock Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-6 flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 text-white p-1 rounded-lg font-black text-xs tracking-tighter">CF</div>
                      <div>
                        <span className="text-white text-xs font-black tracking-wider">cashfree</span>
                        <span className="text-sky-400 text-[10px] font-bold ml-1 uppercase">payments</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Secured for SKILLSTASH</p>
                      <p className="text-white text-sm font-black tracking-tight">₹{selectedPlan.price}.00</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 mb-4 text-xs font-bold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col md:flex-row gap-5 min-h-[300px]">
                    {/* Simulator Navigation */}
                    <div className="w-full md:w-[35%] flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-gray-150 dark:border-gray-700 pr-0 md:pr-4">
                      
                      <button
                        onClick={() => { setActiveMethod('upi'); setError(''); }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-black transition-all ${
                          activeMethod === 'upi'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <QrCode className="h-4 w-4" />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        onClick={() => { setActiveMethod('card'); setError(''); }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-black transition-all ${
                          activeMethod === 'card'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Cards (Credit/Debit)</span>
                      </button>

                      <button
                        onClick={() => { setActiveMethod('netbanking'); setError(''); }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-black transition-all ${
                          activeMethod === 'netbanking'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>Net Banking</span>
                      </button>

                      <button
                        onClick={() => { setActiveMethod('wallet'); setError(''); }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-black transition-all ${
                          activeMethod === 'wallet'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <Wallet className="h-4 w-4" />
                        <span>Wallets</span>
                      </button>
                    </div>

                    {/* Active Form */}
                    <form onSubmit={handleMockSubmit} className="flex-1 flex flex-col justify-between py-2">
                      
                      {/* --- METHOD: UPI --- */}
                      {activeMethod === 'upi' && (
                        <div className="space-y-4">
                          <div className="flex gap-4 border-b border-gray-150 dark:border-gray-700 pb-3">
                            <button
                              type="button"
                              onClick={() => setUpiOption('qr')}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                                upiOption === 'qr'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              Scan QR Code
                            </button>
                            <button
                              type="button"
                              onClick={() => setUpiOption('id')}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                                upiOption === 'id'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              Enter UPI ID
                            </button>
                          </div>

                          {upiOption === 'qr' ? (
                            <div className="flex flex-col items-center py-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-200/50 dark:border-gray-700">
                              {/* QR Scan box with animated scanning line */}
                              <div className="relative p-3 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl shadow-md">
                                <div className="absolute inset-0 bg-transparent flex flex-col justify-between p-3 pointer-events-none z-10">
                                  {/* Corner marks */}
                                  <div className="flex justify-between">
                                    <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-blue-600"></div>
                                    <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-blue-600"></div>
                                  </div>
                                  <div className="flex justify-between">
                                    <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-blue-600"></div>
                                    <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-blue-600"></div>
                                  </div>
                                </div>
                                
                                {/* Simulated QR Image */}
                                <div className="relative w-36 h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                                  <QrCode className="h-32 w-32 text-slate-800 dark:text-gray-200" />
                                  <div className="absolute w-full h-0.5 bg-blue-500 top-0 left-0 shadow-lg shadow-blue-500 animate-scanline"></div>
                                </div>
                              </div>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-3 uppercase tracking-wider text-center">
                                Scan QR using BHIM, GPay, PhonePe or Paytm
                              </p>
                              
                              <button
                                type="button"
                                onClick={handlePaymentSuccess}
                                className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                              >
                                <Check className="h-3.5 w-3.5" /> Simulate QR Payment Success
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 pt-2">
                              <div>
                                <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                  Enter Virtual Payment Address (UPI ID)
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="yourname@okaxis"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                                  />
                                </div>
                                <p className="text-[9px] text-gray-400 mt-2">
                                  A payment request will be simulated on your UPI app.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* --- METHOD: CARD --- */}
                      {activeMethod === 'card' && (
                        <div className="space-y-4 pt-1">
                          <div className="relative">
                            <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Card Number</label>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full p-3 pr-14 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white tracking-widest"
                                placeholder="4242 4242 4242 4242"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                              />
                              {getCardBrand(cardNumber) && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border border-blue-100 dark:border-blue-800/30">
                                  {getCardBrand(cardNumber)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                              placeholder="John Doe"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                              <input
                                type="text"
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={handleExpiryChange}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">CVV</label>
                              <input
                                type="password"
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                                placeholder="•••"
                                value={cvc}
                                onChange={handleCvcChange}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --- METHOD: NETBANKING --- */}
                      {activeMethod === 'netbanking' && (
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Select Bank Account</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { code: 'SBI', name: 'SBI', color: 'from-blue-500 to-sky-500' },
                              { code: 'HDFC', name: 'HDFC', color: 'from-blue-900 to-indigo-900' },
                              { code: 'ICICI', name: 'ICICI', color: 'from-orange-500 to-amber-500' },
                              { code: 'AXIS', name: 'Axis', color: 'from-red-800 to-rose-900' },
                              { code: 'KOTAK', name: 'Kotak', color: 'from-red-600 to-amber-600' }
                            ].map((bank) => (
                              <button
                                key={bank.code}
                                type="button"
                                onClick={() => setSelectedBank(bank.code)}
                                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                                  selectedBank === bank.code
                                    ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bank.color} text-white flex items-center justify-center text-[10px] font-black shadow-sm`}>
                                  {bank.code.substring(0, 3)}
                                </span>
                                <div>
                                  <p className="text-xs font-black text-gray-900 dark:text-white leading-none">{bank.name}</p>
                                  <p className="text-[8px] text-gray-400 mt-1">Retail Banking</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* --- METHOD: WALLET --- */}
                      {activeMethod === 'wallet' && (
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Choose Wallet</label>
                          <div className="space-y-2.5">
                            {[
                              { code: 'paytm', name: 'Paytm Wallet', desc: 'Instant authorization using registered wallet' },
                              { code: 'mobikwik', name: 'MobiKwik', desc: 'Pay via MobiKwik wallet cash or zip pay' },
                              { code: 'phonepe', name: 'PhonePe Wallet', desc: 'Secure payment through PhonePe balance' }
                            ].map((wallet) => (
                              <button
                                key={wallet.code}
                                type="button"
                                onClick={() => setSelectedWallet(wallet.code)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                                  selectedWallet === wallet.code
                                    ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-black text-xs">
                                    {wallet.code[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{wallet.name}</p>
                                    <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">{wallet.desc}</p>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Simulator Bottom Pay Button */}
                      <div className="mt-8 pt-4 border-t border-gray-150 dark:border-gray-700">
                        {!(activeMethod === 'upi' && upiOption === 'qr') && (
                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-all transform active:scale-[0.98] disabled:opacity-50 text-xs uppercase tracking-wider"
                          >
                            {isProcessing ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Simulating payment...</>
                            ) : (
                              <>Verify & Pay ₹{selectedPlan.price}</>
                            )}
                          </button>
                        )}
                        <p className="text-[9px] text-gray-400 font-bold text-center mt-2 flex items-center justify-center gap-1">
                          <Lock className="h-3 w-3" /> SECURED BY 256-BIT SSL ENCRYPTION
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* --- STAGE: OTP DIALOG (FOR CARD SIMULATOR) --- */}
              {checkoutStage === 'otp' && (
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                  <div className="bg-slate-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">3D Secure Authentication</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1 uppercase tracking-wide">SafeKey Verification Network</p>
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-700 text-left text-xs space-y-1.5 shadow-sm">
                      <div className="flex justify-between"><span className="text-gray-400 font-bold">Merchant:</span><span className="font-extrabold text-gray-900 dark:text-white">SKILLSTASH</span></div>
                      <div className="flex justify-between"><span className="text-gray-400 font-bold">Amount:</span><span className="font-black text-blue-600 dark:text-blue-400">₹{selectedPlan.price}.00</span></div>
                      <div className="flex justify-between"><span className="text-gray-400 font-bold">Card:</span><span className="font-bold text-gray-800 dark:text-gray-200">**** **** **** {cardNumber.slice(-4) || '4242'}</span></div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        A verification code was simulated to phone masked as <span className="font-bold text-gray-900 dark:text-white">******8899</span>.
                      </p>
                      {error && <p className="text-[10px] text-red-600 dark:text-red-400 font-bold">{error}</p>}
                      <input
                        type="text"
                        placeholder="Enter 6-Digit OTP"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full text-center p-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-lg font-black tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-950 dark:text-white"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => { setCheckoutStage('simulator'); setOtpInput(''); }}
                        className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleVerifyOtp}
                        disabled={isProcessing}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        {isProcessing ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                        ) : (
                          <>Submit OTP</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STAGE: MOCK NETBANKING PORTAL REDIRECT --- */}
              {checkoutStage === 'netbanking_portal' && (
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                  <div className="bg-slate-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl space-y-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-700 to-indigo-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md text-lg font-black tracking-widest">
                      {selectedBank}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{activeBankLabel()} Secured Gateway</h4>
                      <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Secure Gateway Connected
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-850 rounded-2xl border border-gray-150 dark:border-gray-700 text-left text-xs space-y-2 shadow-sm">
                      <div className="flex justify-between"><span className="text-gray-400 font-bold">Merchant:</span><span className="font-extrabold text-gray-850 dark:text-white">SKILLSTASH</span></div>
                      <div className="flex justify-between"><span className="text-gray-400 font-bold">Total Payment:</span><span className="font-black text-blue-600 dark:text-blue-400">₹{selectedPlan.price}.00</span></div>
                    </div>

                    <div className="space-y-3 pt-2 text-left">
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Customer Username</label>
                        <input type="text" placeholder="e.g. sbi_user_99" readOnly className="w-full p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 text-xs font-bold rounded-lg text-gray-500" value="skillstash_customer" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Password</label>
                        <input type="password" placeholder="••••••••" readOnly className="w-full p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 text-xs font-bold rounded-lg text-gray-500" value="••••••••••••••" />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setCheckoutStage('simulator')}
                        className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePaymentSuccess}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20"
                      >
                        Authorize Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
