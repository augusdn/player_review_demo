import React, { useState } from 'react';
import { User as UserType, Match, MatchStatus, TabView, Review, Position } from './types';
import { Navbar } from './components/Navbar';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { LoginFlow } from './components/LoginFlow';
import { MatchCard } from './components/MatchCard';
import { ProfileView } from './components/ProfileView';
import { ReviewModal } from './components/ReviewModal';

// --- MOCK DATA ---
const MOCK_USERS: UserType[] = [
  { id: '2', name: 'Alex Striker', phoneNumber: '555-0102', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', country: 'ar', position: 'FWD', skillScore: 4.5, mannerScore: 3.8, matchesPlayed: 12, reviews: [] },
  { id: '3', name: 'Jamie Keeper', phoneNumber: '555-0103', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', country: 'br', position: 'GK', skillScore: 3.2, mannerScore: 4.9, matchesPlayed: 8, reviews: [] },
  { id: '4', name: 'Sam Defender', phoneNumber: '555-0104', avatar: 'https://randomuser.me/api/portraits/men/86.jpg', country: 'it', position: 'DEF', skillScore: 4.0, mannerScore: 4.2, matchesPlayed: 15, reviews: [] },
];

const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    creatorId: '2',
    location: 'Downtown Arena',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: MatchStatus.FINISHED,
    players: [MOCK_USERS[0], MOCK_USERS[1]],
    scores: { teamA: 5, teamB: 3 }
  }
];

export default function App() {
  // --- STATE ---
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [view, setView] = useState<TabView>('LOGIN');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  
  // Create Match State
  const [newMatchLocation, setNewMatchLocation] = useState('');
  const [newMatchOpponent, setNewMatchOpponent] = useState<string>('');
  const [newMatchDate, setNewMatchDate] = useState<string>(new Date().toISOString().slice(0, 16));

  // Review State
  const [reviewingMatchId, setReviewingMatchId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, { skill: number; manner: number }>>({});

  // --- HANDLERS ---

  const handleLoginSuccess = (phone: string, name: string, position: Position) => {
    // Simulate login or signup
    // Generate a random human avatar
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const randomId = Math.floor(Math.random() * 99);
    
    const newUser: UserType = {
      id: '1', // Hardcoded ID for demo
      name: name,
      phoneNumber: phone,
      avatar: `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`,
      country: 'gb', // Default country code (lowercase for flagcdn)
      position: position,
      skillScore: 0,
      mannerScore: 0,
      matchesPlayed: 0,
      reviews: []
    };
    setCurrentUser(newUser);
    setView('HOME');
  };

  const handleCreateMatch = () => {
    if (!newMatchLocation || !currentUser) return;

    // Find opponent or pick random
    const opponent = MOCK_USERS.find(u => u.name === newMatchOpponent) || MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];

    const newMatch: Match = {
      id: Date.now().toString(),
      creatorId: currentUser.id,
      location: newMatchLocation,
      date: new Date(newMatchDate).toISOString(), // Use selected date
      status: MatchStatus.SCHEDULED,
      players: [currentUser, opponent],
      scores: { teamA: 0, teamB: 0 }
    };

    setMatches([newMatch, ...matches]);
    setView('HOME');
    setNewMatchLocation('');
    setNewMatchOpponent('');
    setNewMatchDate(new Date().toISOString().slice(0, 16)); // Reset date
  };

  const updateMatchStatus = (matchId: string, status: MatchStatus) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status } : m));
  };

  const handleReviewSubmit = () => {
    if (!reviewingMatchId || !currentUser) return;
    
    // 1. Mark match as reviewed
    updateMatchStatus(reviewingMatchId, MatchStatus.REVIEWED);

    // 2. Simulate "Opponent Reviews Me Back"
    const match = matches.find(m => m.id === reviewingMatchId);
    const opponent = match?.players.find(p => p.id !== currentUser.id) || MOCK_USERS[0];
    
    // Generate random stats for the "received" review
    const receivedSkill = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 - 5.0
    const receivedManner = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 - 5.0
    
    const newReview: Review = {
      id: Date.now().toString(),
      fromName: opponent.name,
      fromAvatar: opponent.avatar,
      skill: receivedSkill,
      manner: receivedManner,
      comment: ["Great game!", "Fast player!", "Good defense.", "Nice goals."][Math.floor(Math.random() * 4)],
      createdAt: new Date().toISOString()
    };

    // Update current user stats
    setCurrentUser(prev => {
      if (!prev) return null;
      const totalSkill = prev.skillScore * prev.matchesPlayed + receivedSkill;
      const totalManner = prev.mannerScore * prev.matchesPlayed + receivedManner;
      const newCount = prev.matchesPlayed + 1;

      return {
        ...prev,
        skillScore: totalSkill / newCount,
        mannerScore: totalManner / newCount,
        matchesPlayed: newCount,
        reviews: [...prev.reviews, newReview]
      };
    });

    setReviewingMatchId(null);
    setRatings({});
  };

  // --- MAIN RENDER ---

  if (view === 'LOGIN' || !currentUser) {
    return <LoginFlow onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      
      {view === 'HOME' && (
        <div className="p-4 space-y-6 animate-fade-in">
          <header className="flex justify-between items-center py-2">
             <div>
                <h1 className="text-2xl font-bold text-white">Match Day</h1>
                <p className="text-gray-400 text-sm">Welcome back, {currentUser.name}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-pitch-500 font-bold border border-gray-700">
                {currentUser.skillScore > 0 ? currentUser.skillScore.toFixed(1) : '-'}
             </div>
          </header>

          <div className="space-y-4">
             <h2 className="text-lg font-semibold text-gray-200">Upcoming & Live</h2>
             {matches.filter(m => m.status !== MatchStatus.REVIEWED).length === 0 ? (
                 <div className="text-center py-10 text-gray-500 bg-dark-900 rounded-2xl border border-gray-800 border-dashed">
                     <p>No active matches.</p>
                     <Button variant="ghost" className="mt-2 text-pitch-500" onClick={() => setView('CREATE')}>Create one?</Button>
                 </div>
             ) : (
                matches.filter(m => m.status !== MatchStatus.REVIEWED).map(match => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      currentUser={currentUser}
                      onUpdateStatus={updateMatchStatus}
                      onReview={(id) => setReviewingMatchId(id)}
                    />
                ))
             )}
          </div>
          
          <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-200">History</h2>
              {matches.filter(m => m.status === MatchStatus.REVIEWED).map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    currentUser={currentUser}
                    onUpdateStatus={updateMatchStatus}
                    onReview={(id) => setReviewingMatchId(id)}
                  />
              ))}
          </div>
        </div>
      )}

      {view === 'CREATE' && (
        <div className="p-4 space-y-6 animate-fade-in">
           <h1 className="text-2xl font-bold text-white">New Match</h1>
           <div className="bg-dark-900 p-6 rounded-3xl border border-gray-800 space-y-6">
              <Input 
                label="Date & Time"
                type="datetime-local"
                value={newMatchDate}
                onChange={(e) => setNewMatchDate(e.target.value)}
                className="calendar-icon-white" // Custom helper class if needed, or styling via CSS
              />
              <Input 
                label="Location" 
                placeholder="Where are you playing?" 
                value={newMatchLocation}
                onChange={(e) => setNewMatchLocation(e.target.value)}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Select Opponent (Dummy)</label>
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_USERS.map(user => (
                    <button
                      key={user.id}
                      onClick={() => setNewMatchOpponent(user.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        newMatchOpponent === user.name 
                        ? 'border-pitch-500 bg-pitch-900/20 text-white' 
                        : 'border-gray-700 bg-dark-800 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <img src={user.avatar} className="w-8 h-8 rounded-full" />
                      <span className="text-xs font-medium truncate w-full text-center">{user.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button fullWidth onClick={handleCreateMatch} disabled={!newMatchLocation || !newMatchOpponent}>
                    Schedule Match
                </Button>
              </div>
           </div>
        </div>
      )}

      {view === 'PROFILE' && (
        <ProfileView 
          currentUser={currentUser} 
          onLogout={() => { setCurrentUser(null); setView('LOGIN'); }} 
        />
      )}

      <ReviewModal 
        match={matches.find(m => m.id === reviewingMatchId)}
        currentUser={currentUser}
        ratings={ratings}
        setRatings={setRatings}
        onSubmit={handleReviewSubmit}
        onCancel={() => setReviewingMatchId(null)}
      />

      <Navbar currentTab={view} setTab={setView} />
    </div>
  );
}