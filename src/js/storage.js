/**
 * Storage Controller - Abstracts browser localStorage operations
 */

const STORAGE_KEYS = {
  USER_PROFILE: 'rainguard_user_profile',
  CHECKLIST_STATE: 'rainguard_checklist_state',
  THEME_PREFERENCE: 'rainguard_theme_preference'
};

export const Storage = {
  /**
   * Get the saved User Profile
   * @returns {Object|null}
   */
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to read User Profile from storage', e);
      return null;
    }
  },

  /**
   * Save the User Profile
   * @param {Object} profile 
   */
  setProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to write User Profile to storage', e);
    }
  },

  /**
   * Get the saved Emergency Checklist state
   * @returns {Object|null}
   */
  getChecklist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST_STATE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to read Checklist from storage', e);
      return null;
    }
  },

  /**
   * Save the Emergency Checklist state
   * @param {Object} checklist 
   */
  setChecklist(checklist) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST_STATE, JSON.stringify(checklist));
    } catch (e) {
      console.error('Failed to write Checklist to storage', e);
    }
  },

  /**
   * Get theme preference
   * @returns {string|null}
   */
  getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
    } catch (e) {
      console.error('Failed to read theme preference', e);
      return null;
    }
  },

  /**
   * Save theme preference
   * @param {string} theme 
   */
  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
    } catch (e) {
      console.error('Failed to write theme preference', e);
    }
  },

  /**
   * Clear user profile and checklist states (preserves API Key for convenience)
   */
  clearUserData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.CHECKLIST_STATE);
    } catch (e) {
      console.error('Failed to clear user data', e);
    }
  },

  /**
   * Clear all storage
   */
  clearAll() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  }
};
