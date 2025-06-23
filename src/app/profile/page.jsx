"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("profile");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [settings, setSettings] = React.useState(null);
  const [upload, { loading: uploading }] = useUpload();

  const [profileData, setProfileData] = React.useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1-555-0123",
    title: "Sales Manager",
    department: "Sales",
    avatar: "",
    bio: "Experienced sales professional with 5+ years in CRM management.",
  });

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error(
          `When fetching /api/settings, the response was [${response.status}] ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error(error);
      setError("Could not load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error(
          `When updating settings, the response was [${response.status}] ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
        setSuccess("Settings updated successfully");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.error || "Failed to update settings");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("Profile updated successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError(null);
    setSuccess("Password changed successfully");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAvatarUpload = async (file) => {
    try {
      const { url, error } = await upload({ file });
      if (error) {
        setError(error);
        return;
      }
      setProfileData((prev) => ({ ...prev, avatar: url }));
      setSuccess("Avatar updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error(error);
      setError("Could not upload avatar");
    }
  };

  const handleNotificationChange = (section, key, value) => {
    if (!settings) return;

    const updatedSettings = {
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    };
    updateSettings(updatedSettings);
  };

  const handleUserSettingChange = (key, value) => {
    if (!settings) return;

    const updatedSettings = {
      user: {
        ...settings.user,
        [key]: value,
      },
    };
    updateSettings(updatedSettings);
  };

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Personal Information
      </h3>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-3xl text-gray-400"></i>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-700">
              <i className="fas fa-camera text-sm"></i>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAvatarUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Uploading...</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={profileData.title}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={profileData.department}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            rows="4"
            value={profileData.bio}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Notification Preferences
      </h3>

      {settings && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Email Notifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">New Leads</p>
                  <p className="text-sm text-gray-500">
                    Get notified when new leads are added
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newLeads}
                    onChange={(e) =>
                      handleNotificationChange(
                        "notifications",
                        "newLeads",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Deal Updates</p>
                  <p className="text-sm text-gray-500">
                    Get notified when deals are updated
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.dealUpdates}
                    onChange={(e) =>
                      handleNotificationChange(
                        "notifications",
                        "dealUpdates",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Task Reminders</p>
                  <p className="text-sm text-gray-500">
                    Get reminded about upcoming tasks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.taskReminders}
                    onChange={(e) =>
                      handleNotificationChange(
                        "notifications",
                        "taskReminders",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Weekly Reports</p>
                  <p className="text-sm text-gray-500">
                    Receive weekly performance reports
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyReports}
                    onChange={(e) =>
                      handleNotificationChange(
                        "notifications",
                        "weeklyReports",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Email Digest
            </h4>
            <select
              value={settings.notifications.emailDigest}
              onChange={(e) =>
                handleNotificationChange(
                  "notifications",
                  "emailDigest",
                  e.target.value
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">No digest</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Quiet Hours
            </h4>
            <div className="flex items-center mb-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.quietHours.enabled}
                  onChange={(e) =>
                    handleNotificationChange("notifications", "quietHours", {
                      ...settings.notifications.quietHours,
                      enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="ml-3 text-gray-700">Enable quiet hours</span>
            </div>

            {settings.notifications.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.notifications.quietHours.start}
                    onChange={(e) =>
                      handleNotificationChange("notifications", "quietHours", {
                        ...settings.notifications.quietHours,
                        start: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.notifications.quietHours.end}
                    onChange={(e) =>
                      handleNotificationChange("notifications", "quietHours", {
                        ...settings.notifications.quietHours,
                        end: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Security Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
              Enable 2FA
            </button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Active Sessions</p>
                <p className="text-sm text-gray-500">
                  Manage your active login sessions
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Sessions
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Login History</p>
                <p className="text-sm text-gray-500">
                  View your recent login activity
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        User Preferences
      </h3>

      {settings && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.user.theme}
              onChange={(e) => handleUserSettingChange("theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={settings.user.language}
              onChange={(e) =>
                handleUserSettingChange("language", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items Per Page
            </label>
            <select
              value={settings.user.itemsPerPage}
              onChange={(e) =>
                handleUserSettingChange(
                  "itemsPerPage",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Auto Save</p>
              <p className="text-sm text-gray-500">
                Automatically save changes as you type
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.user.autoSave}
                onChange={(e) =>
                  handleUserSettingChange("autoSave", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Account Information
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-700">Account Created</span>
            <span className="text-gray-900">January 15, 2024</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-700">Last Login</span>
            <span className="text-gray-900">Today at 9:30 AM</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-700">Account Status</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Active
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700">Storage Used</span>
            <span className="text-gray-900">2.4 GB of 10 GB</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Data Management
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Export Data</p>
              <p className="text-sm text-gray-500">
                Download all your data in CSV format
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              Export
            </button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Import Data</p>
                <p className="text-sm text-gray-500">
                  Import contacts and leads from CSV files
                </p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-red-800 mb-4">Danger Zone</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Delete Account</p>
              <p className="text-sm text-red-600">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "profile", name: "Profile", icon: "fas fa-user" },
    { id: "notifications", name: "Notifications", icon: "fas fa-bell" },
    { id: "security", name: "Security", icon: "fas fa-shield-alt" },
    { id: "preferences", name: "Preferences", icon: "fas fa-cog" },
    { id: "account", name: "Account", icon: "fas fa-user-circle" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "preferences":
        return renderPreferencesTab();
      case "account":
        return renderAccountTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {success}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <i className={`${tab.icon} mr-3 text-lg`}></i>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:w-3/4">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;