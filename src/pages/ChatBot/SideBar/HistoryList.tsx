import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChatHistory } from "../../../types/ChatBot.ts";
import LoadingIndicator from "../LoadingIndicator.tsx";
import ContextMenu from "../../../components/ContextMenu";
import ContextMenuItem from "../../../components/ContextMenu/ContextMenuItem.tsx";
import useChatBotSessions from "../../../hooks/useChatBotSessions.ts";
import DeleteModal from "./DeleteModal.tsx";

interface HistoryListProps {
  chatHistory: ChatHistory[];
  loading: boolean;
  onDeleteSessionSuccess: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = (props) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [oldTitle, setOldTitle] = useState<string>("");
  const editableRef = useRef<HTMLSpanElement>(null);
  const[deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const { onRenameChatbotSessions, onDeleteChatbotSessions } = useChatBotSessions();

  useEffect(() => {
    console.log("sessionId", sessionId);
  }, []);

  const handleRenameActive = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setOldTitle(currentTitle); // store previous title
    setTimeout(() => {
      const el = editableRef.current;
      if (el) {
        el.focus();
        // move caret to end
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  };

  const handleRenameSubmit = async (sessionId: string) => {
    const newTitle = editableRef.current?.textContent?.trim() || "";
    if (!newTitle || newTitle === oldTitle) {
      setEditingSessionId(null);
      return;
    }

    onRenameChatbotSessions(
      { title: newTitle, sessionId },
      () => {
        setEditingSessionId(null);
      },
      () => {
        if (editableRef.current) {
          editableRef.current.textContent = oldTitle;
          setEditingSessionId(null);
        }
      }
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    onDeleteChatbotSessions(
      sessionId,
      () => {
        console.log("Session deleted successfully");
        props.onDeleteSessionSuccess(sessionId); // cập nhật UI
        setDeleteSessionId(null);
      },
      () => {
        setDeleteSessionId(null);
        console.error("Failed to delete session");
      }
    );
  };

  return (
    <div className="w-full">

      {/*DELETE CHAT MODAL*/}
      <DeleteModal
          isOpen={deleteSessionId? true : false}
          title="Delete chat?"
          subtitle="Are you sure you want to delete this chat?"
          onClose={() => setDeleteSessionId(null)}
          onDelete={() => {
            if (deleteSessionId) {
              handleDeleteSession(deleteSessionId);
            }
          }}
      />

      <ul>
        {props.chatHistory.map((session) => (
          <li key={session.id}>
            <div className="flex items-center justify-between relative">
              <Link
                to={`/cosmetic-assistant/${session.id}`}
                className={`block w-full text-left py-2 px-3 mb-1 rounded-md hover:bg-pink-light/25 text-primary-dark/75 flex items-center ${
                  sessionId === String(session.id) ? "bg-pink-light/25" : ""
                }`}
              >
                {editingSessionId === session.id ? (
                  <span
                    ref={editableRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    className="px-2 py-1 rounded w-full bg-white border border-gray-300 focus:outline-none"
                    onBlur={() => handleRenameSubmit(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleRenameSubmit(session.id);
                      }
                    }}
                  >
                    {session.title}
                  </span>
                ) : (
                  <span className="truncate">{session.title}</span>
                )}
              </Link>
              <ContextMenu>
                <ContextMenuItem
                  label={"Rename"}
                  onClick={() => handleRenameActive(session.id, session.title)}
                />
                <ContextMenuItem
                  label={"Delete"}
                  onClick={() => setDeleteSessionId(session.id)}
                />
              </ContextMenu>
            </div>
          </li>
        ))}
      </ul>
      {props.loading && <LoadingIndicator />}
    </div>
  );
};

export default HistoryList;
