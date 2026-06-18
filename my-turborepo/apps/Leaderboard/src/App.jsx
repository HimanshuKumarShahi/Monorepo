import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const CHALLENGES = [
  {
    id: 1,
    title: "1. The Adder (Warmup)",
    desc: "Ek function 'add' likho jo do numbers (a, b) le aur unka sum return kare.",
    template: "function add(a, b) {\n  // Apna logic yahan likho\n  \n}",
    testCall: "add(7, 8)",
    expected: 15,
    timeLimit: 45
  },
  {
    id: 2,
    title: "2. Even Steven (Logic Test)",
    desc: "Ek function 'isEven' likho. Agar number even hai toh true return karo, warna false.",
    template: "function isEven(n) {\n  // Apna logic yahan likho\n  \n}",
    testCall: "isEven(42)",
    expected: true,
    timeLimit: 60 
  },
  {
    id: 3,
    title: "3. String Master (Final Boss)",
    desc: "Ek function 'reverseStr' likho jo kisi bhi string ko ulta (reverse) kar de.",
    template: "function reverseStr(str) {\n  // Apna logic yahan likho\n  \n}",
    testCall: "reverseStr('turborepo')",
    expected: "operobrut",
    timeLimit: 120
  }
];

function App() {
  
  const [leaderboard, setLeaderboard] = useState([]);

  const [userName, setUserName] = useState(localStorage.getItem('arena_user') || '');
  const [isJoined, setIsJoined] = useState(localStorage.getItem('arena_joined') === 'true');
  const [myTotalScore, setMyTotalScore] = useState(Number(localStorage.getItem('arena_score')) || 0);
  const [currentQIndex, setCurrentQIndex] = useState(Number(localStorage.getItem('arena_step')) || 0);
  const [gameFinished, setGameFinished] = useState(localStorage.getItem('arena_finished') === 'true');

  
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [outputMsg, setOutputMsg] = useState({ type: '', text: '' });

  
  useEffect(() => {
    socket.on('update_leaderboard', (data) => {
      setLeaderboard(data);
    });

  
    if (isJoined && userName) {
      socket.emit('player_joined', { name: userName, score: myTotalScore });
    }

    return () => socket.off('update_leaderboard');
  }, []);

   
  useEffect(() => {
    if (isJoined && !gameFinished && currentQIndex < CHALLENGES.length) {
      setCode(CHALLENGES[currentQIndex].template);
      setTimeLeft(CHALLENGES[currentQIndex].timeLimit);
      setOutputMsg({ type: '', text: '' });
    }
  }, [isJoined, currentQIndex, gameFinished]);

  
  useEffect(() => {
    if (!isJoined || gameFinished || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isJoined, gameFinished, timeLeft]);

  
  const saveProgress = (step, score, isFinished) => {
    localStorage.setItem('arena_step', step);
    localStorage.setItem('arena_score', score);
    localStorage.setItem('arena_finished', isFinished);
    
  
    socket.emit('submit_score', { name: userName, score: score });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (userName.trim() !== '') {
      setIsJoined(true);
      localStorage.setItem('arena_user', userName);
      localStorage.setItem('arena_joined', 'true');
      socket.emit('player_joined', { name: userName, score: 0 });
    }
  };

  
  const handleTimeOut = () => {
    setOutputMsg({ type: 'error', text: '⏱️ Time Up! 0 Points. Moving to next challenge...' });
    
    setTimeout(() => {
      moveToNextChallenge(myTotalScore);
    }, 2000);
  };

  
  const runCode = () => {
    if (timeLeft <= 0) return;

    const challenge = CHALLENGES[currentQIndex];
    try {
      const execScript = `
        ${code}
        return ${challenge.testCall};
      `;
      const result = new Function(execScript)();

      if (result === challenge.expected) {
        
        const timeTaken = challenge.timeLimit - timeLeft;
        const speedBonus = timeLeft; 
        const pointsEarned = 100 + speedBonus;
        const newTotal = myTotalScore + pointsEarned;
        
        setMyTotalScore(newTotal);
        setOutputMsg({ type: 'success', text: `Sahi Jawab! Sawaal ${timeTaken} sec me kiya. +${pointsEarned} Points!` });

        setTimeout(() => moveToNextChallenge(newTotal), 2000);
      } else {
 
        setOutputMsg({ type: 'error', text: `Galat jawab! Expected '${challenge.expected}' but got '${result}'.` });
      }
    } catch (err) {
      setOutputMsg({ type: 'error', text: `Syntax Error: ${err.message}` });
    }
  };

  const moveToNextChallenge = (newTotalScore) => {
    if (currentQIndex + 1 < CHALLENGES.length) {
      const nextStep = currentQIndex + 1;
      setCurrentQIndex(nextStep);
      saveProgress(nextStep, newTotalScore, false);
    } else {
      setGameFinished(true);
      saveProgress(currentQIndex, newTotalScore, true);
    }
  };

 
  const restartGame = () => {
    localStorage.clear();
    setUserName('');
    setIsJoined(false);
    setMyTotalScore(0);
    setCurrentQIndex(0);
    setGameFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 font-sans p-6">
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl font-black text-indigo-500 tracking-tighter">/-!</span>
          <h1 className="text-3xl font-bold tracking-widest text-white">
            CODE VERSE <span className="text-indigo-400">ARENA</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-400">Socket Live</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <section className="lg:col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
          
          {!isJoined ? (
            <div className="p-12 flex flex-col justify-center items-center h-full">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to the Arena</h2>
              <p className="text-gray-400 mb-8 text-center">Fastest and most accurate code wins. Ready?</p>
              <form onSubmit={handleJoin} className="w-full max-w-md space-y-4">
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  placeholder="Enter Hacker Name..."
                  required
                />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all">
                  Start Coding
                </button>
              </form>
            </div>
          ) : gameFinished ? (
            <div className="p-12 flex flex-col justify-center items-center h-full text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2">Arena Conquered!</h2>
              <p className="text-gray-400 mb-6">Total Score: <span className="text-indigo-400 font-bold text-2xl">{myTotalScore}</span></p>
              <button onClick={restartGame} className="text-sm text-gray-500 hover:text-white underline underline-offset-4">
                Clear Storage & Play Again
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="bg-[#0d1117] px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                <span className="text-sm font-bold text-indigo-400 font-mono">
                  {CHALLENGES[currentQIndex].title}
                </span>
                
 
                <span className={`text-sm font-black px-3 py-1 rounded font-mono border ${timeLeft <= 10 ? 'bg-red-900/30 text-red-500 border-red-500/50 animate-pulse' : 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                  ⏱️ {timeLeft}s
                </span>
              </div>
              
              <div className="p-4 bg-[#161b22] border-b border-gray-800">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {CHALLENGES[currentQIndex].desc}
                </p>
              </div>

              <div className="flex-1 relative bg-[#0d1117] p-4 font-mono text-sm">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={timeLeft <= 0}
                  className="w-full h-full bg-transparent text-[#56b6c2] outline-none resize-none leading-loose disabled:opacity-50"
                  spellCheck="false"
                ></textarea>
              </div>

              <div className="bg-[#161b22] border-t border-gray-800 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Terminal Output</span>
                  <button 
                    onClick={runCode}
                    disabled={timeLeft <= 0}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-400 text-white text-sm font-bold py-2 px-6 rounded transition-all flex items-center"
                  >
                    ▶ Run & Submit
                  </button>
                </div>
                {outputMsg.text ? (
                  <div className={`p-3 rounded font-mono text-sm ${outputMsg.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                    {outputMsg.text}
                  </div>
                ) : (
                  <div className="p-3 text-gray-600 font-mono text-sm italic">
                    Ready to execute... (Tests: {CHALLENGES[currentQIndex].testCall} will run)
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="bg-[#161b22] border border-gray-800 rounded-2xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl">
          <div className="bg-[#0d1117] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center">
              <span className="text-yellow-500 mr-2">⚡</span> Live Rank
            </h2>
            <span className="text-xs font-bold text-indigo-400">Real-time</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
            {leaderboard.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 text-sm">
                Arena is empty.<br/>Be the first to join and score!
              </div>
            ) : (
              leaderboard.map((user, index) => {
                const isMe = user.name === userName;
                return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isMe ? 'bg-indigo-600/20 border-indigo-500' : 'bg-[#0d1117] border-gray-800'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`font-black text-sm w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                        #{index + 1}
                      </span>
                      <span className={`text-sm font-medium ${isMe ? 'text-indigo-300' : 'text-gray-300'}`}>
                        {user.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white font-mono">
                      {user.score}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;