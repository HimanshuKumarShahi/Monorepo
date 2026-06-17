import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const COLORS = [
  "#E5E7EB",
  "#EF4444",
  "#22C55E",
  "#3B82F6",
  "#EAB308",
  "#A855F7",
];
const BRUSH_SIZES = [2, 4, 8];

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[0]);

  const [textInput, setTextInput] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onDrawEvent = (data) => {
      if (data.type === "line") {
        drawLine(
          data.x0,
          data.y0,
          data.x1,
          data.y1,
          data.color,
          data.size,
          data.isEraser,
          false,
        );
      } else if (data.type === "text") {
        renderTextOnCanvas(data.text, data.x, data.y, data.color, false);
      }
    };

    socket.on("draw", onDrawEvent);

    return () => {
      socket.off("draw", onDrawEvent);
    };
  }, []);

  const drawLine = (
    x0,
    y0,
    x1,
    y1,
    strokeColor,
    lineWidth,
    isEraserMode,
    emit,
  ) => {
    const context = canvasRef.current.getContext("2d");

    context.globalCompositeOperation = isEraserMode
      ? "destination-out"
      : "source-over";

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = isEraserMode ? "rgba(0,0,0,1)" : strokeColor;
    context.lineWidth = isEraserMode ? 30 : lineWidth;
    context.lineCap = "round";
    context.stroke();
    context.closePath();

    context.globalCompositeOperation = "source-over";

    if (!emit) return;
    socket.emit("draw", {
      type: "line",
      x0,
      y0,
      x1,
      y1,
      color: strokeColor,
      size: lineWidth,
      isEraser: isEraserMode,
    });
  };

  const renderTextOnCanvas = (text, x, y, textColor, emit) => {
    const context = canvasRef.current.getContext("2d");
    context.font = "18px monospace";
    context.fillStyle = textColor;
    context.textBaseline = "top";

    const lines = text.split("\n");
    lines.forEach((line, i) => {
      context.fillText(line, x, y + i * 24);
    });

    if (!emit) return;
    socket.emit("draw", { type: "text", text, x, y, color: textColor });
  };

  const handleMouseDown = (e) => {
    if (tool === "code") {
      setTextInput({ visible: true, x: e.clientX, y: e.clientY, text: "" });
      return;
    }

    setIsDrawing(true);
    currentPos.current.x = e.clientX;
    currentPos.current.y = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool === "code") return;

    const x = e.clientX;
    const y = e.clientY;

    drawLine(
      currentPos.current.x,
      currentPos.current.y,
      x,
      y,
      color,
      brushSize,
      tool === "eraser",
      true,
    );

    currentPos.current.x = x;
    currentPos.current.y = y;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const commitCodeToCanvas = () => {
    if (textInput.text.trim() !== "") {
      renderTextOnCanvas(textInput.text, textInput.x, textInput.y, color, true);
    }
    setTextInput({ visible: false, x: 0, y: 0, text: "" });
  };

  return (
    <div className="min-h-screen bg-[#121212] overflow-hidden font-sans text-white select-none">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#232329] border border-[#303038] shadow-2xl rounded-xl p-2 flex items-center gap-2 z-50">
        <button
          onClick={() => setTool("pen")}
          className={`p-3 rounded-lg flex items-center justify-center transition-colors ${tool === "pen" ? "bg-indigo-600/20 text-indigo-400" : "hover:bg-[#303038] text-gray-400"}`}
          title="Pen"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        </button>

        <button
          onClick={() => setTool("code")}
          className={`p-3 rounded-lg flex items-center justify-center transition-colors ${tool === "code" ? "bg-indigo-600/20 text-indigo-400" : "hover:bg-[#303038] text-gray-400"}`}
          title="Code / Text"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>

        <div className="w-px h-8 bg-gray-700 mx-1"></div>

        <button
          onClick={() => setTool("eraser")}
          className={`p-3 rounded-lg flex items-center justify-center transition-colors ${tool === "eraser" ? "bg-red-500/20 text-red-400" : "hover:bg-[#303038] text-gray-400"}`}
          title="Eraser"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
            <path d="M22 21H7" />
            <path d="m5 11 9 9" />
          </svg>
        </button>
      </div>

      {tool !== "eraser" && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#232329] border border-[#303038] shadow-2xl rounded-xl p-4 flex flex-col gap-6 z-50">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">
              Stroke
            </p>
            <div className="grid grid-cols-2 gap-2 w-[80px]">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-md transition-all ${color === c ? "ring-2 ring-indigo-500 scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {tool === "pen" && (
            <>
              <div className="w-full h-px bg-[#303038]"></div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">
                  Thickness
                </p>
                <div className="flex justify-between items-center px-1">
                  {BRUSH_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`flex items-center justify-center rounded transition-all ${brushSize === size ? "bg-[#303038]" : "hover:bg-[#2a2a32]"}`}
                      style={{ width: "28px", height: "28px" }}
                    >
                      <div
                        className="bg-gray-300 rounded-full"
                        style={{ width: size + 2, height: size + 2 }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {textInput.visible && (
        <textarea
          autoFocus
          value={textInput.text}
          onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
          onBlur={commitCodeToCanvas}
          className="absolute z-40 bg-transparent font-mono text-[18px] outline-none border border-indigo-500/50 rounded p-1 resize-none overflow-hidden"
          style={{
            left: textInput.x,
            top: textInput.y,
            color: color,
            minWidth: "200px",
            minHeight: "100px",
            lineHeight: "24px",
          }}
          placeholder="Write code and click outside to place it..."
        />
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        className={`absolute inset-0 ${tool === "pen" ? "cursor-crosshair" : tool === "code" ? "cursor-text" : "cursor-cell"}`}
      />

     
      <div className="absolute bottom-4 right-6 text-gray-600 font-bold tracking-widest pointer-events-none select-none">
        /-! CODE VERSE
      </div>
    </div>
  );
}

export default App;
