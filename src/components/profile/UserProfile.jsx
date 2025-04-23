"use client";

import React, { useEffect, useState } from "react";
import { authAPI } from "@apiManager/authAPI";
import Notification from "@components/notification";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Edit2, Save } from "lucide-react";
import { useTranslation } from "@lib/translation/useTranslation";

const UserProfile = ({ loading, setLoading }) => {
  const [editMode, setEditMode] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const { t } = useTranslation();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(userForm);
      if (response.error) {
        return Notification({
          message: response.error || "Failed to update profile.",
        });
      }
      if(response.success) {
        return Notification({
          message: response.message || "Profile updated successfully.",
          type: "success",
        });
      }
      setEditMode(false);
    } catch (error) {
      Notification({
        message: "Failed to update profile due to technical issue.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.error) {
        return Notification({
          message: response.error || "Failed to get user data.",
        });
      }
      if (!response.data) {
        return Notification({ message: "No user data found." });
      }

      setUserForm({
        name: response.data.name,
        email: response.data.email,
        mobile: response.data.mobile || "",
      });
    } catch (error) {
      Notification({
        message: "Failed to fetch user data due to technical issue.",
      });
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('profile_info')}</CardTitle>
          <Button variant="outline" onClick={() => setEditMode(!editMode)}>
            {editMode ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Edit2 className="h-4 w-4 mr-1" />
            )}
            {editMode ? t('save') : t('edit')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name"> {t('full_name')} </Label>
            <Input
              id="name"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              disabled={!editMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              disabled={!editMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">{t("mobile_number")}</Label>
            <Input
              id="mobile"
              type="tel"
              value={userForm.mobile}
              onChange={(e) =>
                setUserForm({ ...userForm, mobile: e.target.value })
              }
              disabled={!editMode}
            />
          </div>
          {editMode && (
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('save_changes')}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
