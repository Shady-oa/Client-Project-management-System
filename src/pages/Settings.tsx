
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun, 
  Save,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { user, isAdmin, isCompany } = useUser();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    notifications: {
      email: true,
      push: true,
      desktop: false,
      projectUpdates: true,
      teamMessages: true,
      systemAlerts: true
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      onlineStatus: true
    },
    preferences: {
      autoSave: true,
      compactView: false,
      showTips: true
    }
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      // Load user settings from localStorage or database
      const savedSettings = localStorage.getItem(`settings_${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Save settings to localStorage (in a real app, you'd save to database)
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
      
      // Apply theme
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      theme: "light",
      language: "en",
      notifications: {
        email: true,
        push: true,
        desktop: false,
        projectUpdates: true,
        teamMessages: true,
        systemAlerts: true
      },
      privacy: {
        profileVisible: true,
        activityVisible: false,
        onlineStatus: true
      },
      preferences: {
        autoSave: true,
        compactView: false,
        showTips: true
      }
    });
    toast.success('Settings reset to default');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-emerald-600 border-t-transparent rounded-full" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Customize your account preferences and notifications</p>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Palette className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-emerald-700">Appearance</CardTitle>
                  <CardDescription>Customize how the interface looks</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="theme" className="text-sm font-medium text-gray-700 mb-2 block">
                    Theme
                  </Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block">
                    Language
                  </Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-emerald-700">Notifications</CardTitle>
                  <CardDescription>Control when and how you receive notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Push Notifications</Label>
                    <p className="text-xs text-gray-500">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Desktop Notifications</Label>
                    <p className="text-xs text-gray-500">Show desktop notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.desktop}
                    onCheckedChange={(checked) => handleNotificationChange('desktop', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Project Updates</Label>
                    <p className="text-xs text-gray-500">Notifications for project changes</p>
                  </div>
                  <Switch
                    checked={settings.notifications.projectUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('projectUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Team Messages</Label>
                    <p className="text-xs text-gray-500">Notifications for team communications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.teamMessages}
                    onCheckedChange={(checked) => handleNotificationChange('teamMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">System Alerts</Label>
                    <p className="text-xs text-gray-500">Important system notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-emerald-700">Privacy</CardTitle>
                  <CardDescription>Control your privacy and visibility settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Profile Visible</Label>
                    <p className="text-xs text-gray-500">Allow others to see your profile</p>
                  </div>
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Activity Visible</Label>
                    <p className="text-xs text-gray-500">Show your activity to team members</p>
                  </div>
                  <Switch
                    checked={settings.privacy.activityVisible}
                    onCheckedChange={(checked) => handlePrivacyChange('activityVisible', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Online Status</Label>
                    <p className="text-xs text-gray-500">Show when you're online</p>
                  </div>
                  <Switch
                    checked={settings.privacy.onlineStatus}
                    onCheckedChange={(checked) => handlePrivacyChange('onlineStatus', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-emerald-700">Preferences</CardTitle>
                  <CardDescription>General application preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Auto Save</Label>
                    <p className="text-xs text-gray-500">Automatically save your work</p>
                  </div>
                  <Switch
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Compact View</Label>
                    <p className="text-xs text-gray-500">Use compact interface layout</p>
                  </div>
                  <Switch
                    checked={settings.preferences.compactView}
                    onCheckedChange={(checked) => handlePreferenceChange('compactView', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Show Tips</Label>
                    <p className="text-xs text-gray-500">Display helpful tips and guidance</p>
                  </div>
                  <Switch
                    checked={settings.preferences.showTips}
                    onCheckedChange={(checked) => handlePreferenceChange('showTips', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={saveSettings}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button
              variant="outline"
              onClick={resetSettings}
              className="border-amber-300 hover:bg-amber-50 flex-1"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
