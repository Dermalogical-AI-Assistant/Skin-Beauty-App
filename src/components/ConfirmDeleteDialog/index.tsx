import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
} from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  entityName,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDeleting = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1.5}>
          <FiAlertTriangle size={20} color={theme.palette.warning.main} />
          <Typography variant="h6" fontWeight={600}>
            Delete {entityName}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "text.primary", mb: 1 }}>
          Are you sure you want to delete this {entityName}? This action cannot
          be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 rounded bg-red-600 text-white shadow-none hover:shadow-none hover:bg-red-700 disabled:opacity-50"
            autoFocus
          >
            {isDeleting ? (
              <span
                className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"
              />
            ) : (
              confirmText
            )}
          </button>
        </div>

      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
