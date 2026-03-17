'use client';
import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { getCommentsByPostId, postComment } from '@/lib/actions/diary-comment';

interface MessageSectionProps {
  postId: string;
  isEnabled?: boolean;
}

const MessageSection: React.FC<MessageSectionProps> = ({ postId, isEnabled = true }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const result = await getCommentsByPostId(postId);
      if (result.success && result.data) {
        setMessages(result.data);
      }
      setIsLoading(false);
    };
    fetchComments();
  }, [postId]);

  const quickMessages = [
    'いつもありがとう💕',
    '癒されました🌸',
    '元気もらいました⚡',
    '応援してます👏',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const result = await postComment(postId, 'あなた', message);
      if (result.success && result.data) {
        setMessages([...messages, result.data]);
        setMessage('');
      } else {
        alert('メッセージの投稿に失敗しました');
      }
    }
  };

  if (!isEnabled) {
    return null;
  }

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

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">まだメッセージはありません</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-lg bg-gray-50 p-3 sm:p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
                    {(msg.author_name || '匿')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 sm:text-base">
                      {msg.author_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 sm:text-base">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageSection;
