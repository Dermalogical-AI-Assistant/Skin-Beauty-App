import React, { useEffect, useState } from "react";
import { MessageCircle } from 'lucide-react';
import { CommentItem } from "./CommentItem.tsx";
import useAuthStore from "../../stores/AuthStore.ts";
import { useNavigate } from "react-router-dom";
import { LOGIN, REGISTER } from "../../constants/routes.ts";
import useComment from "../../hooks/useComment.ts";

interface CommentProps {
  productId: string
}

// Component chính
const CommentsSection: React.FC<CommentProps> = (props) => {
  const navigate = useNavigate();
  const { isLogin } = useAuthStore();

  const {isLoading: isUseCommentLoading, onRequestCreateComment, getCommentByProductId} = useComment();
  const { data: commentData, refetch: refreshComments } = getCommentByProductId({ productId: props.productId || "", page: 0, perPage: 1000000000 });

  const [comments, setComments] = useState( commentData?.data || []);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
        onRequestCreateComment(
          {
            productId: props.productId,
            content: newComment,
            parentId: null,
          },
          () => {
            setNewComment('');
            // Cập nhật lại danh sách comment sau khi thêm mới
            refreshComments();
            console.log('Comment added successfully');
          },
          (error) => {
            console.error('Error adding comment:', error);
          }
        )
    }
  };

  const handleLoginClick = () => {
    // Xử lý logic chuyển đến trang đăng nhập hoặc mở modal đăng nhập
    console.log('Redirect to login page');
    navigate(LOGIN); // Hoặc mở modal đăng nhập
    // Ví dụ: navigate('/login') hoặc setShowLoginModal(true)
  };

  const handleRegisterClick = () => {
    // Xử lý logic chuyển đến trang đăng nhập hoặc mở modal đăng nhập
    console.log('Redirect to login page');
    navigate(REGISTER); // Hoặc mở modal đăng nhập
    // Ví dụ: navigate('/login') hoặc setShowLoginModal(true)
  };

  useEffect(
    () => {
      // Giả lập việc lấy dữ liệu comment từ API
      setComments(commentData?.data || []);
    },
    [commentData?.data, refreshComments]
  )

  return (
    <div className=" mx-auto  min-h-screen">
      <div className="bg-white/20 rounded-lg shadow-sm   mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary-dark flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-pink-light" />
            Comments ({comments?.length || 0})
          </h2>
        </div>

        {/* Add Comment - Conditional Rendering */}
        <div className="p-6">
          {isLogin ? (
            // Hiển thị textarea khi đã đăng nhập
            <div className="flex space-x-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Your avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment......"
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50 focus:border-transparent"
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isUseCommentLoading}
                    className="px-6 py-2 bg-pink-light text-white rounded-lg hover:bg-pink-light cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUseCommentLoading ?
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                        :
                        <span>Post</span>
                    }
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Hiển thị nút đăng nhập khi chưa đăng nhập
            <div className="flex items-center justify-center p-8 rounded-lg ">
              <div className="text-center">
                <p className="text-primary-dark/60 text-lg font-bold mb-4">Login to writing comments.</p>
               <div className={`flex gap-3 justify-center items-center`}>
                 <button
                   onClick={handleRegisterClick}
                   className="px-6 py-2 text-primary-dark shadow-primary hover:scale-110 hover:bg-purple-200/20 cursor-pointer rounded-lg hover:bg-pink-dark transition-colors flex items-center space-x-2"
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

      {/* Comments List */}
      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentItem key={comment.id} productId={props.productId} comment={comment} depth={0} refreshComments={refreshComments} />
        ))}
      </div>

      {comments?.length === 0 && (
        <div className="text-center py-12 bg-white/20 rounded-lg">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;