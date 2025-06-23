function handler({
  action,
  workflowId,
  workflow,
  triggerId,
  executionId,
  filters,
  page = 1,
  limit = 50,
}) {
  const workflows = [
    {
      id: "wf_001",
      name: "Lead Nurturing Sequence",
      description: "Automated email sequence for new leads",
      type: "leads",
      status: "active",
      trigger: {
        type: "field_change",
        field: "status",
        value: "new",
        conditions: [],
      },
      actions: [
        {
          id: "act_001",
          type: "send_email",
          delay: 0,
          config: {
            template: "welcome_lead",
            subject: "Welcome to our CRM",
            body: "Thank you for your interest...",
          },
        },
        {
          id: "act_002",
          type: "wait",
          delay: 86400000,
          config: { duration: "1_day" },
        },
        {
          id: "act_003",
          type: "send_email",
          delay: 86400000,
          config: {
            template: "follow_up_1",
            subject: "Follow up on your interest",
            body: "We wanted to follow up...",
          },
        },
      ],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
      createdBy: "user_001",
      stats: {
        totalExecutions: 156,
        successfulExecutions: 142,
        failedExecutions: 14,
        averageExecutionTime: 2340,
        lastExecuted: "2024-01-25T09:15:00Z",
      },
    },
    {
      id: "wf_002",
      name: "Deal Stage Progression",
      description: "Automatically update deal stages based on activities",
      type: "deals",
      status: "active",
      trigger: {
        type: "activity_completed",
        field: "activity_type",
        value: "demo_completed",
        conditions: [
          { field: "deal_value", operator: "greater_than", value: 5000 },
        ],
      },
      actions: [
        {
          id: "act_004",
          type: "update_field",
          delay: 0,
          config: {
            field: "stage",
            value: "proposal",
          },
        },
        {
          id: "act_005",
          type: "create_task",
          delay: 0,
          config: {
            title: "Send proposal to {{contact.name}}",
            description: "Follow up on demo with proposal",
            dueDate: "3_days",
            assignedTo: "{{deal.owner}}",
          },
        },
      ],
      createdAt: "2024-01-10T08:00:00Z",
      updatedAt: "2024-01-22T16:45:00Z",
      createdBy: "user_002",
      stats: {
        totalExecutions: 89,
        successfulExecutions: 85,
        failedExecutions: 4,
        averageExecutionTime: 1890,
        lastExecuted: "2024-01-24T15:30:00Z",
      },
    },
    {
      id: "wf_003",
      name: "Contact Engagement Scoring",
      description: "Update contact scores based on engagement activities",
      type: "contacts",
      status: "active",
      trigger: {
        type: "activity_logged",
        field: "activity_type",
        value: "any",
        conditions: [],
      },
      actions: [
        {
          id: "act_006",
          type: "update_score",
          delay: 0,
          config: {
            scoreField: "engagement_score",
            calculation: "increment",
            value: 10,
          },
        },
        {
          id: "act_007",
          type: "conditional_action",
          delay: 0,
          config: {
            condition: {
              field: "engagement_score",
              operator: "greater_than",
              value: 80,
            },
            trueAction: {
              type: "send_notification",
              config: {
                recipient: "{{contact.owner}}",
                message: "High engagement contact: {{contact.name}}",
              },
            },
          },
        },
      ],
      createdAt: "2024-01-12T12:00:00Z",
      updatedAt: "2024-01-23T11:20:00Z",
      createdBy: "user_001",
      stats: {
        totalExecutions: 234,
        successfulExecutions: 228,
        failedExecutions: 6,
        averageExecutionTime: 890,
        lastExecuted: "2024-01-25T10:45:00Z",
      },
    },
  ];

  const executions = [
    {
      id: "exec_001",
      workflowId: "wf_001",
      status: "completed",
      startedAt: "2024-01-25T09:15:00Z",
      completedAt: "2024-01-25T09:17:20Z",
      duration: 140000,
      triggeredBy: {
        type: "field_change",
        entityId: "lead_123",
        entityType: "lead",
      },
      steps: [
        {
          actionId: "act_001",
          status: "completed",
          startedAt: "2024-01-25T09:15:00Z",
          completedAt: "2024-01-25T09:15:30Z",
          result: { emailSent: true, messageId: "msg_001" },
        },
        {
          actionId: "act_002",
          status: "waiting",
          startedAt: "2024-01-25T09:15:30Z",
          scheduledFor: "2024-01-26T09:15:30Z",
        },
      ],
      context: {
        lead: {
          id: "lead_123",
          name: "John Doe",
          email: "john@example.com",
          status: "new",
        },
      },
      errors: [],
    },
    {
      id: "exec_002",
      workflowId: "wf_002",
      status: "failed",
      startedAt: "2024-01-24T15:30:00Z",
      completedAt: "2024-01-24T15:31:15Z",
      duration: 75000,
      triggeredBy: {
        type: "activity_completed",
        entityId: "deal_456",
        entityType: "deal",
      },
      steps: [
        {
          actionId: "act_004",
          status: "completed",
          startedAt: "2024-01-24T15:30:00Z",
          completedAt: "2024-01-24T15:30:45Z",
          result: { fieldUpdated: true },
        },
        {
          actionId: "act_005",
          status: "failed",
          startedAt: "2024-01-24T15:30:45Z",
          completedAt: "2024-01-24T15:31:15Z",
          error: "Failed to create task: Invalid assignee",
        },
      ],
      context: {
        deal: {
          id: "deal_456",
          title: "Enterprise Software License",
          value: 15000,
          owner: "invalid_user",
        },
      },
      errors: ["Failed to create task: Invalid assignee"],
    },
  ];

  const triggers = [
    {
      id: "trigger_001",
      name: "Field Change Trigger",
      type: "field_change",
      description: "Triggers when a specific field value changes",
      config: {
        supportedEntities: ["contacts", "leads", "deals", "companies"],
        requiredFields: ["field", "value"],
        optionalFields: ["previousValue", "conditions"],
      },
    },
    {
      id: "trigger_002",
      name: "Activity Completed",
      type: "activity_completed",
      description: "Triggers when an activity is marked as completed",
      config: {
        supportedEntities: ["contacts", "leads", "deals"],
        requiredFields: ["activity_type"],
        optionalFields: ["conditions"],
      },
    },
    {
      id: "trigger_003",
      name: "Time-based Trigger",
      type: "scheduled",
      description: "Triggers at specific times or intervals",
      config: {
        supportedEntities: ["contacts", "leads", "deals", "companies"],
        requiredFields: ["schedule"],
        optionalFields: ["timezone", "conditions"],
      },
    },
    {
      id: "trigger_004",
      name: "Activity Logged",
      type: "activity_logged",
      description: "Triggers when any activity is logged",
      config: {
        supportedEntities: ["contacts", "leads", "deals"],
        requiredFields: [],
        optionalFields: ["activity_type", "conditions"],
      },
    },
  ];

  const actionTypes = [
    {
      id: "send_email",
      name: "Send Email",
      description: "Send an email to the contact or lead",
      config: {
        requiredFields: ["template", "subject"],
        optionalFields: ["body", "attachments", "delay"],
      },
    },
    {
      id: "update_field",
      name: "Update Field",
      description: "Update a field value on the record",
      config: {
        requiredFields: ["field", "value"],
        optionalFields: ["conditions"],
      },
    },
    {
      id: "create_task",
      name: "Create Task",
      description: "Create a new task",
      config: {
        requiredFields: ["title"],
        optionalFields: ["description", "dueDate", "assignedTo", "priority"],
      },
    },
    {
      id: "send_notification",
      name: "Send Notification",
      description: "Send a notification to a user",
      config: {
        requiredFields: ["recipient", "message"],
        optionalFields: ["type", "priority"],
      },
    },
    {
      id: "wait",
      name: "Wait/Delay",
      description: "Wait for a specified duration",
      config: {
        requiredFields: ["duration"],
        optionalFields: [],
      },
    },
    {
      id: "update_score",
      name: "Update Score",
      description: "Update a scoring field",
      config: {
        requiredFields: ["scoreField", "calculation"],
        optionalFields: ["value", "conditions"],
      },
    },
    {
      id: "conditional_action",
      name: "Conditional Action",
      description: "Execute actions based on conditions",
      config: {
        requiredFields: ["condition", "trueAction"],
        optionalFields: ["falseAction"],
      },
    },
  ];

  switch (action) {
    case "list":
      const filteredWorkflows = workflows.filter((wf) => {
        if (filters?.type && wf.type !== filters.type) return false;
        if (filters?.status && wf.status !== filters.status) return false;
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          return (
            wf.name.toLowerCase().includes(search) ||
            wf.description.toLowerCase().includes(search)
          );
        }
        return true;
      });

      const startIndex = (page - 1) * limit;
      const paginatedWorkflows = filteredWorkflows.slice(
        startIndex,
        startIndex + limit
      );

      return {
        success: true,
        workflows: paginatedWorkflows,
        pagination: {
          page,
          limit,
          total: filteredWorkflows.length,
          totalPages: Math.ceil(filteredWorkflows.length / limit),
        },
      };

    case "get":
      if (!workflowId) {
        return { success: false, error: "Workflow ID is required" };
      }

      const workflow = workflows.find((wf) => wf.id === workflowId);
      if (!workflow) {
        return { success: false, error: "Workflow not found" };
      }

      return {
        success: true,
        workflow,
      };

    case "create":
      if (!workflow || !workflow.name || !workflow.type) {
        return {
          success: false,
          error: "Workflow name and type are required",
        };
      }

      const newWorkflow = {
        id: `wf_${Date.now()}`,
        name: workflow.name,
        description: workflow.description || "",
        type: workflow.type,
        status: "draft",
        trigger: workflow.trigger || {},
        actions: workflow.actions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current_user",
        stats: {
          totalExecutions: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          averageExecutionTime: 0,
          lastExecuted: null,
        },
      };

      return {
        success: true,
        workflow: newWorkflow,
        message: "Workflow created successfully",
      };

    case "update":
      if (!workflowId) {
        return { success: false, error: "Workflow ID is required" };
      }

      const existingWorkflow = workflows.find((wf) => wf.id === workflowId);
      if (!existingWorkflow) {
        return { success: false, error: "Workflow not found" };
      }

      const updatedWorkflow = {
        ...existingWorkflow,
        ...workflow,
        id: workflowId,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        workflow: updatedWorkflow,
        message: "Workflow updated successfully",
      };

    case "delete":
      if (!workflowId) {
        return { success: false, error: "Workflow ID is required" };
      }

      const workflowToDelete = workflows.find((wf) => wf.id === workflowId);
      if (!workflowToDelete) {
        return { success: false, error: "Workflow not found" };
      }

      return {
        success: true,
        message: "Workflow deleted successfully",
      };

    case "activate":
      if (!workflowId) {
        return { success: false, error: "Workflow ID is required" };
      }

      const workflowToActivate = workflows.find((wf) => wf.id === workflowId);
      if (!workflowToActivate) {
        return { success: false, error: "Workflow not found" };
      }

      return {
        success: true,
        workflow: { ...workflowToActivate, status: "active" },
        message: "Workflow activated successfully",
      };

    case "deactivate":
      if (!workflowId) {
        return { success: false, error: "Workflow ID is required" };
      }

      const workflowToDeactivate = workflows.find((wf) => wf.id === workflowId);
      if (!workflowToDeactivate) {
        return { success: false, error: "Workflow not found" };
      }

      return {
        success: true,
        workflow: { ...workflowToDeactivate, status: "inactive" },
        message: "Workflow deactivated successfully",
      };

    case "execute":
      if (!workflowId) {
        return { success: false, error: "Workflow ID is required" };
      }

      const workflowToExecute = workflows.find((wf) => wf.id === workflowId);
      if (!workflowToExecute) {
        return { success: false, error: "Workflow not found" };
      }

      if (workflowToExecute.status !== "active") {
        return { success: false, error: "Workflow is not active" };
      }

      const execution = {
        id: `exec_${Date.now()}`,
        workflowId,
        status: "running",
        startedAt: new Date().toISOString(),
        completedAt: null,
        duration: null,
        triggeredBy: {
          type: "manual",
          userId: "current_user",
        },
        steps: [],
        context: {},
        errors: [],
      };

      return {
        success: true,
        execution,
        message: "Workflow execution started",
      };

    case "executions":
      if (!workflowId) {
        return { success: false, error: "Workflow ID is required" };
      }

      const workflowExecutions = executions.filter(
        (exec) => exec.workflowId === workflowId
      );
      const startIdx = (page - 1) * limit;
      const paginatedExecutions = workflowExecutions.slice(
        startIdx,
        startIdx + limit
      );

      return {
        success: true,
        executions: paginatedExecutions,
        pagination: {
          page,
          limit,
          total: workflowExecutions.length,
          totalPages: Math.ceil(workflowExecutions.length / limit),
        },
      };

    case "execution_details":
      if (!executionId) {
        return { success: false, error: "Execution ID is required" };
      }

      const execution_detail = executions.find(
        (exec) => exec.id === executionId
      );
      if (!execution_detail) {
        return { success: false, error: "Execution not found" };
      }

      return {
        success: true,
        execution: execution_detail,
      };

    case "triggers":
      return {
        success: true,
        triggers,
      };

    case "actions":
      return {
        success: true,
        actions: actionTypes,
      };

    case "stats":
      const totalWorkflows = workflows.length;
      const activeWorkflows = workflows.filter(
        (wf) => wf.status === "active"
      ).length;
      const totalExecutions = workflows.reduce(
        (sum, wf) => sum + wf.stats.totalExecutions,
        0
      );
      const successfulExecutions = workflows.reduce(
        (sum, wf) => sum + wf.stats.successfulExecutions,
        0
      );
      const failedExecutions = workflows.reduce(
        (sum, wf) => sum + wf.stats.failedExecutions,
        0
      );
      const successRate =
        totalExecutions > 0
          ? ((successfulExecutions / totalExecutions) * 100).toFixed(2)
          : 0;

      const workflowsByType = workflows.reduce((acc, wf) => {
        acc[wf.type] = (acc[wf.type] || 0) + 1;
        return acc;
      }, {});

      const recentExecutions = executions
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
        .slice(0, 10);

      return {
        success: true,
        stats: {
          totalWorkflows,
          activeWorkflows,
          totalExecutions,
          successfulExecutions,
          failedExecutions,
          successRate: parseFloat(successRate),
          workflowsByType,
          recentExecutions,
        },
      };

    case "validate":
      if (!workflow) {
        return { success: false, error: "Workflow data is required" };
      }

      const validationErrors = [];
      const validationWarnings = [];

      if (!workflow.name || workflow.name.trim().length === 0) {
        validationErrors.push("Workflow name is required");
      }

      if (
        !workflow.type ||
        !["contacts", "leads", "deals", "companies", "tasks"].includes(
          workflow.type
        )
      ) {
        validationErrors.push("Valid workflow type is required");
      }

      if (!workflow.trigger || !workflow.trigger.type) {
        validationErrors.push("Workflow trigger is required");
      }

      if (!workflow.actions || workflow.actions.length === 0) {
        validationErrors.push("At least one action is required");
      }

      if (workflow.actions) {
        workflow.actions.forEach((action, index) => {
          if (!action.type) {
            validationErrors.push(
              `Action ${index + 1}: Action type is required`
            );
          }
          if (!actionTypes.find((at) => at.id === action.type)) {
            validationErrors.push(`Action ${index + 1}: Invalid action type`);
          }
        });
      }

      if (
        workflow.trigger &&
        workflow.trigger.type &&
        !triggers.find((t) => t.id === workflow.trigger.type)
      ) {
        validationErrors.push("Invalid trigger type");
      }

      if (workflow.actions && workflow.actions.length > 10) {
        validationWarnings.push(
          "Workflows with many actions may impact performance"
        );
      }

      return {
        success: true,
        validation: {
          isValid: validationErrors.length === 0,
          errors: validationErrors,
          warnings: validationWarnings,
        },
      };

    default:
      return {
        success: false,
        error:
          "Invalid action. Supported actions: list, get, create, update, delete, activate, deactivate, execute, executions, execution_details, triggers, actions, stats, validate",
      };
  }
}
export async function POST(request) {
  return handler(await request.json());
}