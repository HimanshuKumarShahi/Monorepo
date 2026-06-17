import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Backend se connect karna
const socket = io("http://localhost:5000");

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Current mouse position store karne ke liye
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Canvas ko full screen set karna
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80; // Navbar height minus kiya

    // Dusre users ka drawing data receive karna
    const onDrawEvent = (data) => {
      drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false);
    };

    socket.on("draw", onDrawEvent);

    return () => {
      socket.off("draw", onDrawEvent);
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, color, emit) => {
    const context = canvasRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.lineCap = "round";
    context.stroke();
    context.closePath();

    if (!emit) return;

    // Apna drawing data server ko bhejna
    socket.emit("draw", { x0, y0, x1, y1, color });
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    currentPos.current.x = e.clientX;
    currentPos.current.y = e.clientY - 80; // Offset for navbar
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const x = e.clientX;
    const y = e.clientY - 80;

    drawLine(currentPos.current.x, currentPos.current.y, x, y, "#4F46E5", true);
    currentPos.current.x = x;
    currentPos.current.y = y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* /-! CODE VERSE Branding Navbar */}
      <nav className="h-[80px] bg-gray-900 p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-4xl font-black text-indigo-500 tracking-tighter">
            /-!
          </span>
          <h1 className="text-2xl font-bold tracking-widest text-gray-200">
            CODE VERSE{" "}
            <span className="text-sm font-normal text-gray-400">BOARD</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-400">Live Sync</span>
        </div>
      </nav>

      {/* Drawing Canvas Area */}
      <main className="flex-1 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="bg-white shadow-inner"
        />
      </main>
    </div>
  );
}

export default App;
