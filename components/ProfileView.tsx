import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { FUTCard } from './FUTCard';
import { generateScoutReport } from '../services/geminiService';
import { Zap, Shield, Activity, LogOut, User as UserIcon } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface ProfileViewProps {
  currentUser: User;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onLogout }) => {
  const [scoutReport, setScoutReport] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoadingReport(true);
    const report = await generateScoutReport(currentUser.name, currentUser.skillScore, currentUser.mannerScore, currentUser.matchesPlayed);
    setScoutReport(report);
    setIsLoadingReport(false);
  };

  // Data for Radar Chart
  const data = [
    { subject: 'Skill', A: currentUser.skillScore, fullMark: 5 },
    { subject: 'Manner', A: currentUser.mannerScore, fullMark: 5 },
    { subject: 'Pace', A: currentUser.skillScore * 0.8, fullMark: 5 }, 
    { subject: 'Defense', A: currentUser.mannerScore * 0.9, fullMark: 5 }, 
    { subject: 'Power', A: (currentUser.skillScore + currentUser.mannerScore) / 2, fullMark: 5 },
  ];

  return (
    <div className="p-4 pb-24 space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button variant="ghost" onClick={onLogout} className="!p-2">
              <LogOut size={20} />
          </Button>
      </header>

      {/* Premium FUT Card */}
      <div className="flex justify-center py-2">
        <FUTCard user={currentUser} />
      </div>

      {/* Radar Chart */}
      <div className="bg-dark-900 rounded-3xl p-4 border border-gray-800 h-80 relative">
          <h3 className="text-lg font-bold mb-4 ml-2">Performance Analysis</h3>
          <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                  <Radar
                      name={currentUser.name}
                      dataKey="A"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fill="#22c55e"
                      fillOpacity={0.3}
                  />
              </RadarChart>
          </ResponsiveContainer>
      </div>

      {/* AI Scout Report */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-dark-900 p-6 rounded-3xl border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <Activity className="text-indigo-400" />
                  <h3 className="text-lg font-bold text-indigo-100">AI Scout Report</h3>
              </div>
              {!scoutReport && (
                  <Button 
                      onClick={handleGenerateReport} 
                      disabled={isLoadingReport || currentUser.matchesPlayed === 0}
                      className="text-xs py-1 px-3 !bg-indigo-600 hover:!bg-indigo-500"
                  >
                      {isLoadingReport ? 'Scouting...' : 'Generate'}
                  </Button>
              )}
            </div>
            
            {scoutReport ? (
                <div className="bg-black/20 p-4 rounded-xl border border-indigo-500/20 text-indigo-200 text-sm leading-relaxed italic">
                    "{scoutReport}"
                </div>
            ) : (
                <p className="text-sm text-indigo-300/60">
                    {currentUser.matchesPlayed > 0 
                      ? "Tap generate to get an AI analysis of your playstyle." 
                      : "Play a match to unlock your scout report."}
                </p>
            )}
      </div>

      {/* Recent Reviews (Anonymous) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Recent Reviews</h3>
        {currentUser.reviews.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No reviews yet. Play a match!</p>
        ) : (
          currentUser.reviews.slice().reverse().map(review => (
            <div key={review.id} className="bg-dark-900 p-4 rounded-2xl border border-gray-800 flex gap-4">
              {/* Anonymous Avatar */}
              <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center border border-gray-700">
                <UserIcon size={20} className="text-gray-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <span className="font-bold text-gray-300">Anonymous Player</span>
                   <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-3 mt-1 text-sm">
                   <span className="text-pitch-400 flex items-center gap-1"><Zap size={12}/> {review.skill}</span>
                   <span className="text-blue-400 flex items-center gap-1"><Shield size={12}/> {review.manner}</span>
                </div>
                {review.comment && <p className="text-gray-400 text-sm mt-2 italic">"{review.comment}"</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};