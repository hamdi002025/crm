function handler({ method, body }) {
  const defaultSettings = {
    company: {
      name: "Your Company",
      address: "",
      phone: "",
      email: "",
      website: "",
      logo: "",
      timezone: "UTC",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
    },
    user: {
      theme: "light",
      language: "en",
      emailNotifications: true,
      pushNotifications: true,
      dashboardLayout: "default",
      itemsPerPage: 25,
      autoSave: true,
    },
    notifications: {
      newLeads: true,
      dealUpdates: true,
      taskReminders: true,
      systemAlerts: true,
      weeklyReports: true,
      emailDigest: "daily",
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "08:00",
      },
    },
    system: {
      dataRetention: 365,
      backupFrequency: "daily",
      twoFactorAuth: false,
      sessionTimeout: 30,
      apiRateLimit: 1000,
      maintenanceMode: false,
      debugMode: false,
    },
  };

  if (method === "GET") {
    return {
      success: true,
      settings: defaultSettings,
    };
  }

  if (method === "POST") {
    if (!body) {
      return {
        success: false,
        error: "Request body is required",
      };
    }

    const validationErrors = [];

    if (body.company) {
      if (body.company.email && !isValidEmail(body.company.email)) {
        validationErrors.push("Invalid company email format");
      }
      if (body.company.website && !isValidUrl(body.company.website)) {
        validationErrors.push("Invalid website URL format");
      }
      if (body.company.currency && !isValidCurrency(body.company.currency)) {
        validationErrors.push("Invalid currency code");
      }
    }

    if (body.user) {
      if (body.user.theme && !["light", "dark"].includes(body.user.theme)) {
        validationErrors.push("Theme must be 'light' or 'dark'");
      }
      if (body.user.language && !isValidLanguage(body.user.language)) {
        validationErrors.push("Invalid language code");
      }
      if (
        body.user.itemsPerPage &&
        (body.user.itemsPerPage < 10 || body.user.itemsPerPage > 100)
      ) {
        validationErrors.push("Items per page must be between 10 and 100");
      }
    }

    if (body.notifications) {
      if (
        body.notifications.emailDigest &&
        !["none", "daily", "weekly"].includes(body.notifications.emailDigest)
      ) {
        validationErrors.push(
          "Email digest must be 'none', 'daily', or 'weekly'"
        );
      }
      if (body.notifications.quietHours) {
        if (
          body.notifications.quietHours.start &&
          !isValidTime(body.notifications.quietHours.start)
        ) {
          validationErrors.push("Invalid quiet hours start time format");
        }
        if (
          body.notifications.quietHours.end &&
          !isValidTime(body.notifications.quietHours.end)
        ) {
          validationErrors.push("Invalid quiet hours end time format");
        }
      }
    }

    if (body.system) {
      if (
        body.system.dataRetention &&
        (body.system.dataRetention < 30 || body.system.dataRetention > 2555)
      ) {
        validationErrors.push(
          "Data retention must be between 30 and 2555 days"
        );
      }
      if (
        body.system.sessionTimeout &&
        (body.system.sessionTimeout < 5 || body.system.sessionTimeout > 480)
      ) {
        validationErrors.push(
          "Session timeout must be between 5 and 480 minutes"
        );
      }
      if (
        body.system.apiRateLimit &&
        (body.system.apiRateLimit < 100 || body.system.apiRateLimit > 10000)
      ) {
        validationErrors.push(
          "API rate limit must be between 100 and 10000 requests per hour"
        );
      }
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        error: "Validation failed",
        details: validationErrors,
      };
    }

    const updatedSettings = mergeSettings(defaultSettings, body);

    return {
      success: true,
      message: "Settings updated successfully",
      settings: updatedSettings,
    };
  }

  return {
    success: false,
    error:
      "Method not allowed. Use GET to retrieve settings or POST to update settings.",
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidCurrency(currency) {
  const validCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "CAD",
    "AUD",
    "CHF",
    "CNY",
    "INR",
  ];
  return validCurrencies.includes(currency);
}

function isValidLanguage(language) {
  const validLanguages = [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "ru",
    "zh",
    "ja",
    "ko",
  ];
  return validLanguages.includes(language);
}

function isValidTime(time) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function mergeSettings(defaults, updates) {
  const merged = JSON.parse(JSON.stringify(defaults));

  for (const section in updates) {
    if (merged[section] && typeof merged[section] === "object") {
      for (const key in updates[section]) {
        if (updates[section][key] !== undefined) {
          if (
            typeof merged[section][key] === "object" &&
            !Array.isArray(merged[section][key])
          ) {
            merged[section][key] = {
              ...merged[section][key],
              ...updates[section][key],
            };
          } else {
            merged[section][key] = updates[section][key];
          }
        }
      }
    }
  }

  return merged;
}
export async function POST(request) {
  return handler(await request.json());
}