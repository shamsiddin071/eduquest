import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Flame, 
  Zap, 
  Search 
} from 'lucide-react';

export default function Leaderboard() {
  const context = useOutletContext();
  const currentLang = context?.currentLang || 'en';

  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const benchmarkPlayers = [
    {
      id: 'bench-1',
      full_name: 'Ada Lovelace',
      current_level: 12,
      total_xp: 3420,
      streak_days: 18
    },
    {
      id: 'bench-2',
      full_name: 'Alan Turing',
      current_level: 11,
      total_xp: 3150,
      streak_days: 14
    },
    {
      id: 'bench-3',
      full_name: 'Satoshi Nakamoto',
      current_level: 10,
      total_xp: 2890,
      streak_days: 21
    },
    {
      id: 'bench-4',
      full_name: 'Katherine Johnson',
      current_level: 9,
      total_xp: 2450,
      streak_days: 9
    },
    {
      id: 'bench-5',
      full_name: 'Claude Shannon',
      current_level: 8,
      total_xp: 2100,
      streak_days: 7
    },
    {
      id: 'bench-6',
      full_name: 'Grace Hopper',
      current_level: 7,
      total_xp: 1820,
      streak_days: 5
    }
  ];

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        let activeUserId = null;
        let activeUserObj = null;

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          activeUserId = session.user.id;
          activeUserObj = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            email: session.user.email,
            current_level: 3,
            total_xp: 450,
            streak_days: 3
          };
        } else {
          const demo = localStorage.getItem('eduquest_demo_user');
          if (demo) {
            const parsed = JSON.parse(demo);
            activeUserId = parsed.id;
            activeUserObj = parsed;
          } else {
            activeUserId = 'guest-demo-user';
            activeUserObj = {
              id: 'guest-demo-user',
              full_name: 'Guest Challenger',
              current_level: 3,
              total_xp: 450,
              streak_days: 3
            };
          }
        }

        const { data: remoteUsers, error } = await supabase
          .from('users')
          .select('id, full_name, current_level, total_xp, streak_days')
          .order('total_xp', { ascending: false })
          .limit(50);

        let mergedList = [];
        if (!error && remoteUsers && remoteUsers.length > 0) {
          mergedList = [...remoteUsers];
        }

        if (activeUserObj && !mergedList.some((u) => u.id === activeUserObj.id)) {
          mergedList.push(activeUserObj);
        }

        benchmarkPlayers.forEach((bench) => {
          if (!mergedList.some((u) => u.id === bench.id || u.full_name === bench.full_name)) {
            mergedList.push(bench);
          }
        });

        mergedList.sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));

        setLeaderboard(mergedList);

        const foundIndex = mergedList.findIndex((u) => u.id === activeUserId);
        if (foundIndex !== -1) {
          setUserRank(foundIndex + 1);
          setCurrentUser(mergedList[foundIndex]);
        } else {
          setUserRank(mergedList.length);
          setCurrentUser(activeUserObj);
        }
      } catch (err) {
        console.error('Error compiling leaderboard:', err);
      }
    }

    fetchLeaderboardData();
  }, []);

  const filteredUsers = leaderboard.filter((u) =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
          <Crown className="w-5 h-5 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-900 flex items-center justify-center font-black shadow-md shadow-slate-400/20">
          <Medal className="w-5 h-5 fill-current" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 flex items-center justify-center font-black shadow-md shadow-amber-800/20">
          <Medal className="w-5 h-5 fill-current" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-sm">
        #{rank}
      </div>
    );
  };

  const getRowHighlight = (rank, isSelf) => {
    if (isSelf) {
      return 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/40 ring-1 ring-indigo-500/50';
    }
    if (rank === 1) {
      return 'border-amber-400/60 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent hover:border-amber-400';
    }
    if (rank === 2) {
      return 'border-slate-300/60 bg-gradient-to-r from-slate-300/10 via-slate-200/5 to-transparent hover:border-slate-300';
    }
    if (rank === 3) {
      return 'border-amber-700/60 bg-gradient-to-r from-amber-700/10 via-amber-600/5 to-transparent hover:border-amber-700';
    }
    return 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>{currentLang === 'uz' ? 'Global Reyting' : 'Global Standings'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentLang === 'uz' ? 'EduQuest Chempionlar Ligasi' : 'EduQuest Champions Ladder'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            {currentLang === 'uz'
              ? 'Sprint natijalari va o‘zlashtirilgan tajriba ballari (XP) bo‘yicha tartiblangan'
              : 'Ranked by cumulative Sprint XP, answer accuracy, and mistake redemptions'}
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPeriod === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {currentLang === 'uz' ? 'Barcha Vaqt' : 'All Time'}
          </button>
          <button
            type="button"
            onClick={() => setFilterPeriod('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPeriod === 'weekly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {currentLang === 'uz' ? 'Haftalik' : 'Weekly Sprint'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {leaderboard.slice(0, 3).map((player, idx) => {
          const rank = idx + 1;
          const isGold = rank === 1;
          const isSilver = rank === 2;

          let badgeBorder = isGold 
            ? 'border-amber-400 shadow-amber-500/10' 
            : isSilver 
            ? 'border-slate-300 shadow-slate-400/10' 
            : 'border-amber-700 shadow-amber-700/10';

          return (
            <div
              key={player.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 ${badgeBorder} shadow-lg relative flex flex-col items-center text-center transition-all hover:scale-[1.02]`}
            >
              <div className="absolute top-4 left-4">
                {getRankBadge(rank)}
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md mt-2 mb-3">
                {player.full_name.charAt(0)}
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {player.full_name}
              </h3>

              <span className="text-xs font-semibold text-indigo-500 mb-3">
                Level {player.current_level}
              </span>

              <div className="w-full flex items-center justify-around py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1 text-emerald-500 font-black text-sm">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{player.total_xp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1 text-rose-500 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{player.streak_days}d</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={currentLang === 'uz' ? 'O‘yinchini qidirish...' : 'Search challengers by name...'}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2.5">
        {filteredUsers.map((player) => {
          const rank = leaderboard.findIndex((p) => p.id === player.id) + 1;
          const isCurrentSelf = currentUser && player.id === currentUser.id;

          return (
            <div
              key={player.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${getRowHighlight(
                rank,
                isCurrentSelf
              )}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {getRankBadge(rank)}

                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {player.full_name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {player.full_name}
                    </p>
                    {isCurrentSelf && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-white font-extrabold text-[10px] tracking-wider uppercase">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Level {player.current_level}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{player.streak_days} days</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-500 font-extrabold text-sm sm:text-base">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{player.total_xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {currentUser && (
        <div className="fixed bottom-4 left-4 right-4 md:left-72 md:right-8 z-30">
          <div className="max-w-4xl mx-auto bg-slate-900/95 border-2 border-indigo-500 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                #{userRank || 1}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {currentLang === 'uz' ? 'Sizning O‘rningiz' : 'Your Global Standing'}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-white truncate">
                  {currentUser.full_name}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                <Flame className="w-4 h-4 fill-current" />
                <span>{currentUser.streak_days || 3}d</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 text-sm sm:text-base font-black">
                <Zap className="w-4 h-4 fill-current" />
                <span>{(currentUser.total_xp || 0).toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
