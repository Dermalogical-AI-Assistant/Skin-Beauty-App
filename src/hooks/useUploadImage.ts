import {
  REQUEST_COMMENTS,
  REQUEST_CREATE_COMMENT, REQUEST_UPLOAD_FILE
} from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import qs from "qs";
import { GenericResponseType } from "../types/common.ts";
import { Comment, GetCommentsRequestParam, ReqCreateComment } from "../types/Comment.ts";
import { useState } from "react";
import { ResUploadImage } from "../types/UploadImage.ts";

function useUploadImage() {

  const [isLoading, setIsLoading] = useState(false);

  const handleUploadImage = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: (data: { file: File }) => {
      const formData = new FormData();
      formData.append('file', data.file);

      return axios.post<ResUploadImage>(REQUEST_UPLOAD_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  const onRequestUploadImage = (
    data: { file: File },
    onSuccess: (res:ResUploadImage) => void,
    onError: (error:Error) => void
  ) => {
    setIsLoading(true);
    handleUploadImage.mutate(data, {
      onSuccess: (res) => {
        setIsLoading(false);
        onSuccess?.(res.data);
      },
      onError: (error) => {
        setIsLoading(false);
        console.log(error);
        onError(error);
      }
    });
  };



  return {
    onRequestUploadImage,
    isLoading
  };
}

export default useUploadImage;
