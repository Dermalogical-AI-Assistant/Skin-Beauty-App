import React, { useEffect, useState } from "react";
import { Camera, X, AlertCircle, Edit, Save, User, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";
import useMyProfile from "../../hooks/useMyProfile.ts";

interface UploadError {
  message: string;
  type: 'avatar';
}

// interface UserProfile {
//   id: string;
//   avatar: string;
//   email: string;
//   name: string;
//   dob: string;
//   location: string;
//   gender: "MALE" | "FEMALE" | "OTHER";
//   role: string;
//   phone: string;
// }

interface UserProfileFormData {
  avatar: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
}

const MyProfilePage: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const {useFetchMyProfile} = useMyProfile();


  const {data: userProfileData, refetch: refetchUserProfile} = useFetchMyProfile();

  const [profileData, setProfileData] = useState<UserProfileFormData>({
    avatar: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    dob: "",
    gender: "FEMALE"
  });

  const [uploadError, setUploadError] = useState<UploadError | null>(null);

  // Load user profile when data is available
  useEffect(() => {
    if (userProfileData) {
      setProfileData({
        avatar: userProfileData.avatar || "",
        name: userProfileData.name || "",
        email: userProfileData.email || "",
        phone: userProfileData.phone || "",
        location: userProfileData.location || "",
        dob: userProfileData.dob ? new Date(userProfileData.dob).toISOString().split('T')[0] : "",
        gender: userProfileData.gender || "FEMALE"
      });
    }
  }, [userProfileData]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode) return;

    const file = event.target.files?.[0];
    if (file) {
      setUploadError(null);

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError({ message: "File size must be less than 5MB", type: 'avatar' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError({ message: "Please select a valid image file", type: 'avatar' });
        return;
      }

      setIsLoading(true);

      // Mock upload - in real app this would call your upload API
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file);
        setProfileData(prev => ({ ...prev, avatar: mockUrl }));
        setIsLoading(false);
        setUploadError(null);
      }, 1500);
    }

    event.target.value = '';
  };

  const handleUpdate = async () => {
    setIsUpdateLoading(true);

    // Mock API call - in real app this would call your update API
    setTimeout(() => {
      console.log("Profile updated successfully");
      setIsEditMode(false);
      setIsUpdateLoading(false);
      // Show success message
      alert("Profile updated successfully!");
    }, 2000);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset to original data
    if (userProfileData) {
      setProfileData({
        avatar: userProfileData.avatar || "",
        name: userProfileData.name || "",
        email: userProfileData.email || "",
        phone: userProfileData.phone || "",
        location: userProfileData.location || "",
        dob: userProfileData.dob ? new Date(userProfileData.dob).toISOString().split('T')[0] : "",
        gender: userProfileData.gender || "FEMALE"
      });
    }
  };

  const isFormValid = profileData.name.trim() && profileData.email.trim() && profileData.phone.trim();

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'Male';
      case 'FEMALE': return 'Female';
      case 'OTHER': return 'Other';
      default: return 'Not specified';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'USER': return 'bg-green-100 text-green-800';
      case 'MODERATOR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-primary/30 min-h-screen">
      <div className="bg-primary/70 rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary-dark/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-dark">User Profile</h1>
              <p className="text-primary-dark/70 mt-1">
                {isEditMode ? "Edit profile information" : "View profile details"}
              </p>
            </div>
            {!isEditMode && (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-pink-light text-white rounded-md cursor-pointer hover:shadow-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-primary/70 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-primary-dark mb-4">Profile Picture</h2>

            {/* Error Display */}
            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{uploadError.message}</span>
                <button
                  onClick={() => setUploadError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="relative">
                {profileData.avatar ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-dark/20">
                    <img
                      src={profileData.avatar}
                      alt="Profile avatar"
                      className="w-full h-full object-cover"
                    />
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => setProfileData(prev => ({ ...prev, avatar: "" }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary-dark/20 flex items-center justify-center">
                    <User className="w-16 h-16 text-primary-dark/40" />
                  </div>
                )}
              </div>

              {isEditMode && (
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <div className="flex items-center px-4 py-2 bg-white/70 border border-primary-dark/30 rounded-md hover:bg-white/90 transition-colors">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      ) : (
                        <Camera className="w-4 h-4 mr-2" />
                      )}
                      {isLoading ? 'Uploading...' : 'Change Photo'}
                    </div>
                  </label>
                  <p className="text-xs text-primary-dark/50 mt-2">
                    Max 5MB • JPG, PNG, WebP
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-primary/70 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-primary-dark mb-6">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border bg-white/70 border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                    required
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-white/70 border border-primary-dark/20 rounded-md">
                    {profileData.name || "Not specified"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                {isEditMode ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border bg-white/70 border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-white/70 border border-primary-dark/20 rounded-md">
                    {profileData.email || "Not specified"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                {isEditMode ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border bg-white/70 border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-white/70 border border-primary-dark/20 rounded-md">
                    {profileData.phone || "Not specified"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border bg-white/70 border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-white/70 border border-primary-dark/20 rounded-md">
                    {profileData.location || "Not specified"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth
                </label>
                {isEditMode ? (
                  <input
                    type="date"
                    value={profileData.dob}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full px-3 py-2 border bg-white/70 border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-white/70 border border-primary-dark/20 rounded-md">
                    {formatDate(profileData.dob)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Gender
                </label>
                {isEditMode ? (
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value as "MALE" | "FEMALE" | "OTHER" }))}
                    className="w-full px-3 py-2 border bg-white/70 border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-white/70 border border-primary-dark/20 rounded-md">
                    {getGenderLabel(profileData.gender)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-primary/70 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-primary-dark mb-6">Account Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  User ID
                </label>
                <div className="w-full px-3 py-2 bg-primary/50 border border-primary-dark/20 rounded-md text-primary-dark/70">
                  {userProfileData?.id}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  Role
                </label>
                <div className="w-full px-3 py-2 bg-white/70 border border-primary-dark/20 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userProfileData?.role)}`}>
                    {userProfileData?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditMode && (
            <div className="flex justify-center gap-4 pt-6 border-t border-primary-dark/20">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-primary border border-primary-dark/30 text-primary-dark rounded-md hover:bg-white/70 transition-colors"
                disabled={isLoading || isUpdateLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={!isFormValid || isLoading || isUpdateLoading}
                className="flex items-center px-6 py-2 from-pink-light bg-gradient-to-br to-purple-400 text-white rounded-md cursor-pointer hover:scale-110 disabled:from-pink-light/50 disabled:bg-gradient-to-r disabled:to-purple-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdateLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;