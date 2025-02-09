import { useState } from "react";
import { Save, Bell, Globe, Sun, Shield } from "lucide-react";

interface SettingsSection {
  id: string;
  title: string;
  icon: any;
  settings: {
    id: string;
    label: string;
    type: "toggle" | "select" | "input";
    value: any;
    options?: string[];
  }[];
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsSection[]>([
    {
      id: "general",
      title: "General",
      icon: Globe,
      settings: [
        {
          id: "language",
          label: "Language",
          type: "select",
          value: "en",
          options: ["English", "Indonesian"],
        },
        {
          id: "timezone",
          label: "Timezone",
          type: "select",
          value: "Asia/Jakarta",
          options: ["Asia/Jakarta", "Asia/Singapore", "Asia/Tokyo"],
        },
      ],
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: Sun,
      settings: [
        {
          id: "theme",
          label: "Theme",
          type: "select",
          value: "light",
          options: ["Light", "Dark"],
        },
        {
          id: "compactMode",
          label: "Compact Mode",
          type: "toggle",
          value: false,
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      settings: [
        {
          id: "orderNotifications",
          label: "Order Notifications",
          type: "toggle",
          value: true,
        },
        {
          id: "stockAlerts",
          label: "Low Stock Alerts",
          type: "toggle",
          value: true,
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      settings: [
        {
          id: "requirePin",
          label: "Require PIN for Refunds",
          type: "toggle",
          value: true,
        },
        {
          id: "sessionTimeout",
          label: "Session Timeout (minutes)",
          type: "input",
          value: "30",
        },
      ],
    },
  ]);

  const handleSettingChange = (
    sectionId: string,
    settingId: string,
    newValue: any
  ) => {
    setSettings((prevSettings) =>
      prevSettings.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            settings: section.settings.map((setting) => {
              if (setting.id === settingId) {
                return { ...setting, value: newValue };
              }
              return setting;
            }),
          };
        }
        return section;
      })
    );
  };

  const handleSave = () => {
    // In a real app, you would save these settings to your backend
    localStorage.setItem("cafeSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <section.icon className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  {section.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>

                  {setting.type === "toggle" && (
                    <button
                      onClick={() =>
                        handleSettingChange(
                          section.id,
                          setting.id,
                          !setting.value
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        setting.value ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          setting.value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}

                  {setting.type === "select" && (
                    <select
                      value={setting.value}
                      onChange={(e) =>
                        handleSettingChange(
                          section.id,
                          setting.id,
                          e.target.value
                        )
                      }
                      className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    >
                      {setting.options?.map((option) => (
                        <option key={option} value={option.toLowerCase()}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {setting.type === "input" && (
                    <input
                      type="number"
                      value={setting.value}
                      onChange={(e) =>
                        handleSettingChange(
                          section.id,
                          setting.id,
                          e.target.value
                        )
                      }
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
