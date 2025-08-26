import { useState, useRef, useEffect } from 'react';
import { Clipboard } from 'react-native';
import api from '@api/index';

const useAiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [showPrintOption, setShowPrintOption] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const flatListRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const states = {
    messages,
    setMessages,
    inputText,
    setInputText,
    isLoading,
    setIsLoading,
    typingMessageId,
    setTypingMessageId,
    showPrintOption,
    setShowPrintOption,
    copiedMessageId,
    setCopiedMessageId,
  };

  const WORD_COUNT_THRESHOLD = 20;

  // Function to clear any active typing intervals
  const clearTypingInterval = () => {
    if (typingIntervalRef.current) {
      clearTimeout(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const typeWriterEffect = (fullText, messageId) => {
    clearTypingInterval(); // Ensure no other typing is running
    const wordCount = fullText.trim().split(/\s+/).length;
    if (wordCount > WORD_COUNT_THRESHOLD) {
      setShowPrintOption(messageId);
    }

    let currentText = '';
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        currentIndex++;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, text: currentText } : msg,
          ),
        );
        typingIntervalRef.current = setTimeout(typeNextChar, 20);
      } else {
        setTypingMessageId(null);
        setShowPrintOption(null);
        clearTypingInterval();
      }
    };
    typeNextChar();
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    clearTypingInterval();

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText.trim();
    setInputText('');
    setIsLoading(true);

    setTimeout(() => scrollToBottom(), 100);

    try {
      const response = await api.AI.getAiResponse({
        data: { prompt: messageToSend },
      });
      const aiResponseText = response?.data.data?.reply;
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMessageId,
        text: '',
        isUser: false,
        timestamp: new Date(),
        fullText: aiResponseText,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setTypingMessageId(aiMessageId);
      setTimeout(() => typeWriterEffect(aiResponseText, aiMessageId), 300);
    } catch (error) {
      console.log('AI Response Error:', error);
      setIsLoading(false);
      setTypingMessageId(null);
    }
  };

  const printFullMessage = messageId => {
    clearTypingInterval();
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, text: msg.fullText } : msg,
      ),
    );
    setTypingMessageId(null);
    setShowPrintOption(null);
    setTimeout(() => scrollToBottom(), 50);
  };

  const stopTyping = () => {
    clearTypingInterval();
    setTypingMessageId(null);
    setShowPrintOption(null);
  };

  const handleCopy = (text: string, messageId: string) => {
    Clipboard.setString(text);
    setCopiedMessageId(messageId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  useEffect(() => {
    return () => clearTypingInterval();
  }, []);

  return {
    states,
    flatListRef,
    sendMessage,
    printFullMessage,
    stopTyping,
    handleCopy,
  };
};

export default useAiAssistant;
