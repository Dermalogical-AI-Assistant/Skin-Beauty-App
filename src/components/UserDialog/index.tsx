import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  User,
  Gender,
  RoleType,
  UserInfo,
  UserFormData,
} from "../../types/Users";
import { convertDate } from "../../utils/date";
import { SelectChangeEvent } from "@mui/material/Select";
import { DEFAULT_AVATAR_URL } from "../../constants/properties";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useFiles from "../../hooks/useFiles";

interface UserDialog {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userData: UserFormData) => void;
}

const UserDialog: React.FC<UserDialog> = ({ open, onClose, user, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { uploadFile } = useFiles();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const [formData, setFormData] = useState<UserInfo>({
    name: "",
    email: "",
    phone: undefined,
    location: "",
    dob: undefined,
    gender: Gender.MALE,
    role: RoleType.USER,
    avatar: undefined,
  });

  useEffect(() => {
    if (user) {
      const { id, createdAt, ...userInfo } = user;
      setFormData(userInfo);
    }
  }, [user]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (e: SelectChangeEvent<Gender>) => {
    setFormData((prev) => ({
      ...prev,
      gender: e.target.value as Gender,
    }));
  };

  const handleRoleChange = (e: SelectChangeEvent<RoleType>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as RoleType,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      dob: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      const userData = {
        ...user,
        ...formData,
        isCreate: user ? false : true,
      };
      onSave(userData);
      onClose();
      return;
    }

    const formImageData = new FormData();
    formImageData.append("file", imageFile);

    try {
      const uploadFileResponse = await uploadFile.mutateAsync(formImageData);
      const avatarUrl = uploadFileResponse.data.secure_url;

      const userData = {
        ...user,
        ...formData,
        avatar: avatarUrl,
        isCreate: user ? false : true,
      };

      onSave(userData);
      onClose();
    } catch (err) {
      toast.error("Upload failed: " + (err as Error).message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User Detail</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          mb={3}
          position="relative"
        >
          {/* Avatar Image with Upload Indicator */}
          <Box
            position="relative"
            sx={{ cursor: "pointer" }}
            onClick={openFileExplorer}
          >
            <Box
              component="img"
              src={
                imageFile
                  ? URL.createObjectURL(imageFile) // Show preview of selected file
                  : user?.avatar || DEFAULT_AVATAR_URL
              }
              alt="User Avatar"
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid",
                borderColor: "divider",
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
            {/* Upload Overlay Icon */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                color: "white",
                bgcolor: "#EAA58D",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
              }}
            >
              <FaUpload size={14}  />
            </Box>
          </Box>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </Box>

        <Box
          sx={{
            margin: "20px 0",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box
              gridColumn="span 12"
              sx={{ "@media (min-width:600px)": { gridColumn: "span 6" } }}
            >
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                margin="normal"
                required
              />
            </Box>
            <Box
              gridColumn="span 12"
              sx={{ "@media (min-width:600px)": { gridColumn: "span 6" } }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                margin="normal"
                disabled={user ? true : false}
                onChange={handleTextChange}
              />
            </Box>

            <Box
              gridColumn="span 12"
              sx={{ "@media (min-width:600px)": { gridColumn: "span 6" } }}
            >
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleTextChange}
                margin="normal"
              />
            </Box>

            <Box
              gridColumn="span 12"
              sx={{ "@media (min-width:600px)": { gridColumn: "span 6" } }}
            >
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location || ""}
                onChange={handleTextChange}
                margin="normal"
              />
            </Box>

            <Box
              gridColumn="span 12"
              sx={{ "@media (min-width:600px)": { gridColumn: "span 6" } }}
            >
              <TextField
                fullWidth
                label="Date of birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                name="dob"
                value={convertDate(formData.dob)}
                onChange={handleDateChange}
                margin="normal"
              />
            </Box>

            <Box
              gridColumn="span 12"
              sx={{ "@media (min-width:600px)": { gridColumn: "span 6" } }}
            >
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.role}
                  label="Role"
                  onChange={handleRoleChange}
                >
                  <MenuItem value={RoleType.ADMIN}>Admin</MenuItem>
                  <MenuItem value={RoleType.USER}>User</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              gridColumn="span 12"
              sx={{ "@media (min-width:600px)": { gridColumn: "span 6" } }}
            >
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-select-label">Gender</InputLabel>
                <Select
                  labelId="gender-select-label"
                  id="gemder-simple-select"
                  value={formData.gender}
                  label="Role"
                  onChange={handleGenderChange}
                >
                  <MenuItem value={Gender.MALE}>Male</MenuItem>
                  <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                  <MenuItem value={Gender.OTHER}>Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#A4A3A2",
            "&:hover": {
              backgroundColor: "#8C8B8A",
            },
            color: "#F7F9F6",
            fontWeight: 500,
            padding: "8px 12px",
            borderRadius: "4px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#45556C",
            "&:hover": {
              backgroundColor: "#37465A",
            },
            fontWeight: 500,
            padding: "8px 24px",
            borderRadius: "4px",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
