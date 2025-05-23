import { useState } from "react";

const ChatBot = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add the user's message to the conversation
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setIsLoading(true);

    try {
      console.log("Sending request with body:", { query: question });
      const response = await fetch("https://blakebot-1.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      console.log("Response status:", response.status);

      if (response.status === 500) {
        console.log("Received 500 error from API");
        // If a 500 error occurs, show the busy message
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "the LLM server is busy, try again." },
        ]);
      } else {
        const data = await response.json();
        console.log("Response data:", data);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.response },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      // For any error, also show the busy message
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "the LLM server is busy, try again." },
      ]);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className=" w-full h-[100dvh]   bg-back md:px-[10dvh] md:pt-[10dvh] md:pb-[5dvh] ">
      <div
        className="w-full h-full
       bg-border rounded-lg  pt-20 pb-10  md:p-8 flex flex-col justify-between"
      >
        {/* Header with picture and chatbot name */}
        <div className="w-full  mb-4 text-center">
          <img
            src="src/assets/mascot.jpg"
            alt="Blake Logo"
            className="w-24 h-24 mx-auto rounded-full"
          />
          <h1 className="text-4xl font-extrabold text-white mt-2">BLAKE</h1>
        </div>
        {/* Chat messages */}
        <div className=" h-full overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 w-full bg-gray-700 border border-gray-600 rounded-l-lg p-2 text-white focus:outline-none"
            placeholder="Type your question..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-pri text-white px-4 py-2 rounded-r-lg hover:bg-pink-400 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
