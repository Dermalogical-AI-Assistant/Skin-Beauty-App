import {
  REQUEST_COMMENTS,
  REQUEST_CREATE_COMMENT,
} from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import qs from "qs";
import { GenericResponseType } from "../types/common.ts";
import { Comment, GetCommentsRequestParam, ReqCreateComment } from "../types/Comment.ts";
import { useState } from "react";

function useComment() {
  const [isLoading, setIsLoading] = useState(false);

  const useFetchCommentByProductId = (params: GetCommentsRequestParam) => {
    // Only enable query if productId exists
    const enabled = Boolean(params.productId);

    return useQuery<GenericResponseType<Comment>>({
      queryKey: ["comments", params.productId, params.parentId, params.page, params.perPage],
      queryFn: async () => {
        const { productId, ...reqParams } = params;

        const res = await axios.get<GenericResponseType<Comment>>(
          `${REQUEST_COMMENTS}/${productId}`,
          {
            params: reqParams,
            paramsSerializer: {
              serialize: (reqParams) =>
                qs.stringify(reqParams, { arrayFormat: "repeat" }),
            },
          },
        );
        return res.data as GenericResponseType<Comment>;
      },
      enabled,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
  };

  const handleCreateComment = useMutation({
    mutationKey: ["create-comment"],
    mutationFn: (data: ReqCreateComment) => {
      return axios.post(REQUEST_CREATE_COMMENT, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestCreateComment = (
    data: ReqCreateComment,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    setIsLoading(true);
    handleCreateComment.mutate(data, {
      onSuccess: () => {
        setIsLoading(false);
        onSuccess?.();
      },
      onError: (error) => {
        setIsLoading(false);
        console.error('Error creating comment:', error);
        onError?.(error);
      }
    });
  };

  return {
    useFetchCommentByProductId,
    onRequestCreateComment,
    isLoading,
    isCreating: handleCreateComment.isPending,
  };
}

export default useComment;