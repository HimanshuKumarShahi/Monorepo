import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Backend se live connection
const socket = io('http://localhost:5000');

// "Master Ji" Challenges
const CHALLENGES = [
  {
    id: 1, title: "1. The Adder", desc: "Do numbers (a, b) ka sum return karein.",
    template: "function add(a, b) {\n  \n}", testCall: "add(7, 8)", expected: 15
  },
  {
    id: 2, title: "2. Even Steven", desc: "Agar number even hai toh true, warna false.",
    template: "function isEven(n) {\n  \n}", testCall: "isEven(42)", expected: true
  },
  {
    id: 3, title: "3. String Master", desc: "String ko reverse karein.",
    template: "function reverseStr(str) {\n  \n}", testCall: "reverseStr('turborepo')", expected: "operobrut"
  }
];

function App() {

  const [leaderboard, setLeaderboard] = useState([]);

  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [myTotalScore, setMyTotalScore] = useState(0);
  
 
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [code, setCode] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [outputMsg, setOutputMsg] = useState({ type: '', text: '' });
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    
    socket.on('update_leaderboard', (data) => {
      setLeaderboard(data); 
    });

    return () => socket.off('update_leaderboard');
  }, []);


  useEffect(() => {
    if (isJoined && currentQIndex < CHALLENGES.length) {
      setCode(CHALLENGES[currentQIndex].template);
      setStartTime(Date.now());
      setOutputMsg({ type: '', text: '' });
    }
  }, [isJoined, currentQIndex]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (userName.trim() !== '') {
      setIsJoined(true);

      socket.emit('player_joined', { name: userName, score: 0 });
    }
  };


  const runCode = () => {
    const challenge = CHALLENGES[currentQIndex];
    try {
   
      const execScript = `
        ${code}
        return ${challenge.testCall};
      `;
      const result = new Function(execScript)();

      if (result === challenge.expected) {

        const timeTaken = (Date.now() - startTime) / 1000;
        const speedBonus = Math.max(0, 50 - Math.floor(timeTaken)); 
        const pointsEarned = 100 + speedBonus;
        const newTotal = myTotalScore + pointsEarned;
        
        setMyTotalScore(newTotal);
        setOutputMsg({ type: 'success', text: `Sahi Jawab! +${pointsEarned} Points!` });

        
        socket.emit('submit_score', { name: userName, score: newTotal });

        setTimeout(() => {
          if (currentQIndex + 1 < CHALLENGES.length) {
            setCurrentQIndex(currentQIndex + 1);
          } else {
            setGameFinished(true);
          }
        }, 2000);

      } else {
      
        setOutputMsg({ type: 'error', text: `Galat jawab! Try again!` });
      }
    } catch (err) {
      
      setOutputMsg({ type: 'error', text: `Syntax Error: ${err.message}` });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 font-sans p-6 relative">
      
   
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl font-black text-indigo-500 tracking-tighter">/-!</span>
          <h1 className="text-3xl font-bold tracking-widest text-white">
            CODE VERSE <span className="text-indigo-400">ARENA</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700 z-50">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-400">Socket Live</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
 
        <section className="lg:col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
          
          {!isJoined ? (
            <div className="p-12 flex flex-col justify-center items-center h-full">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to the Arena</h2>
              <form onSubmit={handleJoin} className="w-full max-w-md space-y-4">
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono" placeholder="Hacker Name..." required />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all">Start Coding</button>
              </form>
            </div>
          ) : gameFinished ? (
            <div className="p-12 flex flex-col justify-center items-center h-full text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2">Conquered!</h2>
              <p className="text-gray-400 mb-6 font-mono text-2xl">Total: <span className="text-indigo-400">{myTotalScore}</span></p>
            </div>
          ) : (
            <div className="flex flex-col h-full font-mono text-sm editor-ui">
              <div className="bg-[#0d1117] px-4 py-3 border-b border-gray-800 flex justify-between items-center text-indigo-400 font-bold">
                {CHALLENGES[currentQIndex].title}
              </div>
              <div className="p-4 bg-[#161b22] border-b border-gray-800 text-gray-300 text-xs">
                {CHALLENGES[currentQIndex].desc}
              </div>
              <div className="flex-1 relative bg-[#0d1117] p-4 text-[#56b6c2]">
                <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-full bg-transparent outline-none resize-none leading-loose" spellCheck="false"></textarea>
              </div>
              <div className="bg-[#161b22] border-t border-gray-800 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Terminal Output</span>
                  <button onClick={runCode} className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-6 rounded transition-all">▶ Run & Submit</button>
                </div>
                {outputMsg.text ? (
                  <div className={`p-3 rounded ${outputMsg.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                    {outputMsg.text}
                  </div>
                ) : (
                  <div className="p-3 text-gray-600 italic">Ready to execute... (Tests: {CHALLENGES[currentQIndex].testCall} will run)</div>
                )}
              </div>
            </div>
          )}
        </section>

     
        <section className="bg-[#161b22] border border-gray-800 rounded-2xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl">
          <div className="bg-[#0d1117] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center">⚡ Live Rank</h2>
            <span className="text-xs font-bold text-indigo-400">Real-time</span>
          </div>

 
          <div className="flex-1 p-4 overflow-y-auto space-y-2 leaderboard-list">
            {leaderboard.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 text-sm">
                Arena is empty.<br/>Be the first to join and score!
              </div>
            ) : (
              leaderboard.map((user, index) => {
                const isMe = user.name === userName;
                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isMe ? 'bg-indigo-600/20 border-indigo-500' : 'bg-[#0d1117] border-gray-800'}`}>
                    <div className="flex items-center space-x-3">
                      <span className={`font-black text-sm w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-600'}`}>#{index + 1}</span>
                      <span className={`text-sm font-medium ${isMe ? 'text-indigo-300' : 'text-gray-300'}`}>{user.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white font-mono">{user.score} PT</span>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>
      
      
      <div className="fixed bottom-4 right-6 text-gray-700 font-bold tracking-widest pointer-events-none select-none z-10">
        /-! CODE VERSE
      </div>
    </div>
  );
}

export default App;