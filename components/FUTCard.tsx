import React from 'react';
import { User } from '../types';

interface FUTCardProps {
  user: User;
}

export const FUTCard: React.FC<FUTCardProps> = ({ user }) => {
  // Calculate OVR: Scale 0-5 to 0-99
  const avgScore = (user.skillScore + user.mannerScore) / 2;
  const overall = user.matchesPlayed > 0 
    ? Math.min(99, Math.round((avgScore / 5) * 95) + Math.min(4, Math.floor(user.matchesPlayed / 5))) 
    : '-';

  return (
    <div className="relative w-72 h-[420px] mx-auto perspective-1000 font-sans select-none">
      {/* Outer Glow for Premium Feel */}
      <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full transform scale-90 translate-y-4"></div>

      {/* Main Card Shape */}
      <div className="relative w-full h-full bg-gradient-to-b from-[#e3c378] via-[#fcf6ba] to-[#cba351] p-[6px] rounded-t-[2rem] rounded-b-[2rem] shadow-2xl border border-[#bfa25f]">
        
        {/* Inner Dark Container */}
        <div className="w-full h-full bg-gradient-to-b from-[#1a1a1a] via-[#2d2510] to-[#1a1a1a] rounded-t-[1.7rem] rounded-b-[1.7rem] relative overflow-hidden flex flex-col">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, #ffd700 0, #ffd700 1px, transparent 0, transparent 50%)', 
                 backgroundSize: '20px 20px'
               }}>
          </div>
          
          {/* Holographic Shine Effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-20 pointer-events-none"></div>

          {/* Top Info Section */}
          <div className="flex pt-8 px-5 relative z-10 h-2/3">
            {/* Left Column: Rating, Pos, Flag */}
            <div className="flex flex-col items-center w-1/5 space-y-3 pt-2 text-[#fcf6ba]">
              <div className="text-5xl font-bold leading-none tracking-tighter drop-shadow-md">{overall}</div>
              <div className="text-xl font-bold uppercase tracking-wide border-b border-[#fcf6ba]/30 pb-1">{user.position}</div>
              <div className="mt-1">
                <img 
                  src={`https://flagcdn.com/w40/${user.country.toLowerCase()}.png`}
                  alt={user.country}
                  className="w-8 h-auto shadow-sm rounded-[2px]"
                />
              </div>
            </div>

            {/* Right Column: Player Image */}
            <div className="w-4/5 flex justify-center items-start relative mt-2 pl-2">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-48 h-48 object-cover drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-10 relative mask-image-gradient"
                style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
              />
            </div>
          </div>

          {/* Bottom Section: Name & Main Stats */}
          <div className="relative z-10 mt-auto pb-8">
            {/* Name */}
            <div className="text-center mb-4">
              <h2 className="text-[#fcf6ba] font-bold text-2xl uppercase tracking-wider font-serif truncate px-4 drop-shadow-lg">
                {user.name}
              </h2>
              <div className="w-3/4 mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2 opacity-80"></div>
            </div>

            {/* Stats: Skill & Manner */}
            <div className="flex justify-center gap-8 px-6 text-[#fcf6ba]">
               <div className="flex flex-col items-center group">
                 <span className="text-sm uppercase opacity-70 tracking-widest font-medium group-hover:text-white transition-colors">Skill</span>
                 <span className="font-bold text-3xl tabular-nums text-green-400 drop-shadow-sm">
                   {user.skillScore.toFixed(1)}
                 </span>
               </div>
               
               <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-[#fcf6ba]/30 to-transparent"></div>

               <div className="flex flex-col items-center group">
                 <span className="text-sm uppercase opacity-70 tracking-widest font-medium group-hover:text-white transition-colors">Manner</span>
                 <span className="font-bold text-3xl tabular-nums text-blue-400 drop-shadow-sm">
                   {user.mannerScore.toFixed(1)}
                 </span>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};