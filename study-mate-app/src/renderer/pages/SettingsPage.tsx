import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Container,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Input,
  Button,
  Divider,
  useToast,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { FiBell, FiMoon, FiGlobe, FiDatabase, FiSave } from "react-icons/fi";
import { useSettings } from "../contexts/SettingsContext";

const SettingsPage: React.FC = () => {
  const { settings, updateSetting, saveSettings, resetSettings } =
    useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleSettingChange = (
    category: keyof typeof settings,
    key: string,
    value: any,
  ) => {
    updateSetting(category, key, value);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    // Save settings (already handled by context)
    saveSettings();

    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated and applied",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 500);
  };

  const handleExportData = () => {
    const studyActivities = localStorage.getItem("studyActivities") || "[]";
    const studyPlans = localStorage.getItem("studyPlans") || "[]";

    const exportData = {
      settings,
      studyActivities: JSON.parse(studyActivities),
      studyPlans: JSON.parse(studyPlans),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-mate-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Your data has been downloaded as a backup file",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone.",
      )
    ) {
      localStorage.clear();
      resetSettings();

      toast({
        title: "Data cleared",
        description:
          "All local data has been removed and settings reset to defaults",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" color="gray.900" mb={2}>
            Settings
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Customize your Study Mate experience
          </Text>
        </Box>

        <VStack spacing={6} align="stretch">
          {/* Notifications Settings */}
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            borderColor="gray.200"
            bg="white"
            boxShadow="sm"
          >
            <VStack spacing={4} align="stretch">
              <HStack spacing={3} align="center">
                <Icon as={FiBell} boxSize={5} color="blue.500" />
                <Text fontSize="lg" fontWeight="600" color="gray.800">
                  Notifications
                </Text>
              </HStack>

              <VStack spacing={4} align="stretch">
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel mb={0}>Study Reminders</FormLabel>
                  <Switch
                    isChecked={settings.notifications.studyReminders}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "studyReminders",
                        e.target.checked,
                      )
                    }
                  />
                </FormControl>

                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel mb={0}>Achievement Alerts</FormLabel>
                  <Switch
                    isChecked={settings.notifications.achievementAlerts}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "achievementAlerts",
                        e.target.checked,
                      )
                    }
                  />
                </FormControl>

                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel mb={0}>Daily Summary</FormLabel>
                  <Switch
                    isChecked={settings.notifications.dailySummary}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "dailySummary",
                        e.target.checked,
                      )
                    }
                  />
                </FormControl>
              </VStack>
            </VStack>
          </Box>

          {/* Appearance Settings */}
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            borderColor="gray.200"
            bg="white"
            boxShadow="sm"
          >
            <VStack spacing={4} align="stretch">
              <HStack spacing={3} align="center">
                <Icon as={FiMoon} boxSize={5} color="purple.500" />
                <Text fontSize="lg" fontWeight="600" color="gray.800">
                  Appearance
                </Text>
              </HStack>

              <VStack spacing={4} align="stretch">
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel mb={0}>Dark Mode</FormLabel>
                  <Switch
                    isChecked={settings.appearance.darkMode}
                    onChange={(e) =>
                      handleSettingChange(
                        "appearance",
                        "darkMode",
                        e.target.checked,
                      )
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Theme Color</FormLabel>
                  <Select
                    value={settings.appearance.theme}
                    onChange={(e) =>
                      handleSettingChange("appearance", "theme", e.target.value)
                    }
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Language</FormLabel>
                  <Select
                    value={settings.appearance.language}
                    onChange={(e) =>
                      handleSettingChange(
                        "appearance",
                        "language",
                        e.target.value,
                      )
                    }
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </Select>
                </FormControl>
              </VStack>
            </VStack>
          </Box>

          {/* Data Management */}
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            borderColor="gray.200"
            bg="white"
            boxShadow="sm"
          >
            <VStack spacing={4} align="stretch">
              <HStack spacing={3} align="center">
                <Icon as={FiDatabase} boxSize={5} color="green.500" />
                <Text fontSize="lg" fontWeight="600" color="gray.800">
                  Data Management
                </Text>
              </HStack>

              <VStack spacing={4} align="stretch">
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel mb={0}>Auto-save</FormLabel>
                  <Switch
                    isChecked={settings.data.autoSave}
                    onChange={(e) =>
                      handleSettingChange("data", "autoSave", e.target.checked)
                    }
                  />
                </FormControl>

                <HStack spacing={3}>
                  <Button
                    leftIcon={<FiSave />}
                    variant="outline"
                    onClick={handleExportData}
                  >
                    Export Data
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={handleClearData}
                  >
                    Clear All Data
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Save Button */}
          <HStack justify="flex-end">
            <Button
              colorScheme="blue"
              onClick={handleSaveSettings}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save Settings
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default SettingsPage;
