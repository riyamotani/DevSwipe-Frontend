import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../utils/constants";

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const user = useSelector(state => state.user)
    const userId = user?._id
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const fetchChat = async () => {
        try {
            setIsLoading(true)
            const chat = await axios.get(`${baseUrl}/chat/${targetUserId}`, {
                withCredentials: true
            })

            const chatMessages = chat?.data?.messages.map((msg) => {
                return { 
                    firstName: msg?.senderId?.firstName, 
                    lastName: msg?.senderId?.lastName, 
                    text: msg?.text,
                    timestamp: msg?.createdAt || new Date().toISOString()
                }
            });
            setMessages(chatMessages)
        } catch (error) {
            console.error("Error fetching chat:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        console.log("here")
        fetchChat();
    },[])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (!user) return
        const socket = createSocketConnection()
        console.log(userId, targetUserId, "ids")
        socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId })

        socket.on("messageReceived", ({ firstName, lastName, text }) => {
            console.log(firstName, text);
            setMessages((messages) => [...messages, { 
                firstName, 
                lastName, 
                text,
                timestamp: new Date().toISOString()
            }])
        })

        return () => {
            socket.disconnect();
        };
    }, [userId, targetUserId])

    const sendMessage = async () => {
        if (!newMessage.trim() || isSending) return
        
        try {
            setIsSending(true)
            const socket = createSocketConnection()
            socket.emit("sendMessage", { 
                firstName: user.firstName,
                lastName: user.lastName, 
                userId, 
                targetUserId, 
                text: newMessage.trim() 
            })
            setNewMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ""
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    if (isLoading) {
        return (
            <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4 text-gray-400">Loading chat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col bg-base-200 rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-600 bg-base-300 rounded-t-lg">
                <h1 className="text-xl font-semibold text-white">Chat</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <div className="text-6xl mb-4">💬</div>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwnMessage = user.firstName === msg.firstName
                        return (
                            <div
                                key={index}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                    <div className={`chat ${isOwnMessage ? 'chat-end' : 'chat-start'}`}>
                                        <div className="chat-header text-xs opacity-70">
                                            {`${msg.firstName} ${msg.lastName ? msg.lastName : ""}`}
                                            {msg.timestamp && (
                                                <time className="text-xs opacity-50 ml-1">{formatTime(msg.timestamp)}</time>
                                            )}
                                        </div>
                                        <div className={`chat-bubble ${isOwnMessage ? 'chat-bubble-primary' : 'chat-bubble-accent'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-600 bg-base-300 rounded-b-lg">
                <div className="flex items-center gap-3">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-500 text-white rounded-lg p-3 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isSending}
                    />
                    <button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim() || isSending}
                        className="btn btn-primary px-6"
                    >
                        {isSending ? (
                            <div className="loading loading-spinner loading-sm"></div>
                        ) : (
                            "Send"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat