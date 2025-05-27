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

  const getCommentByProductId = (params: GetCommentsRequestParam) => {
    return useQuery<GenericResponseType<Comment>>({
      queryKey: ["product", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetCommentsRequestParam];
        const {productId, ...reqParams} = params;

        const res = await axios.get<GenericResponseType<Comment>>(
          `${REQUEST_COMMENTS}/${productId}`,
          {
            reqParams,
            paramsSerializer: {
              serialize: (reqParams) =>
                qs.stringify(reqParams, { arrayFormat: "repeat" }), // skincareConcerns=DRY_SKIN&skincareConcerns=ACNE
            },
          },
        );
        return res.data as GenericResponseType<Comment>;
      },
      refetchOnWindowFocus: false,
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
    onSuccess: () => void,
    onError: (error:Error) => void
  ) => {
    setIsLoading(true);
    handleCreateComment.mutate(data, {
      onSuccess: () => {
        setIsLoading(false);
        onSuccess?.();
      },
      onError: (error) => {
        setIsLoading(false);
        console.log(error);
        onError(error);
      }
    });
  };



  return {
    getCommentByProductId,
    onRequestCreateComment,
    isLoading
  };
}

export default useComment;
