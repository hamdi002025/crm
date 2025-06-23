function handler({ method, body, query }) {
  if (method === "GET") {
    const {
      notificationId,
      userId,
      type,
      priority,
      status,
      read,
      limit = 50,
      offset = 0,
    } = query || {};

    if (notificationId) {
      return getNotification(notificationId);
    }

    return getNotifications({
      userId,
      type,
      priority,
      status,
      read: read !== undefined ? read === "true" : undefined,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  }

  if (method === "POST") {
    const { action } = body || {};

    switch (action) {
      case "create":
        return createNotification(body);
      case "markRead":
        return markNotificationRead(body);
      case "markUnread":
        return markNotificationUnread(body);
      case "markAllRead":
        return markAllNotificationsRead(body);
      case "dismiss":
        return dismissNotification(body);
      case "updatePreferences":
        return updateNotificationPreferences(body);
      case "getPreferences":
        return getNotificationPreferences(body);
      case "sendBulk":
        return sendBulkNotifications(body);
      default:
        return createNotification(body);
    }
  }

  if (method === "PUT") {
    return updateNotification(body);
  }

  if (method === "DELETE") {
    const { notificationId, userId } = body || {};
    if (userId && !notificationId) {
      return deleteAllUserNotifications(userId);
    }
    return deleteNotification(notificationId);
  }

  return {
    success: false,
    error: "Method not allowed. Use GET, POST, PUT, or DELETE.",
  };
}

function createNotification({
  userId,
  type,
  title,
  message,
  priority = "medium",
  deliveryMethods = ["in-app"],
  data = {},
  scheduledFor,
  expiresAt,
}) {
  if (!userId || !type || !title || !message) {
    return {
      success: false,
      error: "Missing required fields: userId, type, title, message",
    };
  }

  const validTypes = [
    "system",
    "lead",
    "deal",
    "task",
    "contact",
    "import",
    "report",
    "security",
    "marketing",
    "reminder",
  ];

  if (!validTypes.includes(type)) {
    return {
      success: false,
      error: `Invalid notification type. Use: ${validTypes.join(", ")}`,
    };
  }

  const validPriorities = ["low", "medium", "high", "urgent"];
  if (!validPriorities.includes(priority)) {
    return {
      success: false,
      error: `Invalid priority. Use: ${validPriorities.join(", ")}`,
    };
  }

  const validDeliveryMethods = ["in-app", "email", "sms", "push", "webhook"];
  const invalidMethods = deliveryMethods.filter(
    (method) => !validDeliveryMethods.includes(method)
  );
  if (invalidMethods.length > 0) {
    return {
      success: false,
      error: `Invalid delivery methods: ${invalidMethods.join(
        ", "
      )}. Use: ${validDeliveryMethods.join(", ")}`,
    };
  }

  const notificationId = generateNotificationId();
  const timestamp = new Date().toISOString();

  const notification = {
    id: notificationId,
    userId,
    type,
    title,
    message,
    priority,
    status: scheduledFor ? "scheduled" : "sent",
    read: false,
    dismissed: false,
    deliveryMethods,
    deliveryStatus: {},
    data,
    scheduledFor: scheduledFor || null,
    expiresAt: expiresAt || null,
    createdAt: timestamp,
    updatedAt: timestamp,
    readAt: null,
    dismissedAt: null,
  };

  deliveryMethods.forEach((method) => {
    notification.deliveryStatus[method] = {
      status: scheduledFor ? "scheduled" : "pending",
      attempts: 0,
      lastAttempt: null,
      deliveredAt: null,
      error: null,
    };
  });

  if (!scheduledFor) {
    simulateNotificationDelivery(notification);
  }

  return {
    success: true,
    message: "Notification created successfully",
    notification,
  };
}

function getNotification(notificationId) {
  if (!notificationId) {
    return {
      success: false,
      error: "Notification ID is required",
    };
  }

  const notification = getNotificationById(notificationId);
  if (!notification) {
    return {
      success: false,
      error: "Notification not found",
    };
  }

  return {
    success: true,
    notification,
  };
}

function getNotifications({
  userId,
  type,
  priority,
  status,
  read,
  limit,
  offset,
}) {
  const allNotifications = getMockNotifications();

  let filteredNotifications = allNotifications;

  if (userId) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.userId === userId
    );
  }

  if (type) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.type === type
    );
  }

  if (priority) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.priority === priority
    );
  }

  if (status) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.status === status
    );
  }

  if (read !== undefined) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.read === read
    );
  }

  filteredNotifications.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const total = filteredNotifications.length;
  const notifications = filteredNotifications.slice(offset, offset + limit);

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;
  const priorityCount = {
    urgent: filteredNotifications.filter(
      (n) => n.priority === "urgent" && !n.read
    ).length,
    high: filteredNotifications.filter((n) => n.priority === "high" && !n.read)
      .length,
    medium: filteredNotifications.filter(
      (n) => n.priority === "medium" && !n.read
    ).length,
    low: filteredNotifications.filter((n) => n.priority === "low" && !n.read)
      .length,
  };

  return {
    success: true,
    notifications,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
    summary: {
      unreadCount,
      priorityCount,
    },
  };
}

function markNotificationRead({ notificationId, userId }) {
  if (!notificationId) {
    return {
      success: false,
      error: "Notification ID is required",
    };
  }

  const notification = getNotificationById(notificationId);
  if (!notification) {
    return {
      success: false,
      error: "Notification not found",
    };
  }

  if (userId && notification.userId !== userId) {
    return {
      success: false,
      error: "Unauthorized to modify this notification",
    };
  }

  notification.read = true;
  notification.readAt = new Date().toISOString();
  notification.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Notification marked as read",
    notification,
  };
}

function markNotificationUnread({ notificationId, userId }) {
  if (!notificationId) {
    return {
      success: false,
      error: "Notification ID is required",
    };
  }

  const notification = getNotificationById(notificationId);
  if (!notification) {
    return {
      success: false,
      error: "Notification not found",
    };
  }

  if (userId && notification.userId !== userId) {
    return {
      success: false,
      error: "Unauthorized to modify this notification",
    };
  }

  notification.read = false;
  notification.readAt = null;
  notification.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Notification marked as unread",
    notification,
  };
}

function markAllNotificationsRead({ userId, type, priority }) {
  if (!userId) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  const notifications = getMockNotifications().filter((n) => {
    if (n.userId !== userId) return false;
    if (n.read) return false;
    if (type && n.type !== type) return false;
    if (priority && n.priority !== priority) return false;
    return true;
  });

  const timestamp = new Date().toISOString();
  let updatedCount = 0;

  notifications.forEach((notification) => {
    notification.read = true;
    notification.readAt = timestamp;
    notification.updatedAt = timestamp;
    updatedCount++;
  });

  return {
    success: true,
    message: `${updatedCount} notifications marked as read`,
    updatedCount,
  };
}

function dismissNotification({ notificationId, userId }) {
  if (!notificationId) {
    return {
      success: false,
      error: "Notification ID is required",
    };
  }

  const notification = getNotificationById(notificationId);
  if (!notification) {
    return {
      success: false,
      error: "Notification not found",
    };
  }

  if (userId && notification.userId !== userId) {
    return {
      success: false,
      error: "Unauthorized to modify this notification",
    };
  }

  notification.dismissed = true;
  notification.dismissedAt = new Date().toISOString();
  notification.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Notification dismissed",
    notification,
  };
}

function updateNotification({
  notificationId,
  title,
  message,
  priority,
  expiresAt,
  data,
}) {
  if (!notificationId) {
    return {
      success: false,
      error: "Notification ID is required",
    };
  }

  const notification = getNotificationById(notificationId);
  if (!notification) {
    return {
      success: false,
      error: "Notification not found",
    };
  }

  if (notification.status === "delivered") {
    return {
      success: false,
      error: "Cannot update delivered notifications",
    };
  }

  if (title) notification.title = title;
  if (message) notification.message = message;
  if (priority) {
    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!validPriorities.includes(priority)) {
      return {
        success: false,
        error: `Invalid priority. Use: ${validPriorities.join(", ")}`,
      };
    }
    notification.priority = priority;
  }
  if (expiresAt !== undefined) notification.expiresAt = expiresAt;
  if (data) notification.data = { ...notification.data, ...data };

  notification.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Notification updated successfully",
    notification,
  };
}

function deleteNotification(notificationId) {
  if (!notificationId) {
    return {
      success: false,
      error: "Notification ID is required",
    };
  }

  const notification = getNotificationById(notificationId);
  if (!notification) {
    return {
      success: false,
      error: "Notification not found",
    };
  }

  return {
    success: true,
    message: "Notification deleted successfully",
    notificationId,
  };
}

function deleteAllUserNotifications(userId) {
  if (!userId) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  const userNotifications = getMockNotifications().filter(
    (n) => n.userId === userId
  );
  const deletedCount = userNotifications.length;

  return {
    success: true,
    message: `${deletedCount} notifications deleted`,
    deletedCount,
  };
}

function updateNotificationPreferences({ userId, preferences }) {
  if (!userId || !preferences) {
    return {
      success: false,
      error: "User ID and preferences are required",
    };
  }

  const defaultPreferences = getDefaultNotificationPreferences();
  const updatedPreferences = { ...defaultPreferences, ...preferences };

  return {
    success: true,
    message: "Notification preferences updated successfully",
    preferences: updatedPreferences,
  };
}

function getNotificationPreferences({ userId }) {
  if (!userId) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  const preferences = getDefaultNotificationPreferences();

  return {
    success: true,
    preferences,
  };
}

function sendBulkNotifications({ notifications }) {
  if (!notifications || !Array.isArray(notifications)) {
    return {
      success: false,
      error: "Notifications array is required",
    };
  }

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  notifications.forEach((notificationData, index) => {
    const result = createNotification(notificationData);
    results.push({
      index,
      ...result,
    });

    if (result.success) {
      successCount++;
    } else {
      failureCount++;
    }
  });

  return {
    success: true,
    message: `Bulk notification processing completed`,
    summary: {
      total: notifications.length,
      successful: successCount,
      failed: failureCount,
    },
    results,
  };
}

function getNotificationById(notificationId) {
  const notifications = getMockNotifications();
  return notifications.find((n) => n.id === notificationId);
}

function getMockNotifications() {
  return [
    {
      id: "notif_001",
      userId: "user_123",
      type: "lead",
      title: "New Lead Assigned",
      message: "You have been assigned a new lead: John Smith from Acme Corp",
      priority: "high",
      status: "delivered",
      read: false,
      dismissed: false,
      deliveryMethods: ["in-app", "email"],
      deliveryStatus: {
        "in-app": {
          status: "delivered",
          attempts: 1,
          lastAttempt: "2024-01-16T10:00:00Z",
          deliveredAt: "2024-01-16T10:00:00Z",
          error: null,
        },
        email: {
          status: "delivered",
          attempts: 1,
          lastAttempt: "2024-01-16T10:00:30Z",
          deliveredAt: "2024-01-16T10:00:30Z",
          error: null,
        },
      },
      data: {
        leadId: "lead_456",
        leadName: "John Smith",
        company: "Acme Corp",
        value: 5000,
      },
      scheduledFor: null,
      expiresAt: null,
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
      readAt: null,
      dismissedAt: null,
    },
    {
      id: "notif_002",
      userId: "user_123",
      type: "deal",
      title: "Deal Stage Updated",
      message: "Deal 'Website Redesign' moved to Negotiation stage",
      priority: "medium",
      status: "delivered",
      read: true,
      dismissed: false,
      deliveryMethods: ["in-app"],
      deliveryStatus: {
        "in-app": {
          status: "delivered",
          attempts: 1,
          lastAttempt: "2024-01-16T09:30:00Z",
          deliveredAt: "2024-01-16T09:30:00Z",
          error: null,
        },
      },
      data: {
        dealId: "deal_789",
        dealName: "Website Redesign",
        oldStage: "Proposal",
        newStage: "Negotiation",
        value: 15000,
      },
      scheduledFor: null,
      expiresAt: null,
      createdAt: "2024-01-16T09:30:00Z",
      updatedAt: "2024-01-16T09:45:00Z",
      readAt: "2024-01-16T09:45:00Z",
      dismissedAt: null,
    },
    {
      id: "notif_003",
      userId: "user_123",
      type: "system",
      title: "System Maintenance Scheduled",
      message: "System maintenance is scheduled for tonight at 2:00 AM EST",
      priority: "urgent",
      status: "delivered",
      read: false,
      dismissed: false,
      deliveryMethods: ["in-app", "email", "push"],
      deliveryStatus: {
        "in-app": {
          status: "delivered",
          attempts: 1,
          lastAttempt: "2024-01-16T08:00:00Z",
          deliveredAt: "2024-01-16T08:00:00Z",
          error: null,
        },
        email: {
          status: "delivered",
          attempts: 1,
          lastAttempt: "2024-01-16T08:00:15Z",
          deliveredAt: "2024-01-16T08:00:15Z",
          error: null,
        },
        push: {
          status: "failed",
          attempts: 2,
          lastAttempt: "2024-01-16T08:01:00Z",
          deliveredAt: null,
          error: "Push notification service unavailable",
        },
      },
      data: {
        maintenanceStart: "2024-01-17T07:00:00Z",
        maintenanceEnd: "2024-01-17T09:00:00Z",
        affectedServices: ["CRM", "Reports", "API"],
      },
      scheduledFor: null,
      expiresAt: "2024-01-17T12:00:00Z",
      createdAt: "2024-01-16T08:00:00Z",
      updatedAt: "2024-01-16T08:00:00Z",
      readAt: null,
      dismissedAt: null,
    },
    {
      id: "notif_004",
      userId: "user_456",
      type: "task",
      title: "Task Due Soon",
      message: "Task 'Follow up with client' is due in 2 hours",
      priority: "high",
      status: "delivered",
      read: false,
      dismissed: false,
      deliveryMethods: ["in-app", "email"],
      deliveryStatus: {
        "in-app": {
          status: "delivered",
          attempts: 1,
          lastAttempt: "2024-01-16T11:00:00Z",
          deliveredAt: "2024-01-16T11:00:00Z",
          error: null,
        },
        email: {
          status: "delivered",
          attempts: 1,
          lastAttempt: "2024-01-16T11:00:10Z",
          deliveredAt: "2024-01-16T11:00:10Z",
          error: null,
        },
      },
      data: {
        taskId: "task_321",
        taskName: "Follow up with client",
        dueDate: "2024-01-16T13:00:00Z",
        assignedTo: "user_456",
      },
      scheduledFor: null,
      expiresAt: "2024-01-16T13:00:00Z",
      createdAt: "2024-01-16T11:00:00Z",
      updatedAt: "2024-01-16T11:00:00Z",
      readAt: null,
      dismissedAt: null,
    },
  ];
}

function getDefaultNotificationPreferences() {
  return {
    deliveryMethods: {
      "in-app": true,
      email: true,
      sms: false,
      push: true,
      webhook: false,
    },
    types: {
      system: {
        enabled: true,
        deliveryMethods: ["in-app", "email"],
        priority: "high",
      },
      lead: {
        enabled: true,
        deliveryMethods: ["in-app", "email"],
        priority: "medium",
      },
      deal: {
        enabled: true,
        deliveryMethods: ["in-app"],
        priority: "medium",
      },
      task: {
        enabled: true,
        deliveryMethods: ["in-app", "email"],
        priority: "high",
      },
      contact: {
        enabled: true,
        deliveryMethods: ["in-app"],
        priority: "low",
      },
      import: {
        enabled: true,
        deliveryMethods: ["in-app", "email"],
        priority: "medium",
      },
      report: {
        enabled: true,
        deliveryMethods: ["email"],
        priority: "low",
      },
      security: {
        enabled: true,
        deliveryMethods: ["in-app", "email", "sms"],
        priority: "urgent",
      },
      marketing: {
        enabled: false,
        deliveryMethods: ["email"],
        priority: "low",
      },
      reminder: {
        enabled: true,
        deliveryMethods: ["in-app", "push"],
        priority: "medium",
      },
    },
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
      timezone: "UTC",
    },
    digest: {
      enabled: true,
      frequency: "daily",
      time: "09:00",
      includeRead: false,
    },
  };
}

function generateNotificationId() {
  return "notif_" + Math.random().toString(36).substr(2, 9);
}

function simulateNotificationDelivery(notification) {
  notification.deliveryMethods.forEach((method) => {
    setTimeout(() => {
      const success = Math.random() > 0.1;
      const timestamp = new Date().toISOString();

      notification.deliveryStatus[method] = {
        status: success ? "delivered" : "failed",
        attempts: 1,
        lastAttempt: timestamp,
        deliveredAt: success ? timestamp : null,
        error: success ? null : `Failed to deliver via ${method}`,
      };

      notification.updatedAt = timestamp;
    }, Math.random() * 1000);
  });
}
export async function POST(request) {
  return handler(await request.json());
}