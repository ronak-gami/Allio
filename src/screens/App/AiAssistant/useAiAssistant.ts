import { useState, useRef, useEffect } from 'react';
import api from '@api/index';

const useAiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [showPrintOption, setShowPrintOption] = useState(null); // New state for the print button
  const flatListRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const WORD_COUNT_THRESHOLD = 50; // Set to 500 for production

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const typeWriterEffect = (fullText, messageId) => {
    // Check word count and show the "Print All" button if necessary
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

        setTimeout(() => scrollToBottom(), 50);
        typingIntervalRef.current = setTimeout(typeNextChar, 30);
      } else {
        // Typing finished, hide the button
        setTypingMessageId(null);
        setShowPrintOption(null);
      }
    };

    typeNextChar();
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

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
        fullText: aiResponseText, // Store the full message
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setTypingMessageId(aiMessageId);

      setTimeout(() => {
        typeWriterEffect(aiResponseText, aiMessageId);
      }, 300);
    } catch (error) {
      console.log('AI Response Error:', error);
      setIsLoading(false);
    }
  };

  // New function to print the full message
  const printFullMessage = messageId => {
    if (typingIntervalRef.current) {
      clearTimeout(typingIntervalRef.current);
    }

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, text: msg.fullText } : msg,
      ),
    );

    setTypingMessageId(null);
    setShowPrintOption(null);
    setTimeout(() => scrollToBottom(), 50);
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearTimeout(typingIntervalRef.current);
      }
    };
  }, []);

  return {
    messages,
    inputText,
    isLoading,
    typingMessageId,
    showPrintOption, // Export new state
    flatListRef,
    setInputText,
    sendMessage,
    printFullMessage, // Export new function
  };
};

export default useAiAssistant;
