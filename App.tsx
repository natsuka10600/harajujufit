
import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  UserCheckIn, 
  PainLevel, 
  RoutineItem, 
  PostWorkoutFeedback,
  DailyLog
} from './types';
import { generateRoutine } from './routineGenerator';
import { JP_DESIGN, LOOT_DB } from './constants';
import { PixelButton, PixelCard, PixelAvatar } from './components/PixelComponents';

type PlayPhase = 'PREP' | 'WORKOUT' | 'REST';

const App = () => {
  const [view, setView] = useState<AppView>('SPLASH');
  const [checkIn, setCheckIn] = useState<Partial<UserCheckIn>>({});
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  
  // Playing State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timer, setTimer] = useState(0);
  const [playPhase, setPlayPhase] = useState<PlayPhase>('PREP');
  
  // Data State
  const [streak, setStreak] = useState(12);
  const [history, setHistory] = useState<DailyLog[]>([
    { id: '1', date: new Date(Date.now() - 86400000).toISOString(), durationMin: 15, exercisesCompleted: 5 },
    { id: '2', date: new Date(Date.now() - 172800000).toISOString(), durationMin: 5, exercisesCompleted: 3 },
  ]);
  const [feedbackInput, setFeedbackInput] = useState<Partial<PostWorkoutFeedback>>({});
  
  // My Room State
  const [myRoomTab, setMyRoomTab] = useState<'LOG' | 'CLOSET'>('CLOSET');

  // --- VIEW: SPLASH (JAPANESE DESIGN) ---
  const renderSplash = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-8 bg-[#FFEFF7] relative overflow-hidden">
      {/* Decorative BG Elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce">👾</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-pulse">🎮</div>

      {/* 16-bit Logo Style Title */}
      <div className="relative mb-6 transform -rotate-2 hover:rotate-2 transition-transform duration-300">
        <h1 className="text-5xl md:text-7xl font-pixel-title text-[#FF69B4] leading-relaxed tracking-widest relative z-10" 
            style={{ 
              textShadow: '4px 4px 0px #000000, -2px -2px 0px #FFFFFF',
              WebkitTextStroke: '2px black' 
            }}>
          {JP_DESIGN.title}
        </h1>
        {/* Shadow Duplicate for extra depth */}
        <h1 className="text-5xl md:text-7xl font-pixel-title text-black opacity-30 absolute top-2 left-2 w-full h-full -z-10 leading-relaxed tracking-widest">
          {JP_DESIGN.title}
        </h1>
      </div>

      <p className="font-pixel-text text-xl font-bold bg-black text-[#CCFF00] px-4 py-1 rotate-2 pixel-shadow">
        {JP_DESIGN.subtitle}
      </p>

      <div className="my-8 scale-125">
         <PixelAvatar mood="happy" />
      </div>

      <div className="space-y-4 w-full max-w-xs z-10">
        <div className="flex justify-center items-center space-x-2 bg-white pixel-border px-4 py-2 pixel-shadow-sm">
          <span className="text-red-500 animate-pulse">❤️</span> 
          <span className="font-pixel-text font-bold text-sm">{JP_DESIGN.streakLabel}: {streak} DAYS</span>
        </div>

        <PixelButton size="lg" className="w-full text-xl py-6 animate-pulse" onClick={() => setView('CHECK_IN')}>
          {JP_DESIGN.startBtn} ▶
        </PixelButton>
        
        <PixelButton variant="secondary" className="w-full" onClick={() => setView('HISTORY')}>
          {JP_DESIGN.historyBtn} 🏠
        </PixelButton>
      </div>
      
      <p className="font-pixel-text text-gray-400 text-xs font-bold absolute bottom-4">© 2024 SHIBUYA STUDIO | {JP_DESIGN.ver}</p>
    </div>
  );

  // --- VIEW: CHECK IN ---
  const renderCheckIn = () => {
    const isReady = checkIn.painLevel && checkIn.feeling && checkIn.availableTimeMin;

    return (
      <div className="min-h-screen p-4 flex flex-col items-center max-w-md mx-auto pb-20">
        <h2 className="text-2xl font-pixel-title mb-6 text-[#00FFFF] bg-black px-2 py-1 border-2 border-white pixel-shadow">狀態檢查 STATUS</h2>
        
        {/* Q1: PAIN */}
        <PixelCard title="血條 HP (疼痛指數)" className="w-full mb-6">
          <div className="grid grid-cols-4 gap-2">
            {[
              { l: PainLevel.GREAT, e: '😃', t: '超棒' },
              { l: PainLevel.SORE, e: '🥲', t: '微酸' },
              { l: PainLevel.HURT, e: '😫', t: '母湯' },
              { l: PainLevel.ZOMBIE, e: '🧟‍♀️', t: '喪屍' }
            ].map((opt) => (
              <button 
                key={opt.l}
                onClick={() => setCheckIn({...checkIn, painLevel: opt.l})}
                className={`flex flex-col items-center p-2 border-2 transition-all ${checkIn.painLevel === opt.l ? 'bg-[#FF69B4] border-black scale-105 text-white pixel-shadow-sm' : 'border-transparent hover:bg-gray-100'}`}
              >
                <span className="text-3xl mb-1 filter drop-shadow-sm">{opt.e}</span>
                <span className="font-pixel-text text-xs font-bold">{opt.t}</span>
              </button>
            ))}
          </div>
        </PixelCard>

        {/* Q2: FEELING */}
        <PixelCard title="身體感覺 VIBE" className="w-full mb-6">
          <div className="space-y-2">
            {[
              { v: 'NORMAL', t: '普通 (沒啥感覺) 😐' },
              { v: 'COMPRESSED', t: '被壓扁了 (縮水) 📉' },
              { v: 'STIFF', t: '硬梆梆 (石化) 🗿' }
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setCheckIn({...checkIn, feeling: opt.v as any})}
                className={`w-full text-left font-pixel-text text-lg p-2 border-2 transition-all font-bold ${checkIn.feeling === opt.v ? 'bg-[#CCFF00] border-black pixel-shadow-sm' : 'border-gray-200'}`}
              >
                {opt.t}
              </button>
            ))}
          </div>
        </PixelCard>

        {/* Q3: TIME */}
        <PixelCard title="時間限制 TIME LIMIT" className="w-full mb-6">
           <div className="flex justify-between gap-2">
            {[5, 15, 30].map(min => (
              <PixelButton 
                key={min}
                variant={checkIn.availableTimeMin === min ? 'primary' : 'secondary'}
                onClick={() => setCheckIn({...checkIn, availableTimeMin: min})}
                className="flex-1 font-bold"
              >
                {min}分
              </PixelButton>
            ))}
           </div>
        </PixelCard>

        <div className="fixed bottom-6 w-full max-w-md px-4 z-10">
          <PixelButton 
            disabled={!isReady}
            className={`w-full ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
            size="lg"
            variant="accent"
            onClick={() => {
              const r = generateRoutine(checkIn as UserCheckIn);
              setRoutine(r);
              setView('ROUTINE_PREVIEW');
            }}
          >
            生成菜單 GENERATE 💿
          </PixelButton>
        </div>
      </div>
    );
  };

  // --- VIEW: PREVIEW ---
  const renderPreview = () => (
    <div className="min-h-screen p-4 flex flex-col items-center max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <PixelAvatar mood="strict" />
        <div className="bg-white p-3 pixel-border text-sm font-pixel-text speech-bubble relative shadow-lg">
          <div className="absolute -left-2 top-1/2 w-4 h-4 bg-white border-l-4 border-b-4 border-black transform rotate-45 -translate-y-1/2"></div>
          <p className="font-bold">
            {checkIn.painLevel! > 6 
              ? "嗚哇... 喪屍模式？🧟‍♀️ 今天先放鬆一下吧。Chill～" 
              : "OK！把烏龜脖子修好！電玩頸退散！🎮"}
          </p>
        </div>
      </div>

      <PixelCard title="今日任務 MISSION" className="w-full mb-20">
        <ul className="space-y-4">
          {routine.map((ex, idx) => (
            <li key={idx} className="flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-2">
              <div>
                <div className="font-pixel-text text-lg font-bold text-gray-800">{ex.name}</div>
                <div className="text-xs text-gray-500 font-bold">x {ex.sets} 組 (Sets)</div>
              </div>
              <span className="bg-[#1a1a1a] text-[#CCFF00] text-xs px-2 py-1 font-pixel-text font-bold rounded-sm">{ex.durationSec}s</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-2 border-t-4 border-black text-center">
            <p className="font-pixel-text font-bold text-[#FF69B4]">
                預計時間: {checkIn.availableTimeMin} 分鐘
            </p>
        </div>
      </PixelCard>

      <div className="fixed bottom-6 w-full max-w-md px-4 z-10">
        <PixelButton size="lg" className="w-full" onClick={() => {
          setCurrentExerciseIndex(0);
          setCurrentSet(1);
          setPlayPhase('PREP');
          setTimer(3);
          setView('PLAYING');
        }}>
          出發！Let's GO！(≧∇≦)/
        </PixelButton>
      </div>
    </div>
  );

  // --- VIEW: PLAYING (With State Machine) ---
  
  // Unified Timer Logic for all phases
  useEffect(() => {
    let interval: any = null;
    if (view === 'PLAYING' && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (view === 'PLAYING' && timer === 0) {
      handlePhaseComplete();
    }
    return () => clearInterval(interval);
  }, [view, timer, playPhase]);

  const handlePhaseComplete = () => {
    if (playPhase === 'PREP') {
      // PREP -> WORKOUT
      setPlayPhase('WORKOUT');
      setTimer(routine[currentExerciseIndex].durationSec);

    } else if (playPhase === 'WORKOUT') {
      // WORKOUT -> REST or SUCCESS
      const currentEx = routine[currentExerciseIndex];
      const isLastSet = currentSet >= currentEx.sets;
      const isLastEx = currentExerciseIndex >= routine.length - 1;

      if (isLastSet && isLastEx) {
        setView('SUCCESS');
      } else {
        // Prepare next steps immediately for the REST screen
        if (isLastSet) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSet(1);
        } else {
          setCurrentSet(prev => prev + 1);
        }
        setPlayPhase('REST');
        setTimer(20); // 20s Buffer
      }

    } else if (playPhase === 'REST') {
      // REST -> PREP (Next Exercise)
      setPlayPhase('PREP');
      setTimer(3); // 3s Prep before start
    }
  };

  const skipRest = () => {
    setPlayPhase('PREP');
    setTimer(3);
  };

  const renderPlaying = () => {
    const currentEx = routine[currentExerciseIndex];
    const progressPercent = ((currentExerciseIndex) / routine.length) * 100;

    // --- RENDER: REST PHASE OVERLAY ---
    if (playPhase === 'REST') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#CCFF00] relative text-center space-y-8">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
           
           <h2 className="text-4xl font-pixel-title text-black drop-shadow-md z-10">休息時間 REST</h2>
           
           <div className="bg-white pixel-border p-6 w-full max-w-sm z-10 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-[#00FFFF] px-2 font-pixel-text text-xs font-bold">NEXT UP</div>
              <p className="font-pixel-text text-gray-500 font-bold mb-2">下一組準備：</p>
              <h3 className="text-xl font-pixel-title">{currentEx.name}</h3>
              <p className="text-sm font-bold text-[#FF69B4] mt-1">第 {currentSet}/{currentEx.sets} 組</p>
           </div>

           <div className="z-10">
              <div className="text-8xl font-pixel-title text-white drop-shadow-[4px_4px_0px_#000]" style={{ WebkitTextStroke: '2px black' }}>
                {timer}
              </div>
              <p className="font-pixel-text font-bold text-black mt-2 animate-pulse">喝口水吧！💧</p>
           </div>

           <PixelButton size="lg" variant="secondary" className="w-full max-w-xs z-10" onClick={skipRest}>
             跳過休息 SKIP {'>>'}
           </PixelButton>
        </div>
      );
    }

    // --- RENDER: PREP PHASE OVERLAY ---
    if (playPhase === 'PREP') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FF69B4] relative">
           <h2 className="text-5xl font-pixel-title text-white drop-shadow-[4px_4px_0px_#000] mb-8 animate-bounce">
             GET READY!
           </h2>
           <div className="text-9xl font-pixel-title text-[#CCFF00] drop-shadow-[6px_6px_0px_#000]" style={{ WebkitTextStroke: '3px black' }}>
             {timer}
           </div>
           <p className="mt-8 font-pixel-text font-bold text-white bg-black px-4 py-1 text-xl">
             {currentEx.name}
           </p>
        </div>
      );
    }

    // --- RENDER: WORKOUT PHASE ---
    return (
      <div className="min-h-screen flex flex-col relative bg-[#f0f0f0]">
        {/* Header */}
        <div className="bg-[#1a1a1a] p-4 text-white flex justify-between items-center pixel-shadow z-10 border-b-4 border-[#FF69B4]">
          <div className="flex flex-col">
              <span className="font-pixel-text font-bold text-xs text-gray-400">PROGRESS</span>
              <span className="font-pixel-text font-bold text-lg">
                  動作 {currentExerciseIndex + 1}/{routine.length}
              </span>
          </div>
          <div className="flex flex-col items-end">
              <span className="font-pixel-text font-bold text-xs text-[#00FFFF]">CURRENT SET</span>
              <span className="font-pixel-text font-bold text-lg">
                  第 {currentSet}/{currentEx.sets} 組
              </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-300">
            <div className="h-full bg-[#CCFF00]" style={{ width: `${progressPercent}%` }}></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 pb-20">
           <h2 className="text-2xl md:text-3xl font-pixel-title text-center leading-tight text-gray-800 drop-shadow-sm px-2">
               {currentEx.name}
           </h2>
           
           {/* Visual Area */}
           <div className="w-64 h-64 bg-white pixel-border flex items-center justify-center relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] border-[#FF69B4]">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/400/400?grayscale')] opacity-20 bg-cover"></div>
              <PixelAvatar mood={'strict'} />
              <div className="absolute top-2 right-2 animate-pulse text-red-500 font-pixel-title bg-white px-1 border-2 border-red-500 text-xs shadow-sm">REC</div>
           </div>

           {/* Timer / Tips */}
           <div className="w-full max-w-xs text-center">
             <span className={`text-7xl font-pixel-title drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-[#FF69B4]'}`} style={{ WebkitTextStroke: '2px black' }}>
                {timer}
             </span>
             
             <div className="mt-6 h-16 flex items-center justify-center">
                <p className="font-pixel-text text-xl animate-bounce font-bold text-[#00FFFF] bg-black inline-block px-2 py-1 rotate-1 border-2 border-white">
                    {currentEx.gyaruTip}
                </p>
             </div>
             
             {/* Skip current exercise button */}
             <button 
                onClick={handlePhaseComplete}
                className="mt-8 text-xs font-bold text-gray-400 underline hover:text-black font-pixel-text"
             >
                這太簡單了，直接跳過 (SKIP)
             </button>
           </div>
        </div>
      </div>
    );
  };

  // --- VIEW: SUCCESS ---
  const renderSuccess = () => (
    <div className="min-h-screen bg-[#FF69B4] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="animate-bounce mb-8 relative z-10">
        <PixelAvatar mood="happy" />
      </div>
      
      <PixelCard className="bg-white p-8 w-full max-w-sm space-y-6 transform rotate-1 z-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)]">
        <h1 className="text-4xl font-pixel-title text-[#CCFF00]" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0 #000' }}>
          LEVEL UP！
        </h1>
        <p className="font-pixel-text text-xl font-bold">
          太神啦！任務完成！✨ <br/>
          姿勢進化中！
        </p>
        
        <div className="bg-gray-100 p-4 border-2 border-dashed border-gray-400">
          <p className="font-pixel-text text-gray-500 text-sm mb-1 font-bold">獲得戰利品 LOOT</p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-4xl bg-white p-1 pixel-border">🎀</span>
            <span className="font-pixel-title text-sm text-[#FF69B4] ml-2">ギャルリボン</span>
          </div>
        </div>

        <PixelButton size="lg" className="w-full" onClick={() => setView('FEEDBACK')}>
          填寫回饋 FEEDBACK 📝
        </PixelButton>
      </PixelCard>
    </div>
  );

  // --- VIEW: FEEDBACK ---
  const renderFeedback = () => {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center max-w-md mx-auto pt-10">
        <h2 className="text-2xl font-pixel-title mb-6 text-[#FF69B4] bg-white px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            本次回饋 REVIEW
        </h2>
        
        <div className="w-full space-y-6">
            {/* Difficulty */}
            <div className="space-y-2">
                <label className="font-pixel-text font-bold text-lg block">強度如何？Difficulty</label>
                <div className="flex gap-2">
                    {[
                        {v: 'TOO_EASY', t: '太簡單 😴'},
                        {v: 'PERFECT', t: '剛剛好 ✨'},
                        {v: 'TOO_HARD', t: '太難了 💀'}
                    ].map(opt => (
                        <button 
                            key={opt.v}
                            onClick={() => setFeedbackInput({...feedbackInput, difficulty: opt.v as any})}
                            className={`flex-1 p-2 pixel-border font-bold text-sm ${feedbackInput.difficulty === opt.v ? 'bg-[#00FFFF]' : 'bg-white'}`}
                        >
                            {opt.t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feeling After */}
            <div className="space-y-2">
                <label className="font-pixel-text font-bold text-lg block">現在感覺？Feeling</label>
                <div className="flex gap-2">
                    {[
                        {v: 'RELAXED', t: '鬆開了 😌'},
                        {v: 'TIRED', t: '好累 💦'},
                        {v: 'PAIN', t: '有點痛 🚑'}
                    ].map(opt => (
                        <button 
                            key={opt.v}
                            onClick={() => setFeedbackInput({...feedbackInput, feelingAfter: opt.v as any})}
                            className={`flex-1 p-2 pixel-border font-bold text-sm ${feedbackInput.feelingAfter === opt.v ? 'bg-[#CCFF00]' : 'bg-white'}`}
                        >
                            {opt.t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
                <label className="font-pixel-text font-bold text-lg block">給教練的話 Memo</label>
                <textarea 
                    className="w-full h-24 pixel-border p-2 font-pixel-text font-bold bg-[#FFEFF7]"
                    placeholder="例如：脖子有好一點了..."
                    value={feedbackInput.comment || ''}
                    onChange={(e) => setFeedbackInput({...feedbackInput, comment: e.target.value})}
                />
            </div>

            <PixelButton size="lg" className="w-full mt-8" onClick={() => {
                // Save Logic (Mock)
                const newLog: DailyLog = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    durationMin: checkIn.availableTimeMin || 15,
                    exercisesCompleted: routine.length,
                    feedback: feedbackInput as PostWorkoutFeedback
                };
                setHistory([newLog, ...history]);
                setStreak(s => s + 1);
                setView('SPLASH');
            }}>
                完成紀錄 SUBMIT ✅
            </PixelButton>
        </div>
      </div>
    );
  };

  // --- VIEW: MY ROOM (Replaces History) ---
  const renderMyRoom = () => {
    return (
        <div className="min-h-screen p-4 flex flex-col items-center max-w-md mx-auto pt-6 bg-[#FFEFF7]">
            <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-2xl font-pixel-title text-black bg-[#CCFF00] px-2 py-1 pixel-shadow-sm border-2 border-black transform -rotate-1">
                    MY ROOM 🏠
                </h2>
                <button onClick={() => setView('SPLASH')} className="font-pixel-text font-bold text-black border-2 border-black bg-white px-2 hover:bg-gray-200">
                    ❌ CLOSE
                </button>
            </div>

            {/* Tabs */}
            <div className="w-full flex mb-4 pixel-shadow border-2 border-black bg-white">
                <button 
                    onClick={() => setMyRoomTab('CLOSET')}
                    className={`flex-1 py-2 font-pixel-title text-sm ${myRoomTab === 'CLOSET' ? 'bg-[#FF69B4] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    CLOSET 👗
                </button>
                <div className="w-0.5 bg-black"></div>
                <button 
                    onClick={() => setMyRoomTab('LOG')}
                    className={`flex-1 py-2 font-pixel-title text-sm ${myRoomTab === 'LOG' ? 'bg-[#00FFFF] text-black' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    LOGS 📜
                </button>
            </div>

            {myRoomTab === 'CLOSET' ? (
                <div className="w-full">
                    {/* Avatar Preview */}
                    <div className="bg-white pixel-border p-6 mb-6 flex justify-center items-center shadow-lg relative">
                        <div className="absolute top-2 left-2 text-xs font-bold text-gray-400 font-pixel-text">YOU</div>
                        <PixelAvatar mood="happy" />
                        <div className="absolute bottom-2 right-2 bg-black text-[#00FFFF] text-xs px-2 py-0.5 font-bold font-pixel-text">Lv. 5</div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full">
                        {LOOT_DB.map(item => (
                            <div key={item.id} className={`aspect-square bg-white border-2 border-black flex flex-col items-center justify-center p-2 relative group ${!item.unlocked ? 'opacity-50 bg-gray-200' : 'cursor-pointer hover:bg-[#FFEFF7]'}`}>
                                <div className="text-3xl mb-1">{item.icon}</div>
                                {!item.unlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <span className="text-2xl">🔒</span>
                                    </div>
                                )}
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-black text-white text-xs p-2 rounded hidden group-hover:block z-20 font-pixel-text">
                                    <p className="text-[#CCFF00] font-bold">{item.name}</p>
                                    <p className="text-[10px] mt-1">{item.unlocked ? item.desc : `解鎖: ${item.unlockCondition}`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full space-y-4">
                    {/* RPG Quest Style Logs */}
                    {history.map(log => (
                        <div key={log.id} className="bg-white border-2 border-black p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative">
                             {/* Date Header */}
                            <div className="bg-gray-100 border-b-2 border-black px-3 py-1 flex justify-between items-center">
                                <span className="font-pixel-text font-bold text-xs">{new Date(log.date).toLocaleDateString()}</span>
                                <span className="text-xs font-bold bg-[#FF69B4] text-white px-1 rounded-sm">COMPLETED</span>
                            </div>
                            <div className="p-3 flex items-center justify-between">
                                <div>
                                    <div className="font-pixel-title text-sm mb-1">每日訓練 Quest</div>
                                    <div className="font-pixel-text text-xs text-gray-500 font-bold">
                                        ⏱️ {log.durationMin} min | 💪 {log.exercisesCompleted} EXP
                                    </div>
                                </div>
                                <div className="text-2xl border-l-2 border-dashed border-gray-300 pl-3">
                                    {log.feedback?.feelingAfter === 'RELAXED' ? '😌' : log.feedback?.feelingAfter === 'PAIN' ? '🚑' : '✨'}
                                </div>
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <div className="text-center py-10 opacity-50 font-bold font-pixel-text">
                            冒險日誌是空的... <br/> Go Slay!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="scanlines text-gray-800 font-pixel-text">
      {view === 'SPLASH' && renderSplash()}
      {view === 'CHECK_IN' && renderCheckIn()}
      {view === 'ROUTINE_PREVIEW' && renderPreview()}
      {view === 'PLAYING' && renderPlaying()}
      {view === 'SUCCESS' && renderSuccess()}
      {view === 'FEEDBACK' && renderFeedback()}
      {view === 'HISTORY' && renderMyRoom()}
    </div>
  );
};

export default App;
