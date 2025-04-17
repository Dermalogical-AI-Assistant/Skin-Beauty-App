import { ChatHistory, PaginatedResponse } from '../types/ChatBot';
import {
  REQUEST_CHATBOT_SESSIONS,
  REQUEST_DELETE_ALL_CHATBOT_SESSION,
  REQUEST_DELETE_CHATBOT_SESSION,
  REQUEST_NEW_CHATBOT_SESSION,
  REQUEST_RENAME_CHATBOT_SESSION
} from "./../constants/apis";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from '../settings/axios';

interface RenameSession {
  sessionId: string;
  title: string;
}

function useChatBotSessions(perPage: number = 35) {
  const fetchChatHistory = useInfiniteQuery<PaginatedResponse<ChatHistory>, Error>({
    queryKey: ['get-list-chat-history', perPage],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get<PaginatedResponse<ChatHistory>>(
        `${REQUEST_CHATBOT_SESSIONS}?page=${pageParam}&perPage=${perPage}`
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = parseInt(lastPage.meta.page, 10);
      const perPage = parseInt(lastPage.meta.perPage, 10);
      const totalItems = lastPage.meta.total;

      const totalPages = Math.ceil(totalItems / perPage);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  /**
   * RENAME SESSION
   */
  const handleRenameChatbotSession = useMutation({
    mutationKey: ["rename-chatbot-session"],
    mutationFn: (data:RenameSession) => {
      return axios.put(`${REQUEST_RENAME_CHATBOT_SESSION}/${data.sessionId}`, { title:data.title });
    },
  });

  const onRenameChatbotSessions = (data:RenameSession, onSuccess: () => void, onError:()=> void) => {
    handleRenameChatbotSession.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => {
        console.log(error);
        onError()
      }
    });
  };


  /**
   * DELETE SESSION
   */

  const handleDeleteChatbotSession = useMutation({
    mutationKey: ["delete-chatbot-session"],
    mutationFn: (sessionId:string) => {
      return axios.delete(`${REQUEST_DELETE_CHATBOT_SESSION}/${sessionId}`);
    },
  });

  const onDeleteChatbotSessions = (sessionId:string, onSuccess: () => void, onError:()=> void) => {
    handleDeleteChatbotSession.mutate(sessionId, {
      onSuccess: onSuccess,
      onError: (error) => {
        console.log(error);
        onError()
      }
    });
  };

  /**
   * DELETE ALL SESSIONS
   */

  const handleDeleteAllChatbotSession = useMutation({
    mutationKey: ["rename-chatbot-session"],
    mutationFn: () => {
      return axios.delete(`${REQUEST_DELETE_ALL_CHATBOT_SESSION}`);
    },
  });

  const onDeleteAllChatbotSessions = (onSuccess: () => void, onError:()=> void) => {
    handleDeleteAllChatbotSession.mutate(undefined,{
      onSuccess: onSuccess,
      onError: (error) => {
        console.log(error);
        onError()
      }
    });
  };

  /**
   * CREATE NEW SESSIONS
   */
  const handleCreateNewChatbotSession = useMutation({
    mutationKey: ["create-new-chatbot-session"],
    mutationFn: () => {
      return axios.post(`${REQUEST_NEW_CHATBOT_SESSION}`);
    },
  });

  const onCreateNewChatbotSession = (onSuccess: (newSession: ChatHistory) => void, onError: () => void) => {
    handleCreateNewChatbotSession.mutate(undefined, {
      onSuccess: (response) => {
        // Pass the new session data to the callback
        onSuccess?.(response.data);
      },
      onError: (error) => {
        console.log(error);
        onError();
      }
    });
  };

  return {
    fetchChatHistory,
    onRenameChatbotSessions,
    onDeleteChatbotSessions,
    onDeleteAllChatbotSessions,
    onCreateNewChatbotSession
  };
}

export default useChatBotSessions;
