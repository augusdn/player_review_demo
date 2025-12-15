import React from 'react';
import { Calendar, MapPin, Award } from 'lucide-react';
import { Match, MatchStatus, User } from '../types';
import { Button } from './Button';

interface MatchCardProps {
  match: Match;
  currentUser: User | null;
  onUpdateStatus: (id: string, status: MatchStatus) => void;
  onReview: (id: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, currentUser, onUpdateStatus, onReview }) => {
  const isParticipant = match.players.some(p => p.id === currentUser?.id);
  const opponent = match.players.find(p => p.id !== currentUser?.id) || match.players[0];

  return (
    <div className="bg-dark-900 rounded-2xl p-5 border border-gray-800 space-y-4 shadow-lg animate-fade-in">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
          <Calendar size={14} />
          <span>{new Date(match.date).toLocaleDateString()}</span>
          <span>•</span>
          <MapPin size={14} />
          <span>{match.location}</span>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          match.status === MatchStatus.ACTIVE ? 'bg-green-500/20 text-green-400 animate-pulse' : 
          match.status === MatchStatus.FINISHED ? 'bg-gray-700 text-gray-300' :
          match.status === MatchStatus.REVIEWED ? 'bg-pitch-500/20 text-pitch-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {match.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <img src={currentUser?.avatar} alt="You" className="w-10 h-10 rounded-full border-2 border-pitch-500" />
           <span className="font-bold text-white">You</span>
        </div>
        <div className="text-2xl font-bold text-gray-600">VS</div>
        <div className="flex items-center gap-3 flex-row-reverse">
           <img src={opponent.avatar} alt={opponent.name} className="w-10 h-10 rounded-full border-2 border-red-500" />
           <span className="font-bold text-white text-right">{opponent.name}</span>
        </div>
      </div>

      {isParticipant && (
        <div className="pt-2 border-t border-gray-800">
          {match.status === MatchStatus.SCHEDULED && (
            <Button fullWidth onClick={() => onUpdateStatus(match.id, MatchStatus.ACTIVE)}>Start Match</Button>
          )}
          {match.status === MatchStatus.ACTIVE && (
             <Button fullWidth variant="danger" onClick={() => onUpdateStatus(match.id, MatchStatus.FINISHED)}>End Match</Button>
          )}
          {match.status === MatchStatus.FINISHED && (
             <Button fullWidth variant="secondary" onClick={() => onReview(match.id)}>Review Opponent</Button>
          )}
          {match.status === MatchStatus.REVIEWED && (
            <div className="text-center text-sm text-pitch-500 font-medium flex items-center justify-center gap-2 py-2">
              <Award size={16} /> Match Complete & Rated
            </div>
          )}
        </div>
      )}
    </div>
  );
};