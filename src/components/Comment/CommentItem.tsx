import React, { useState, useEffect } from 'react';
import { MessageCircle, MoreHorizontal, User, ChevronDown, ChevronRight } from "lucide-react";
import useAuthStore from "../../stores/AuthStore.ts";
import { Comment } from "../../types/Comment.ts";
import useComment from "../../hooks/useComment.ts";

type CommentProps = {
  comment: Comment;
  depth: number;
  productId: string;
  refreshComments: () => void;
}

export const CommentItem: React.FC<CommentProps> = ({ comment, depth, productId, refreshComments }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [childComments, setChildComments] = useState<Comment[]>([]);
  const [localNumberOfChildren, setLocalNumberOfChildren] = useState(comment.numberOfChildren);

  const { isLogin, user } = useAuthStore();
  const { isLoading: isUseCommentLoading, onRequestCreateComment, useFetchCommentByProductId } = useComment();

  // Fetch child comments only when needed
  const shouldFetchChildren = showReplies && localNumberOfChildren > 0;

  const { data: childData, isLoading: isLoadingChildren, refetch: refetchChildren } = useFetchCommentByProductId({
    productId: productId,
    parentId: comment.id,
    page: 0,
    perPage: 20
  });

  // Update child comments when data changes
  useEffect(() => {
    if (childData?.data) {
      setChildComments(childData.data);
    }
  }, [childData]);

  // Update local numberOfChildren when comment prop changes
  useEffect(() => {
    setLocalNumberOfChildren(comment.numberOfChildren);
  }, [comment.numberOfChildren]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
    return `${Math.floor(diff / 86400)} day(s) ago`;
  };

  // ✅ Hàm render content với xuống dòng
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // ✅ Hàm xử lý keydown cho reply textarea
  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        // Ctrl + Enter: Thêm xuống dòng thủ công
        e.preventDefault();
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Thêm \n vào vị trí cursor
        const newValue = replyContent.substring(0, start) + '\n' + replyContent.substring(end);
        setReplyContent(newValue);

        // Đặt lại vị trí cursor sau \n
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);

        console.log('Ctrl + Enter: New line added in reply');
      } else {
        // Enter: Submit reply
        e.preventDefault();
        if (replyContent.trim()) {
          handleReply();
        }
      }
    }
  };

  // ✅ Hàm xử lý onChange cho reply textarea
  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleReply = () => {
    if (!replyContent.trim()) return;

    // Create optimistic reply
    const optimisticReply: Comment = {
      id: `temp-${Date.now()}`,
      content: replyContent,
      images: [],
      parentId: comment.id,
      numberOfChildren: 0,
      user: user || { id: '', name: 'You', avatar: '' },
      createdAt: new Date().toISOString()
    };

    onRequestCreateComment(
      {
        productId: productId,
        content: replyContent,
        parentId: comment.id,
      },
      () => {
        setReplyContent('');
        setIsReplying(false);

        // Update local count immediately
        setLocalNumberOfChildren(prev => prev + 1);

        // Auto-show replies after successful reply
        setShowReplies(true);

        // Add optimistic reply immediately
        setChildComments(prev => [...prev, optimisticReply]);

        // Refetch to get real data and replace optimistic reply
        setTimeout(() => {
          refetchChildren();
        }, 500);

        // Refresh main comments to update counts
        refreshComments();
        console.log('Reply added successfully');
      },
      (error) => {
        console.error('Error adding reply:', error);
        // Remove optimistic reply on error
        setChildComments(prev => prev.filter(c => c.id !== optimisticReply.id));
      }
    );
  };

  const handleToggleReplies = () => {
    const newShowReplies = !showReplies;
    setShowReplies(newShowReplies);

    // If showing replies for the first time, fetch them
    if (newShowReplies && localNumberOfChildren > 0) {
      refetchChildren();
    }
  };

  const maxDepth = 5;
  const isMaxDepth = depth >= maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-4 md:ml-8' : ''} ${depth > 0 ? 'border-l-2 border-primary-dark/10 pl-4' : ''}`}>
      <div className="bg-white/20 rounded-lg p-4 mb-4 shadow-sm border border-primary-dark/10">
        {/* Header */}
        <div className="flex items-start space-x-3">
          {comment.user?.avatar ? (
            <img
              src={comment.user.avatar}
              alt={`${comment.user.name}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary-dark" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-primary-dark/90">
                {comment.user?.name || 'Anonymous'}
              </h4>
              <span className="text-sm text-primary-dark/50">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {/* ✅ Content với xuống dòng */}
            <div className="mt-2 text-gray-800 leading-relaxed whitespace-pre-wrap">
              {renderContent(comment.content)}
            </div>

            {/* Images */}
            {comment.images && comment.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {comment.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Attachment ${index + 1}`}
                    className="rounded-lg max-h-48 object-cover"
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 mt-3">
              {!isMaxDepth && isLogin && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center space-x-1 text-sm text-primary-dark/50 hover:text-pink-light transition-colors"
                  disabled={isUseCommentLoading}
                >
                  {isUseCommentLoading ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                  ) : (
                    <span>Reply</span>
                  )}
                </button>
              )}

              {/* Show/Hide Replies Button */}
              {localNumberOfChildren > 0 && (
                <button
                  onClick={handleToggleReplies}
                  className="flex items-center space-x-1 text-sm text-primary-dark/50 hover:text-pink-light transition-colors"
                  disabled={isLoadingChildren}
                >
                  {isLoadingChildren ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      {showReplies ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <MessageCircle className="w-4 h-4" />
                      <span>
                        {showReplies ? 'Hide' : 'Show'} {localNumberOfChildren} {localNumberOfChildren === 1 ? 'Reply' : 'Replies'}
                      </span>
                    </>
                  )}
                </button>
              )}

              <button className="text-primary-dark/40 hover:text-primary-dark/60">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Reply Input với Enter/Ctrl+Enter */}
        {isReplying && (
          <div className="mt-4 ml-13">
            <div className="flex space-x-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-dark" />
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={handleReplyChange}
                  onKeyDown={handleReplyKeyDown}
                  placeholder="Write a reply..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Enter</span> to submit • <span className="font-medium">Ctrl+Enter</span> for new line
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setIsReplying(false);
                        setReplyContent('');
                      }}
                      className="px-4 py-2 text-sm cursor-pointer text-primary-dark/60 hover:text-primary-dark/80"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={!replyContent.trim() || isUseCommentLoading}
                      className="px-4 py-2 text-sm bg-pink-light text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUseCommentLoading ? (
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                      ) : (
                        'Reply'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Child Comments */}
      {showReplies && childComments.length > 0 && (
        <div className="space-y-2">
          {childComments.map((child) => (
            <CommentItem
              key={child.id}
              productId={productId}
              comment={child}
              depth={depth + 1}
              refreshComments={refreshComments}
            />
          ))}
        </div>
      )}

      {/* Max depth warning */}
      {isMaxDepth && localNumberOfChildren > 0 && (
        <div className="ml-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>
            There are {localNumberOfChildren} deeper replies.
            <button className="text-blue-500 hover:text-blue-700 ml-1">
              View all
            </button>
          </p>
        </div>
      )}
    </div>
  );
};