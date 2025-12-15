import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Zap, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { Position } from '../types';

interface LoginFlowProps {
  onLoginSuccess: (phone: string, name: string, position: Position) => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'DETAILS'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('MID');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 5) return;
    setIsLoading(true);
    // Simulate Firebase sending SMS
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true);
    // Simulate Firebase verifying code
    setTimeout(() => {
      setIsLoading(false);
      setStep('DETAILS');
    }, 1000);
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onLoginSuccess(phone, name, position);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-dark-950 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pitch-600 rounded-full blur-[100px] opacity-20"></div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-full bg-pitch-500/10 mb-4">
            <Zap size={48} className="text-pitch-500" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">PitchPerfect</h1>
          <p className="text-gray-400">
            {step === 'PHONE' && "Enter your number to start."}
            {step === 'OTP' && "We sent you a code."}
            {step === 'DETAILS' && "Create your player card."}
          </p>
        </div>
        
        <div className="bg-dark-900 p-8 rounded-2xl border border-gray-800 shadow-xl transition-all">
          {step === 'PHONE' && (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in">
              <Input 
                label="Phone Number" 
                type="tel" 
                placeholder="+1 555 000 0000" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
              />
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Code'}
              </Button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Input 
                  label="Enter 6-digit Code (Mock: 123456)" 
                  type="text" 
                  placeholder="123456" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  autoFocus
                />
                <p className="text-xs text-gray-500">For this demo, any 6-digit code works.</p>
              </div>
              <Button type="submit" fullWidth disabled={isLoading}>
                 {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
              <button 
                type="button" 
                onClick={() => setStep('PHONE')} 
                className="w-full text-center text-sm text-gray-400 mt-4 hover:text-white"
              >
                Change Number
              </button>
            </form>
          )}

          {step === 'DETAILS' && (
            <form onSubmit={handleFinalize} className="space-y-6 animate-fade-in">
              <Input 
                label="Display Name" 
                placeholder="e.g. Leo Messi" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Preferred Position</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['GK', 'DEF', 'MID', 'FWD'] as Position[]).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPosition(pos)}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                        position === pos 
                          ? 'bg-pitch-600 border-pitch-500 text-white shadow-lg' 
                          : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" fullWidth>Create Account</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};