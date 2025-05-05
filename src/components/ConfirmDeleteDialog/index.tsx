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
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  entityName,
  confirmText = "Delete",
  cancelText = "Cancel",
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
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
