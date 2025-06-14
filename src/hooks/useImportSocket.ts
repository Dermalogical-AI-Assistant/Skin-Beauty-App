import { useState, useCallback, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import useAuthStore from "../stores/AuthStore.ts";

enum ImportEventEnum {
  GET_LOGS = 'GET_LOGS',
  CONNECT_SOCKET_CLIENT = 'CONNECT_SOCKET_CLIENT',
  DONE_CONNECT = 'DONE_CONNECT'
}

interface LogEntry {
  type: 'info' | 'success' | 'error';
  message: string;
  timestamp: Date;
}

interface ImportEvent {
  type?: string;
  message?: string;
  timestamp?: string | number;
}

interface UseImportSocketReturn {
  socket: Socket | null;
  logs: LogEntry[];
  isProcessing: boolean;
  isDone: boolean;
  connectSocket: (importFileId: string) => void;
  disconnectSocket: () => void;
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
}

const SOCKET_URL = import.meta.env.VITE_REACT_APP_SERVER_DOMAIN;

export const useImportSocket = (): UseImportSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const addLog = useCallback((log: LogEntry) => {
    setLogs(prev => [...prev, log]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsProcessing(false);
    }
  }, []);

  const connectSocket = useCallback((importFileId: string) => {
    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const token = useAuthStore.getState().accessToken;

    const newSocket: Socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket'],
      reconnectionDelay: 1000,
    });

    // Store reference
    socketRef.current = newSocket;
    setSocket(newSocket);
    setIsProcessing(true);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      addLog({
        type: 'success',
        message: 'Connected to import server',
        timestamp: new Date()
      });

      newSocket.emit(ImportEventEnum.CONNECT_SOCKET_CLIENT, { importFileId });
    });

    newSocket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error.message);
      addLog({
        type: 'error',
        message: `Connection error: ${error.message}`,
        timestamp: new Date()
      });
    });

    newSocket.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
      addLog({
        type: 'info',
        message: `Disconnected: ${reason}`,
        timestamp: new Date()
      });

      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    // Import-specific events
    newSocket.on(ImportEventEnum.GET_LOGS, (events: ImportEvent | ImportEvent[]) => {
      console.log(`Received events ${ImportEventEnum.GET_LOGS}:`, events);

      if (Array.isArray(events)) {
        events.forEach((event: ImportEvent) => {
          if (JSON.stringify(event).includes("Done")){
            setIsDone(true);
            setIsProcessing(false);
          }
          addLog({
            type: (event.type as 'info' | 'success' | 'error') || 'info',
            message: event.message || JSON.stringify(event),
            timestamp: new Date(event.timestamp || Date.now())
          });
        });
      } else {
        addLog({
          type: 'info',
          message: JSON.stringify(events),
          timestamp: new Date()
        });
      }
    });

    newSocket.on('eventCreated', (data: any) => {
      console.log('Event created:', data);
      addLog({
        type: 'success',
        message: `Event created: ${JSON.stringify(data)}`,
        timestamp: new Date()
      });
    });

    newSocket.on('eventCreationFailed', (error: any) => {
      console.error('Event creation failed:', error);
      addLog({
        type: 'error',
        message: `Event creation failed: ${JSON.stringify(error)}`,
        timestamp: new Date()
      });
    });

  }, [addLog]);

  return {
    socket,
    logs,
    isProcessing,
    isDone,
    connectSocket,
    disconnectSocket,
    addLog,
    clearLogs
  };
};