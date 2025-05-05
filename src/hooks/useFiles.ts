import { REQUEST_FILES_MODULE } from "../constants/apis";
import { useMutation } from "@tanstack/react-query";
import axios from "../settings/axios";
import { UploadFileResponse } from "../types/Files";

function useFiles() {
  const uploadFile = useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: (data: FormData) => {
      return axios.post<UploadFileResponse>(REQUEST_FILES_MODULE, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  return {
    uploadFile,
  };
}

export default useFiles;
