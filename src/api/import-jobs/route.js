function handler({ method, body, query }) {
  if (method === "GET") {
    const { jobId, status, limit = 50, offset = 0 } = query || {};

    if (jobId) {
      return getImportJob(jobId);
    }

    return getImportJobs({
      status,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  }

  if (method === "POST") {
    const { action } = body || {};

    switch (action) {
      case "create":
        return createImportJob(body);
      case "start":
        return startImportJob(body);
      case "cancel":
        return cancelImportJob(body);
      case "validate":
        return validateImportData(body);
      case "preview":
        return previewImportData(body);
      default:
        return {
          success: false,
          error:
            "Invalid action. Use 'create', 'start', 'cancel', 'validate', or 'preview'",
        };
    }
  }

  if (method === "PUT") {
    return updateImportJob(body);
  }

  if (method === "DELETE") {
    const { jobId } = body || {};
    return deleteImportJob(jobId);
  }

  return {
    success: false,
    error: "Method not allowed. Use GET, POST, PUT, or DELETE.",
  };
}

function createImportJob({
  fileName,
  fileUrl,
  fileType,
  targetEntity,
  columnMapping,
  options = {},
}) {
  if (!fileName || !fileUrl || !fileType || !targetEntity) {
    return {
      success: false,
      error:
        "Missing required fields: fileName, fileUrl, fileType, targetEntity",
    };
  }

  if (!["csv", "excel", "xlsx", "xls"].includes(fileType.toLowerCase())) {
    return {
      success: false,
      error: "Unsupported file type. Use csv, excel, xlsx, or xls",
    };
  }

  if (!["contacts", "leads", "deals", "companies"].includes(targetEntity)) {
    return {
      success: false,
      error: "Invalid target entity. Use contacts, leads, deals, or companies",
    };
  }

  const jobId = generateJobId();
  const timestamp = new Date().toISOString();

  const job = {
    id: jobId,
    fileName,
    fileUrl,
    fileType: fileType.toLowerCase(),
    targetEntity,
    columnMapping: columnMapping || {},
    options: {
      skipFirstRow: options.skipFirstRow !== false,
      duplicateHandling: options.duplicateHandling || "skip",
      batchSize: options.batchSize || 100,
      validateOnly: options.validateOnly || false,
      ...options,
    },
    status: "created",
    progress: {
      totalRows: 0,
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      percentage: 0,
    },
    validation: {
      isValid: null,
      errors: [],
      warnings: [],
    },
    results: {
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
    },
    errors: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    startedAt: null,
    completedAt: null,
  };

  return {
    success: true,
    message: "Import job created successfully",
    job,
  };
}

function startImportJob({ jobId, columnMapping }) {
  if (!jobId) {
    return {
      success: false,
      error: "Job ID is required",
    };
  }

  const job = getJobById(jobId);
  if (!job) {
    return {
      success: false,
      error: "Import job not found",
    };
  }

  if (job.status !== "created" && job.status !== "validated") {
    return {
      success: false,
      error: `Cannot start job with status: ${job.status}`,
    };
  }

  if (columnMapping) {
    job.columnMapping = columnMapping;
  }

  if (!job.columnMapping || Object.keys(job.columnMapping).length === 0) {
    return {
      success: false,
      error: "Column mapping is required before starting import",
    };
  }

  job.status = "processing";
  job.startedAt = new Date().toISOString();
  job.updatedAt = new Date().toISOString();

  simulateImportProcess(job);

  return {
    success: true,
    message: "Import job started successfully",
    job,
  };
}

function cancelImportJob({ jobId }) {
  if (!jobId) {
    return {
      success: false,
      error: "Job ID is required",
    };
  }

  const job = getJobById(jobId);
  if (!job) {
    return {
      success: false,
      error: "Import job not found",
    };
  }

  if (!["created", "processing", "validated"].includes(job.status)) {
    return {
      success: false,
      error: `Cannot cancel job with status: ${job.status}`,
    };
  }

  job.status = "cancelled";
  job.updatedAt = new Date().toISOString();
  job.completedAt = new Date().toISOString();

  return {
    success: true,
    message: "Import job cancelled successfully",
    job,
  };
}

function validateImportData({ jobId, sampleSize = 100 }) {
  if (!jobId) {
    return {
      success: false,
      error: "Job ID is required",
    };
  }

  const job = getJobById(jobId);
  if (!job) {
    return {
      success: false,
      error: "Import job not found",
    };
  }

  const validation = performDataValidation(job, sampleSize);

  job.validation = validation;
  job.status = validation.isValid ? "validated" : "validation_failed";
  job.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Data validation completed",
    job,
    validation,
  };
}

function previewImportData({ jobId, rowCount = 10 }) {
  if (!jobId) {
    return {
      success: false,
      error: "Job ID is required",
    };
  }

  const job = getJobById(jobId);
  if (!job) {
    return {
      success: false,
      error: "Import job not found",
    };
  }

  const preview = generatePreviewData(job, rowCount);

  return {
    success: true,
    message: "Preview data generated",
    preview,
    job: {
      id: job.id,
      fileName: job.fileName,
      targetEntity: job.targetEntity,
      columnMapping: job.columnMapping,
    },
  };
}

function updateImportJob({ jobId, columnMapping, options }) {
  if (!jobId) {
    return {
      success: false,
      error: "Job ID is required",
    };
  }

  const job = getJobById(jobId);
  if (!job) {
    return {
      success: false,
      error: "Import job not found",
    };
  }

  if (!["created", "validated", "validation_failed"].includes(job.status)) {
    return {
      success: false,
      error: `Cannot update job with status: ${job.status}`,
    };
  }

  if (columnMapping) {
    job.columnMapping = { ...job.columnMapping, ...columnMapping };
  }

  if (options) {
    job.options = { ...job.options, ...options };
  }

  job.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Import job updated successfully",
    job,
  };
}

function deleteImportJob(jobId) {
  if (!jobId) {
    return {
      success: false,
      error: "Job ID is required",
    };
  }

  const job = getJobById(jobId);
  if (!job) {
    return {
      success: false,
      error: "Import job not found",
    };
  }

  if (job.status === "processing") {
    return {
      success: false,
      error: "Cannot delete job that is currently processing",
    };
  }

  return {
    success: true,
    message: "Import job deleted successfully",
    jobId,
  };
}

function getImportJob(jobId) {
  const job = getJobById(jobId);
  if (!job) {
    return {
      success: false,
      error: "Import job not found",
    };
  }

  return {
    success: true,
    job,
  };
}

function getImportJobs({ status, limit, offset }) {
  const allJobs = getMockJobs();

  let filteredJobs = allJobs;
  if (status) {
    filteredJobs = allJobs.filter((job) => job.status === status);
  }

  const total = filteredJobs.length;
  const jobs = filteredJobs.slice(offset, offset + limit);

  return {
    success: true,
    jobs,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

function getJobById(jobId) {
  const jobs = getMockJobs();
  return jobs.find((job) => job.id === jobId);
}

function getMockJobs() {
  return [
    {
      id: "job_001",
      fileName: "contacts_import.csv",
      fileUrl: "https://example.com/files/contacts_import.csv",
      fileType: "csv",
      targetEntity: "contacts",
      columnMapping: {
        "First Name": "firstName",
        "Last Name": "lastName",
        Email: "email",
        Phone: "phone",
        Company: "company",
      },
      options: {
        skipFirstRow: true,
        duplicateHandling: "update",
        batchSize: 100,
      },
      status: "completed",
      progress: {
        totalRows: 1500,
        processedRows: 1500,
        successfulRows: 1450,
        failedRows: 50,
        percentage: 100,
      },
      validation: {
        isValid: true,
        errors: [],
        warnings: ["50 rows have invalid phone numbers"],
      },
      results: {
        created: 1200,
        updated: 250,
        skipped: 0,
        failed: 50,
      },
      errors: [],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:15:00Z",
      startedAt: "2024-01-15T10:05:00Z",
      completedAt: "2024-01-15T10:15:00Z",
    },
    {
      id: "job_002",
      fileName: "leads_data.xlsx",
      fileUrl: "https://example.com/files/leads_data.xlsx",
      fileType: "xlsx",
      targetEntity: "leads",
      columnMapping: {},
      options: {
        skipFirstRow: true,
        duplicateHandling: "skip",
        batchSize: 50,
      },
      status: "created",
      progress: {
        totalRows: 0,
        processedRows: 0,
        successfulRows: 0,
        failedRows: 0,
        percentage: 0,
      },
      validation: {
        isValid: null,
        errors: [],
        warnings: [],
      },
      results: {
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
      },
      errors: [],
      createdAt: "2024-01-16T09:30:00Z",
      updatedAt: "2024-01-16T09:30:00Z",
      startedAt: null,
      completedAt: null,
    },
  ];
}

function generateJobId() {
  return "job_" + Math.random().toString(36).substr(2, 9);
}

function performDataValidation(job, sampleSize) {
  const errors = [];
  const warnings = [];

  if (!job.columnMapping || Object.keys(job.columnMapping).length === 0) {
    errors.push("Column mapping is required");
  }

  const requiredFields = getRequiredFields(job.targetEntity);
  const mappedFields = Object.values(job.columnMapping);

  for (const field of requiredFields) {
    if (!mappedFields.includes(field)) {
      errors.push(`Required field '${field}' is not mapped`);
    }
  }

  if (job.fileType === "csv" && !job.options.skipFirstRow) {
    warnings.push("Consider skipping the first row if it contains headers");
  }

  const mockValidationResults = generateMockValidationResults(sampleSize);
  errors.push(...mockValidationResults.errors);
  warnings.push(...mockValidationResults.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sampleSize,
    validatedAt: new Date().toISOString(),
  };
}

function generateMockValidationResults(sampleSize) {
  const errors = [];
  const warnings = [];

  if (Math.random() > 0.7) {
    errors.push(
      `${Math.floor(Math.random() * 5) + 1} rows have invalid email format`
    );
  }

  if (Math.random() > 0.8) {
    warnings.push(
      `${Math.floor(Math.random() * 10) + 1} rows have missing phone numbers`
    );
  }

  if (Math.random() > 0.9) {
    errors.push("Duplicate entries found in rows 15, 23, 45");
  }

  return { errors, warnings };
}

function generatePreviewData(job, rowCount) {
  const headers = Object.keys(job.columnMapping);
  const mappedHeaders = Object.values(job.columnMapping);

  const sampleData = [];
  for (let i = 0; i < rowCount; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = generateSampleValue(mappedHeaders[index], i);
    });
    sampleData.push(row);
  }

  return {
    headers,
    mappedHeaders,
    sampleData,
    totalPreviewRows: rowCount,
    estimatedTotalRows: Math.floor(Math.random() * 5000) + 100,
  };
}

function generateSampleValue(fieldType, index) {
  const samples = {
    firstName: ["John", "Jane", "Mike", "Sarah", "David"],
    lastName: ["Smith", "Johnson", "Williams", "Brown", "Jones"],
    email: ["john@example.com", "jane@company.com", "mike@test.org"],
    phone: ["+1-555-0123", "+1-555-0456", "+1-555-0789"],
    company: ["Acme Corp", "Tech Solutions", "Global Industries"],
  };

  if (samples[fieldType]) {
    return samples[fieldType][index % samples[fieldType].length];
  }

  return `Sample ${fieldType} ${index + 1}`;
}

function getRequiredFields(targetEntity) {
  const requiredFields = {
    contacts: ["firstName", "lastName", "email"],
    leads: ["firstName", "lastName", "email"],
    deals: ["title", "value", "stage"],
    companies: ["name", "email"],
  };

  return requiredFields[targetEntity] || [];
}

function simulateImportProcess(job) {
  const totalRows = Math.floor(Math.random() * 2000) + 100;
  job.progress.totalRows = totalRows;

  setTimeout(() => {
    job.progress.processedRows = Math.floor(totalRows * 0.3);
    job.progress.percentage = 30;
    job.updatedAt = new Date().toISOString();
  }, 1000);

  setTimeout(() => {
    job.progress.processedRows = Math.floor(totalRows * 0.7);
    job.progress.percentage = 70;
    job.updatedAt = new Date().toISOString();
  }, 3000);

  setTimeout(() => {
    const successfulRows = Math.floor(totalRows * 0.95);
    const failedRows = totalRows - successfulRows;

    job.progress.processedRows = totalRows;
    job.progress.successfulRows = successfulRows;
    job.progress.failedRows = failedRows;
    job.progress.percentage = 100;

    job.results.created = Math.floor(successfulRows * 0.8);
    job.results.updated = Math.floor(successfulRows * 0.2);
    job.results.failed = failedRows;

    job.status = "completed";
    job.completedAt = new Date().toISOString();
    job.updatedAt = new Date().toISOString();
  }, 5000);
}

function MainComponent() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [fileUrl, setFileUrl] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [upload, { loading: uploading }] = useUpload();
  const [error, setError] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [columnMapping, setColumnMapping] = React.useState({});
  const [targetEntity, setTargetEntity] = React.useState("contacts");
  const [importOptions, setImportOptions] = React.useState({
    skipFirstRow: true,
    duplicateHandling: "skip",
    batchSize: 100,
  });
  const [currentJob, setCurrentJob] = React.useState(null);
  const [validationResults, setValidationResults] = React.useState(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    {
      id: "dashboard",
      name: "Tableau de bord",
      icon: "fas fa-chart-line",
      path: "/dashboard",
    },
    {
      id: "contacts",
      name: "Contacts",
      icon: "fas fa-users",
      path: "/contacts",
    },
    {
      id: "leads",
      name: "Prospects",
      icon: "fas fa-user-plus",
      path: "/leads",
    },
    { id: "deals", name: "Affaires", icon: "fas fa-handshake", path: "/deals" },
    {
      id: "workflows",
      name: "Workflows",
      icon: "fas fa-project-diagram",
      path: "/workflows",
    },
    {
      id: "import",
      name: "Import de données",
      icon: "fas fa-upload",
      path: "/import",
    },
    {
      id: "reports",
      name: "Rapports",
      icon: "fas fa-chart-bar",
      path: "/reports",
    },
    {
      id: "settings",
      name: "Paramètres",
      icon: "fas fa-cog",
      path: "/settings",
    },
    { id: "profile", name: "Profil", icon: "fas fa-user", path: "/profile" },
  ];

  const steps = [
    { id: 1, name: "Télécharger Fichier", icon: "fas fa-upload" },
    { id: 2, name: "Mapper Colonnes", icon: "fas fa-columns" },
    { id: 3, name: "Prévisualiser & Valider", icon: "fas fa-eye" },
    { id: 4, name: "Progression Import", icon: "fas fa-chart-line" },
  ];

  const entityOptions = [
    { value: "contacts", label: "Contacts", icon: "fas fa-users" },
    { value: "leads", label: "Prospects", icon: "fas fa-user-plus" },
    { value: "deals", label: "Affaires", icon: "fas fa-handshake" },
    { value: "companies", label: "Entreprises", icon: "fas fa-building" },
  ];

  const fieldMappings = {
    contacts: [
      { key: "firstName", label: "Prénom", required: true },
      { key: "lastName", label: "Nom", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Téléphone", required: false },
      { key: "company", label: "Entreprise", required: false },
      { key: "title", label: "Poste", required: false },
      { key: "address", label: "Adresse", required: false },
    ],
    leads: [
      { key: "firstName", label: "Prénom", required: true },
      { key: "lastName", label: "Nom", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Téléphone", required: false },
      { key: "company", label: "Entreprise", required: false },
      { key: "source", label: "Source du Prospect", required: false },
      { key: "status", label: "Statut", required: false },
    ],
    deals: [
      { key: "title", label: "Titre de l'Affaire", required: true },
      { key: "value", label: "Valeur", required: true },
      { key: "stage", label: "Étape", required: true },
      { key: "contactName", label: "Nom du Contact", required: false },
      { key: "company", label: "Entreprise", required: false },
      { key: "closeDate", label: "Date de Clôture Prévue", required: false },
    ],
    companies: [
      { key: "name", label: "Nom de l'Entreprise", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Téléphone", required: false },
      { key: "website", label: "Site Web", required: false },
      { key: "industry", label: "Secteur", required: false },
      { key: "address", label: "Adresse", required: false },
    ],
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setError(null);

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Veuillez télécharger un fichier CSV ou Excel");
      return;
    }

    try {
      const { url, error: uploadError } = await upload({ file });
      if (uploadError) {
        setError(uploadError);
        return;
      }

      setUploadedFile(file);
      setFileUrl(url);

      const fileType = file.type.includes("csv") ? "csv" : "xlsx";

      const response = await fetch("/api/import-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          fileName: file.name,
          fileUrl: url,
          fileType,
          targetEntity,
          options: importOptions,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Échec de création du job d'import: ${response.statusText}`
        );
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }

      setCurrentJob(result.job);
      setCurrentStep(2);

      await generatePreview(result.job.id);
    } catch (err) {
      console.error(err);
      setError("Échec du téléchargement du fichier. Veuillez réessayer.");
    }
  };

  const generatePreview = async (jobId) => {
    try {
      const response = await fetch("/api/import-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "preview",
          jobId,
          rowCount: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Échec de génération de l'aperçu: ${response.statusText}`
        );
      }

      const result = await response.json();
      if (result.success) {
        setPreviewData(result.preview);

        const autoMapping = {};
        result.preview.headers.forEach((header) => {
          const normalizedHeader = header
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          const matchingField = fieldMappings[targetEntity].find(
            (field) =>
              field.key.toLowerCase().includes(normalizedHeader) ||
              normalizedHeader.includes(field.key.toLowerCase()) ||
              field.label
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "")
                .includes(normalizedHeader)
          );
          if (matchingField) {
            autoMapping[header] = matchingField.key;
          }
        });
        setColumnMapping(autoMapping);
      }
    } catch (err) {
      console.error(err);
      setError("Échec de génération de l'aperçu");
    }
  };

  const handleColumnMappingChange = (csvColumn, crmField) => {
    setColumnMapping((prev) => ({
      ...prev,
      [csvColumn]: crmField,
    }));
  };

  const validateData = async () => {
    if (!currentJob) return;

    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch("/api/import-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          jobId: currentJob.id,
          sampleSize: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`Échec de validation: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setValidationResults(result.validation);
        setCurrentJob(result.job);
        if (result.validation.isValid) {
          setCurrentStep(4);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Échec de validation. Veuillez réessayer.");
    } finally {
      setIsValidating(false);
    }
  };

  const startImport = async () => {
    if (!currentJob) return;

    setIsImporting(true);
    setError(null);

    try {
      const response = await fetch("/api/import-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          jobId: currentJob.id,
          columnMapping,
        }),
      });

      if (!response.ok) {
        throw new Error(`Échec de l'import: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setCurrentJob(result.job);
        pollImportProgress(result.job.id);
      } else {
        setError(result.error);
        setIsImporting(false);
      }
    } catch (err) {
      console.error(err);
      setError("Échec du démarrage de l'import. Veuillez réessayer.");
      setIsImporting(false);
    }
  };

  const pollImportProgress = (jobId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/import-jobs?jobId=${jobId}`);
        if (!response.ok) return;

        const result = await response.json();
        if (result.success) {
          setCurrentJob(result.job);

          if (
            ["completed", "failed", "cancelled"].includes(result.job.status)
          ) {
            clearInterval(interval);
            setIsImporting(false);
          }
        }
      } catch (err) {
        console.error("Échec de récupération du progrès:", err);
      }
    }, 2000);
  };

  const resetImport = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setFileUrl(null);
    setError(null);
    setPreviewData(null);
    setColumnMapping({});
    setCurrentJob(null);
    setValidationResults(null);
    setIsValidating(false);
    setIsImporting(false);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              <i className={`${step.icon} text-sm`}></i>
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFileUpload = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Importer vers
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {entityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTargetEntity(option.value)}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                targetEntity === option.value
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <i className={`${option.icon} text-lg mb-1`}></i>
              <p className="text-sm font-medium">{option.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <div className="mb-4">
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Déposez votre fichier ici, ou cliquez pour parcourir
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Supporte les fichiers CSV et Excel (jusqu'à 10MB)
        </p>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <i className="fas fa-upload mr-2"></i>
          Choisir un Fichier
        </label>
      </div>

      {uploading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-blue-600">
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Téléchargement du fichier...
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">CRM Système</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                item.id === "import"
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700"
              }`}
            >
              <i className={`${item.icon} mr-3 text-lg`}></i>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Import de Données
              </h1>
              <p className="text-gray-600">
                Importez vos contacts, prospects, affaires et entreprises depuis
                des fichiers CSV ou Excel
              </p>
            </div>
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour au Tableau de bord
            </a>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {renderStepIndicator()}

          {error && (
            <div className="mb-6 max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle text-red-600 mr-2"></i>
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && renderFileUpload()}
          {/* Add other step renders here with French translations */}
        </main>
      </div>
    </div>
  );
}
export async function POST(request) {
  return handler(await request.json());
}