import React, { useEffect, useState } from "react";
import { MessageCircle, User } from "lucide-react";
import { CommentItem } from "./CommentItem.tsx";
import useAuthStore from "../../stores/AuthStore.ts";
import { useNavigate } from "react-router-dom";
import { LOGIN, REGISTER } from "../../constants/routes.ts";
import useComment from "../../hooks/useComment.ts";

interface CommentProps {
  productId: string;
}

const CommentsSection: React.FC<CommentProps> = ({ productId }) => {
  const navigate = useNavigate();
  const { isLogin, user } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  const {
    isLoading: isUseCommentLoading,
    onRequestCreateComment,
    useFetchCommentByProductId
  } = useComment();

  // Fetch only top-level comments (parentId = null)
  const {
    data: commentData,
    refetch: refreshComments,
    isLoading: isLoadingComments
  } = useFetchCommentByProductId({
    productId: productId || "",
    page: 0,
    perPage: 10,
  });

  const comments = commentData?.data || [];

  useEffect(() => {
    console.log('Comment data updated:', commentData);
  }, [commentData]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    onRequestCreateComment(
      {
        productId: productId,
        content: newComment,
        parentId: null,
      },
      () => {
        setNewComment('');
        refreshComments();
        console.log('Comment added successfully');
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  };

  const handleLoginClick = () => {
    console.log('Redirect to login page');
    navigate(LOGIN);
  };

  const handleRegisterClick = () => {
    console.log('Redirect to register page');
    navigate(REGISTER);
  };

  // ✅ Hàm xử lý sự kiện keydown cho textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        // Ctrl + Enter: Thêm xuống dòng thủ công
        e.preventDefault();
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Thêm \n vào vị trí cursor
        const newValue = newComment.substring(0, start) + '\n' + newComment.substring(end);
        setNewComment(newValue);

        // Đặt lại vị trí cursor sau \n
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);

        console.log('Ctrl + Enter: New line added');
      } else {
        // Enter: Submit comment
        e.preventDefault();
        if (newComment.trim()) {
          handleAddComment();
        }
      }
    }
  };

  // ✅ Hàm xử lý onChange cho textarea
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white/20 rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary-dark flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-pink-light" />
            Comments ({comments.length})
          </h2>
        </div>

        {/* Add Comment Section */}
        <div className="p-6">
          {isLogin ? (
            <div className="flex space-x-4">
              {user && user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-dark" />
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={handleCommentChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a comment..."
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50 focus:border-transparent"
                  rows={4}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Enter</span> to submit • <span className="font-medium">Ctrl+Enter</span> for new line
                  </div>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isUseCommentLoading}
                    className="px-6 py-2 bg-pink-light text-white rounded-lg hover:bg-pink-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUseCommentLoading ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                    ) : (
                      <span>Post</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 rounded-lg">
              <div className="text-center">
                <p className="text-primary-dark/60 text-lg font-bold mb-4">
                  Login to write comments.
                </p>
                <div className="flex gap-3 justify-center items-center">
                  <button
                    onClick={handleRegisterClick}
                    className="px-6 py-2 text-primary-dark shadow-primary hover:scale-110 hover:bg-purple-200/20 cursor-pointer rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>Sign up</span>
                  </button>
                  <button
                    onClick={handleLoginClick}
                    className="px-6 py-2 bg-pink-light cursor-pointer text-white rounded-lg hover:scale-110 hover:bg-pink-dark transition-colors flex items-center space-x-2"
                  >
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingComments && (
        <div className="text-center py-12 bg-white/20 rounded-lg">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full text-pink-light"></div>
          <p className="text-gray-500 mt-4">Loading comments...</p>
        </div>
      )}

      {/* Comments List */}
      {!isLoadingComments && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              productId={productId}
              comment={comment}
              depth={0}
              refreshComments={refreshComments}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingComments && comments.length === 0 && (
        <div className="text-center py-12 bg-white/20 rounded-lg">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;