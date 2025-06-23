"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

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

  const steps = [
    { id: 1, name: "Upload File", icon: "fas fa-upload" },
    { id: 2, name: "Map Columns", icon: "fas fa-columns" },
    { id: 3, name: "Preview & Validate", icon: "fas fa-eye" },
    { id: 4, name: "Import Progress", icon: "fas fa-chart-line" },
  ];

  const entityOptions = [
    { value: "contacts", label: "Contacts", icon: "fas fa-users" },
    { value: "leads", label: "Leads", icon: "fas fa-user-plus" },
    { value: "deals", label: "Deals", icon: "fas fa-handshake" },
    { value: "companies", label: "Companies", icon: "fas fa-building" },
  ];

  const fieldMappings = {
    contacts: [
      { key: "firstName", label: "First Name", required: true },
      { key: "lastName", label: "Last Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "company", label: "Company", required: false },
      { key: "title", label: "Job Title", required: false },
      { key: "address", label: "Address", required: false },
    ],
    leads: [
      { key: "firstName", label: "First Name", required: true },
      { key: "lastName", label: "Last Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "company", label: "Company", required: false },
      { key: "source", label: "Lead Source", required: false },
      { key: "status", label: "Status", required: false },
    ],
    deals: [
      { key: "title", label: "Deal Title", required: true },
      { key: "value", label: "Deal Value", required: true },
      { key: "stage", label: "Stage", required: true },
      { key: "contactName", label: "Contact Name", required: false },
      { key: "company", label: "Company", required: false },
      { key: "closeDate", label: "Expected Close Date", required: false },
    ],
    companies: [
      { key: "name", label: "Company Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "website", label: "Website", required: false },
      { key: "industry", label: "Industry", required: false },
      { key: "address", label: "Address", required: false },
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
      setError("Please upload a CSV or Excel file");
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
        throw new Error(`Failed to create import job: ${response.statusText}`);
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
      setError("Failed to upload file. Please try again.");
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
        throw new Error(`Failed to generate preview: ${response.statusText}`);
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
      setError("Failed to generate preview");
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
        throw new Error(`Validation failed: ${response.statusText}`);
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
      setError("Validation failed. Please try again.");
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
        throw new Error(`Import failed: ${response.statusText}`);
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
      setError("Failed to start import. Please try again.");
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
        console.error("Failed to poll progress:", err);
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
          Import To
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
          Drop your file here, or click to browse
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Supports CSV and Excel files (up to 10MB)
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
          Choose File
        </label>
      </div>

      {uploading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-blue-600">
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Uploading file...
          </div>
        </div>
      )}
    </div>
  );

  const renderColumnMapping = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Map Your Columns
        </h3>
        <p className="text-gray-600">
          Match your file columns to CRM fields. Required fields are marked with
          *
        </p>
      </div>

      {previewData && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-800 mb-4">Column Mapping</h4>
            <div className="space-y-4">
              {previewData.headers.map((header) => (
                <div key={header} className="flex items-center space-x-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      {header}
                    </label>
                    <div className="mt-1 text-xs text-gray-500">
                      Sample: {previewData.sampleData[0]?.[header] || "N/A"}
                    </div>
                  </div>
                  <div className="w-8 flex justify-center">
                    <i className="fas fa-arrow-right text-gray-400"></i>
                  </div>
                  <div className="w-1/3">
                    <select
                      value={columnMapping[header] || ""}
                      onChange={(e) =>
                        handleColumnMappingChange(header, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select field...</option>
                      {fieldMappings[targetEntity].map((field) => (
                        <option key={field.key} value={field.key}>
                          {field.label} {field.required ? "*" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-800 mb-4">Import Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importOptions.skipFirstRow}
                    onChange={(e) =>
                      setImportOptions((prev) => ({
                        ...prev,
                        skipFirstRow: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Skip first row (headers)</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duplicate Handling
                </label>
                <select
                  value={importOptions.duplicateHandling}
                  onChange={(e) =>
                    setImportOptions((prev) => ({
                      ...prev,
                      duplicateHandling: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="skip">Skip duplicates</option>
                  <option value="update">Update existing</option>
                  <option value="create">Create anyway</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Size
                </label>
                <select
                  value={importOptions.batchSize}
                  onChange={(e) =>
                    setImportOptions((prev) => ({
                      ...prev,
                      batchSize: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={50}>50 records</option>
                  <option value={100}>100 records</option>
                  <option value={200}>200 records</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={Object.keys(columnMapping).length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreviewAndValidation = () => (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Preview & Validation
        </h3>
        <p className="text-gray-600">
          Review your data mapping and validate before importing
        </p>
      </div>

      {previewData && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-800 mb-4">Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.values(columnMapping)
                      .filter(Boolean)
                      .map((field) => {
                        const fieldInfo = fieldMappings[targetEntity].find(
                          (f) => f.key === field
                        );
                        return (
                          <th
                            key={field}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {fieldInfo?.label} {fieldInfo?.required ? "*" : ""}
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previewData.sampleData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {Object.entries(columnMapping)
                        .filter(([, field]) => field)
                        .map(([csvCol, field]) => (
                          <td
                            key={field}
                            className="px-4 py-3 text-sm text-gray-900"
                          >
                            {row[csvCol] || "-"}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Showing first 5 rows of {previewData.estimatedTotalRows} estimated
              total rows
            </p>
          </div>
        </div>
      )}

      {validationResults && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h4 className="font-medium text-gray-800 mb-4">
              Validation Results
            </h4>

            {validationResults.isValid ? (
              <div className="flex items-center text-green-600 mb-4">
                <i className="fas fa-check-circle mr-2"></i>
                <span>Data validation passed! Ready to import.</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 mb-4">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>Validation failed. Please fix the issues below.</span>
              </div>
            )}

            {validationResults.errors.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-red-600 mb-2">Errors:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {validationResults.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResults.warnings.length > 0 && (
              <div>
                <h5 className="font-medium text-yellow-600 mb-2">Warnings:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {validationResults.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-600">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Mapping
        </button>
        <div className="space-x-3">
          <button
            onClick={validateData}
            disabled={isValidating}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Validating...
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                Validate Data
              </>
            )}
          </button>
          {validationResults?.isValid && (
            <button
              onClick={startImport}
              disabled={isImporting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isImporting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Starting Import...
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-2"></i>
                  Start Import
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderImportProgress = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Import Progress
        </h3>
        <p className="text-gray-600">Monitoring your data import progress</p>
      </div>

      {currentJob && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-medium text-gray-800">
                  {currentJob.fileName}
                </h4>
                <p className="text-sm text-gray-500">
                  Importing to{" "}
                  {entityOptions.find((e) => e.value === targetEntity)?.label}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentJob.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : currentJob.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : currentJob.status === "cancelled"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {currentJob.status.charAt(0).toUpperCase() +
                  currentJob.status.slice(1)}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{currentJob.progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentJob.progress.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>
                  {currentJob.progress.processedRows} of{" "}
                  {currentJob.progress.totalRows} processed
                </span>
                <span>
                  {currentJob.progress.successfulRows} successful,{" "}
                  {currentJob.progress.failedRows} failed
                </span>
              </div>
            </div>

            {currentJob.status === "completed" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentJob.results.created}
                  </div>
                  <div className="text-sm text-green-600">Created</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentJob.results.updated}
                  </div>
                  <div className="text-sm text-blue-600">Updated</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {currentJob.results.skipped}
                  </div>
                  <div className="text-sm text-yellow-600">Skipped</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {currentJob.results.failed}
                  </div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>
            )}

            {currentJob.errors.length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-red-600 mb-2">
                  Import Errors:
                </h5>
                <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {currentJob.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 mb-1">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={resetImport}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Import Another File
              </button>
              {currentJob.status === "completed" && (
                <a
                  href="/dashboard"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  View Dashboard
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderFileUpload();
      case 2:
        return renderColumnMapping();
      case 3:
        return renderPreviewAndValidation();
      case 4:
        return renderImportProgress();
      default:
        return renderFileUpload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Import Data
                </h1>
                <p className="text-gray-600">
                  Import your contacts, leads, deals, and companies from CSV or
                  Excel files
                </p>
              </div>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {renderCurrentStep()}
      </div>
    </div>
  );
}

export default MainComponent;