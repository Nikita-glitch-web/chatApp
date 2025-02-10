import { makeAutoObservable, runInAction } from "mobx";
import { auth } from "../services/firebase.config";
import {
  fetchUserProfile,
  uploadAvatar,
  updateUserProfile,
} from "../../src/services/userProfileServices";

const userStore = makeAutoObservable({
  userId: auth.currentUser?.uid || null,
  userProfile: {
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
  },

  setUserId() {
    auth.onAuthStateChanged((user) => {
      runInAction(() => {
        this.userId = user ? user.uid : null;
      });
      if (this.userId) {
        this.loadUserProfile();
      } else {
        runInAction(() => {
          this.userProfile = {
            firstName: "",
            lastName: "",
            bio: "",
            avatar: "",
          };
        });
      }
    });
  },

  async loadUserProfile() {
    if (!this.userId) return;

    try {
      const profile = await fetchUserProfile(this.userId);
      runInAction(() => {
        if (profile) {
          this.userProfile = {
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            bio: profile.bio || "",
            avatar: profile.avatar || "",
          };
        }
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  },

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
  }) {
    if (!this.userId) return;

    try {
      await updateUserProfile(this.userId, profileData);
      runInAction(() => {
        if (profileData.firstName !== undefined)
          this.userProfile.firstName = profileData.firstName;
        if (profileData.lastName !== undefined)
          this.userProfile.lastName = profileData.lastName;
        if (profileData.bio !== undefined)
          this.userProfile.bio = profileData.bio;
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  async updateAvatar(file: File) {
    if (!this.userId) return;

    try {
      const avatarUrl = await uploadAvatar(this.userId, file);

      // Оновлюємо аватар в стейті
      runInAction(() => {
        this.userProfile.avatar = avatarUrl;
      });

      // Перезавантажуємо профіль для синхронізації
      await this.loadUserProfile();
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  },

  hasAccessToProfile(profileUserId: string): boolean {
    // Доступ тільки до власного профілю
    return this.userId === profileUserId;
  },
});

// Встановлюємо userId після ініціалізації
userStore.setUserId();

export default userStore;
