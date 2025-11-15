'use client';
import React, { useState } from 'react';
import { Send, Heart, MessageCircle } from 'lucide-react';

interface MessageSectionProps {
  postId: string;
}

const MessageSection: React.FC<MessageSectionProps> = ({}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'あやか',
      content: 'いつも癒されてます！今日も素敵な日記をありがとう💕',
      time: '2時間前',
      likes: 12,
      isFromCast: false,
    },
    {
      id: 2,
      author: 'みく',
      content: 'あやかちゃんありがとう！そう言ってもらえて嬉しいです🍓',
      time: '1時間前',
      likes: 8,
      isFromCast: true,
    },
    {
      id: 3,
      author: 'たかし',
      content: '今度お話しできるのを楽しみにしてます！',
      time: '30分前',
      likes: 5,
      isFromCast: false,
    },
  ]);

  const quickMessages = [
    'いつもありがとう💕',
    '癒されました🌸',
    '元気もらいました⚡',
    '応援してます👏',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        author: 'あなた',
        content: message,
        time: 'たった今',
        likes: 0,
        isFromCast: false,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">メッセージ</h3>
        <p className="text-sm text-gray-600 sm:text-base">温かいメッセージを送ってみませんか？</p>
      </div>

      {/* Quick Messages */}
      <div className="mb-4 sm:mb-6">
        <p className="mb-2 text-xs text-gray-600 sm:mb-3 sm:text-sm">クイック投稿</p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {quickMessages.map((msg, index) => (
            <button
              key={index}
              onClick={() => setMessage(msg)}
              className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700 transition-colors hover:bg-pink-200 sm:px-3 sm:py-2 sm:text-sm"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      {/* Message Form */}
      <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力してください..."
              className="w-full resize-none rounded-lg border border-pink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 sm:px-4 sm:py-3 sm:text-base"
              rows={3}
              maxLength={500}
            />
            <div className="mt-1 text-xs text-gray-500">{message.length}/500文字</div>
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="self-start rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3"
          >
            <Send size={16} className="sm:h-5 sm:w-5" />
          </button>
        </div>
      </form>

      {/* Messages List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <MessageCircle size={16} className="text-gray-600 sm:h-5 sm:w-5" />
          <span className="text-sm text-gray-600 sm:text-base">
            {messages.length}件のメッセージ
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg p-3 sm:p-4 ${msg.isFromCast ? 'border border-pink-200 bg-pink-50' : 'bg-gray-50'}`}
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm ${msg.isFromCast ? 'bg-pink-500' : 'bg-gray-500'}`}
                >
                  {msg.author[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 sm:text-base">{msg.author}</p>
                  <p className="text-xs text-gray-500">{msg.time}</p>
                </div>
                {msg.isFromCast && (
                  <span className="rounded-full bg-pink-500 px-2 py-1 text-xs text-white">
                    キャスト
                  </span>
                )}
              </div>
              <button className="flex items-center gap-1 text-gray-500 transition-colors hover:text-pink-600">
                <Heart size={12} className="sm:h-3.5 sm:w-3.5" />
                <span className="text-xs sm:text-sm">{msg.likes}</span>
              </button>
            </div>
            <p className="text-sm text-gray-700 sm:text-base">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSection;
