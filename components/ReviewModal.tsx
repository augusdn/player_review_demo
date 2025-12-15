import React from 'react';
import { Match, User } from '../types';
import { Button } from './Button';

interface ReviewModalProps {
  match: Match | undefined;
  currentUser: User | null;
  ratings: Record<string, { skill: number; manner: number }>;
  setRatings: (ratings: Record<string, { skill: number; manner: number }>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  match, 
  currentUser, 
  ratings, 
  setRatings, 
  onSubmit, 
  onCancel 
}) => {
  if (!match) return null;
  const opponents = match.players.filter(p => p.id !== currentUser?.id);

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-dark-900 w-full max-w-md rounded-3xl p-6 space-y-6 border border-gray-800 animate-slide-up">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Match Report</h2>
          <p className="text-gray-400">Rate your opponents to update their stats.</p>
        </div>

        <div className="space-y-6">
          {opponents.map(opp => (
            <div key={opp.id} className="bg-dark-800 p-4 rounded-xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <img src={opp.avatar} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-bold text-white">{opp.name}</h3>
                  <p className="text-xs text-gray-500">Opponent</p>
                </div>
              </div>

              {/* Skill Rating */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Skill Level</span>
                  <span className="text-pitch-400 font-bold">{ratings[opp.id]?.skill || 3}/5</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="0.5"
                  className="w-full accent-pitch-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  value={ratings[opp.id]?.skill || 3}
                  onChange={(e) => setRatings({
                    ...ratings, 
                    [opp.id]: { ...ratings[opp.id] || { skill: 3, manner: 3 }, skill: parseFloat(e.target.value) }
                  })}
                />
              </div>

              {/* Manner Rating */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Sportsmanship</span>
                  <span className="text-blue-400 font-bold">{ratings[opp.id]?.manner || 3}/5</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="0.5"
                  className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  value={ratings[opp.id]?.manner || 3}
                  onChange={(e) => setRatings({
                    ...ratings, 
                    [opp.id]: { ...ratings[opp.id] || { skill: 3, manner: 3 }, manner: parseFloat(e.target.value) }
                  })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={onCancel}>Skip</Button>
            <Button className="flex-[2]" onClick={onSubmit}>Submit Reviews</Button>
        </div>
      </div>
    </div>
  );
};