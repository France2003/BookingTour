import { useState } from "react";
import Zalo from "../../assets/image/z6507068902869_8d70675bc38abc07b05dea469633c769.jpg";

export default function ChatBubble() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setShowModal(!showModal)}
        className="relative flex items-center px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-400 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <span className="mr-2 font-semibold">Chat</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6l-4 3V5z" />
        </svg>
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
      </button>
      {showModal && (
        <div className="absolute bottom-14 right-0 mb-2 bg-white rounded-xl p-4 shadow-lg w-64 animate-fadeIn z-50">
          <h3 className="text-base font-semibold text-blue-600 mb-2 text-center">Liên hệ với tôi</h3>
          <img
            src={Zalo}
            alt="QR Zalo"
            className="w-full h-auto rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}
