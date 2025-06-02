import React, { useState } from 'react';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import useAuthStore from "../../stores/AuthStore.ts";
import { Comment } from "../../types/Comment.ts";
import useComment from "../../hooks/useComment.ts";

type CommentProps =  {
  comment: Comment;
  depth: number | 0;
  productId: string;
  refreshComments: () => void;
}

// Component Comment đơn lẻ
export const CommentItem: React.FC<CommentProps> = (props) => {
  const [showReplies, setShowReplies] = useState(props.depth<1 ? true : false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { isLogin } = useAuthStore();

  const {isLoading: isUseCommentLoading, onRequestCreateComment} = useComment();

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
    return `${Math.floor(diff / 86400)} day(s) ago`;

  };


  const handleReply = () => {
    if (replyContent.trim()) {
      onRequestCreateComment(
        {
          productId: props.productId,
          content: replyContent,
          parentId: props.comment.id || null,
        },
        () => {
          setReplyContent('');
          // Cập nhật lại danh sách comment sau khi thêm mới
          props.refreshComments();
          setIsReplying(false);
          setShowReplies(true);
          console.log('Comment added successfully');
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      )
    }
  };

  const maxDepth = 5; // Giới hạn độ sâu tối đa
  const isMaxDepth = props.depth >= maxDepth;

  return (
    <div className={`${props.depth > 0 ? 'ml-4 md:ml-8' : ''} ${props.depth > 0 ? 'border-l-2 border-primary-dark/10 pl-4' : ''}`}>
      <div className="bg-white/20 rounded-lg p-4 mb-4 shadow-sm border border-primary-dark/10">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <img
            src={props.comment.user.avatar}
            alt={props.comment.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-primary-dark/90">{props.comment.user.name}</h4>
              <span className="text-sm text-primary-dark/50">{formatDate(props.comment.createdAt)}</span>
            </div>

            {/* Content */}
            <p className="mt-2 text-gray-800 leading-relaxed">{props.comment.content}</p>

            {/* Images */}
            {props.comment.images && props.comment.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {props.comment.images.map((image, index) => (
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
                >
                  {isUseCommentLoading ?
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                    :
                    <span>Reply</span>
                  }
                </button>
              )}

              {props.comment.children && props.comment.children.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center space-x-1 text-sm text-primary-dark/50 hover:text-pink-light transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {showReplies ? 'Hidden' : 'Show'} {props.comment.children.length} Comment
                  </span>
                </button>
              )}

              <button className="text-primary-dark/40 hover:text-primary-dark/60">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-4 ml-13">
            <div className="flex space-x-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">

                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50   focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setIsReplying(false)}
                    className="px-4 py-2 text-sm cursor-pointer text-primary-dark/60 hover:text-primary-dark/80"
                  >
                    Cancle
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                    className="px-4 py-2 text-sm bg-pink-light text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recursive Children */}
      {showReplies && props.comment.children && props.comment.children.length > 0 && (
        <div className="space-y-2">
          {props.comment.children.map((child) => (
            <CommentItem key={child.id} productId={props.productId} comment={child} depth={props.depth + 1} refreshComments={props.refreshComments} />
          ))}
        </div>
      )}

      {/* Max depth warning */}
      {isMaxDepth && props.comment.children && props.comment.children.length > 0 && (
        <div className="ml-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>Có {props.comment.children.length} phản hồi sâu hơn.
            <button className="text-blue-500 hover:text-blue-700 ml-1">
              Xem tất cả
            </button>
          </p>
        </div>
      )}
    </div>
  );
};


