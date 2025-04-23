import { Message, NewMessage, PaginatedResponse } from "../types/ChatBot";
import { REQUEST_CHATBOT_MESSAGES } from "../constants/apis";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from '../settings/axios';

function useChatBotMessages(perPage: number = 10, sessionId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['get-list-messages', sessionId, perPage];

  const fetchMessages = useInfiniteQuery<PaginatedResponse<Message>, Error>({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      // Don't fetch if no sessionId is provided
      if (!sessionId) {
        return { data: [], meta: { page: "0", perPage: "0", total: 0 } };
      }

      const res = await axios.get<PaginatedResponse<Message>>(
        `${REQUEST_CHATBOT_MESSAGES}/${sessionId}?page=${pageParam}&perPage=${perPage}`
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
    // This ensures the query is not executed if there's no sessionId
    enabled: !!sessionId,
  });

  /**
   * SENT NEW MESSAGE
   */
  const handleSentMessage = useMutation({
    mutationKey: ["sent-message", sessionId],
    mutationFn: (data: NewMessage) => {
      return axios.post(`${REQUEST_CHATBOT_MESSAGES}`, data);
    },
    onSuccess: () => {
      // Invalidate the query for this specific sessionId to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const onSentMessage = (data: NewMessage, onSuccess: (newSession: Message) => void, onError: () => void) => {
    handleSentMessage.mutate(data, {
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
    fetchMessages,
    onSentMessage
  };
}

export default useChatBotMessages;