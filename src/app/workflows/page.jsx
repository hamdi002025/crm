"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = React.useState(null);
  const [workflows, setWorkflows] = React.useState([
    {
      id: 1,
      name: "Suivi des nouveaux prospects",
      description:
        "Automatise l'envoi d'emails de bienvenue et l'assignation aux commerciaux",
      status: "active",
      trigger: "Nouveau prospect créé",
      lastRun: "2024-01-16T14:30:00Z",
      executions: 156,
      successRate: 94.2,
      category: "leads",
      steps: 5,
      createdAt: "2024-01-10T10:00:00Z",
    },
    {
      id: 2,
      name: "Relance automatique des devis",
      description: "Envoie des rappels automatiques pour les devis en attente",
      status: "active",
      trigger: "Devis non signé après 7 jours",
      lastRun: "2024-01-16T09:15:00Z",
      executions: 89,
      successRate: 87.6,
      category: "deals",
      steps: 3,
      createdAt: "2024-01-12T15:20:00Z",
    },
    {
      id: 3,
      name: "Notification de tâches en retard",
      description: "Alerte les utilisateurs des tâches non terminées",
      status: "paused",
      trigger: "Tâche en retard de plus de 2 jours",
      lastRun: "2024-01-15T16:45:00Z",
      executions: 234,
      successRate: 98.1,
      category: "tasks",
      steps: 2,
      createdAt: "2024-01-08T11:30:00Z",
    },
    {
      id: 4,
      name: "Mise à jour des contacts",
      description:
        "Synchronise les données des contacts avec les sources externes",
      status: "draft",
      trigger: "Tous les jours à 02:00",
      lastRun: null,
      executions: 0,
      successRate: 0,
      category: "contacts",
      steps: 4,
      createdAt: "2024-01-16T13:00:00Z",
    },
  ]);

  const [newWorkflow, setNewWorkflow] = React.useState({
    name: "",
    description: "",
    trigger: "",
    category: "leads",
    steps: [],
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Actif";
      case "paused":
        return "En pause";
      case "draft":
        return "Brouillon";
      case "error":
        return "Erreur";
      default:
        return "Inconnu";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "leads":
        return "fas fa-user-plus";
      case "deals":
        return "fas fa-handshake";
      case "contacts":
        return "fas fa-users";
      case "tasks":
        return "fas fa-tasks";
      default:
        return "fas fa-cog";
    }
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    if (activeTab === "all") return true;
    return workflow.status === activeTab;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description || !newWorkflow.trigger) {
      return;
    }

    const workflow = {
      id: workflows.length + 1,
      ...newWorkflow,
      status: "draft",
      lastRun: null,
      executions: 0,
      successRate: 0,
      steps: newWorkflow.steps.length || 1,
      createdAt: new Date().toISOString(),
    };

    setWorkflows([...workflows, workflow]);
    setNewWorkflow({
      name: "",
      description: "",
      trigger: "",
      category: "leads",
      steps: [],
    });
    setShowCreateModal(false);
  };

  const toggleWorkflowStatus = (id) => {
    setWorkflows(
      workflows.map((workflow) => {
        if (workflow.id === id) {
          const newStatus = workflow.status === "active" ? "paused" : "active";
          return { ...workflow, status: newStatus };
        }
        return workflow;
      })
    );
  };

  const deleteWorkflow = (id) => {
    setWorkflows(workflows.filter((workflow) => workflow.id !== id));
  };

  const totalWorkflows = workflows.length;
  const activeWorkflows = workflows.filter((w) => w.status === "active").length;
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executions, 0);
  const avgSuccessRate =
    workflows.length > 0
      ? workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Workflows</h1>
              <p className="text-gray-600 mt-1">
                Gérez vos processus automatisés et optimisez votre productivité
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <i className="fas fa-plus"></i>
              <span>Nouveau workflow</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total workflows</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalWorkflows}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-project-diagram text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Workflows actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeWorkflows}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-play text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Exécutions totales</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalExecutions}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-rocket text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Taux de succès moyen</p>
                <p className="text-2xl font-bold text-orange-600">
                  {avgSuccessRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "all", label: "Tous", count: totalWorkflows },
                {
                  id: "active",
                  label: "Actifs",
                  count: workflows.filter((w) => w.status === "active").length,
                },
                {
                  id: "paused",
                  label: "En pause",
                  count: workflows.filter((w) => w.status === "paused").length,
                },
                {
                  id: "draft",
                  label: "Brouillons",
                  count: workflows.filter((w) => w.status === "draft").length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        workflow.status === "active"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <i
                        className={`${getCategoryIcon(workflow.category)} ${
                          workflow.status === "active"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {workflow.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          workflow.status
                        )}`}
                      >
                        {getStatusText(workflow.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleWorkflowStatus(workflow.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        workflow.status === "active"
                          ? "text-yellow-600 hover:bg-yellow-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={
                        workflow.status === "active"
                          ? "Mettre en pause"
                          : "Activer"
                      }
                    >
                      <i
                        className={
                          workflow.status === "active"
                            ? "fas fa-pause"
                            : "fas fa-play"
                        }
                      ></i>
                    </button>
                    <button
                      onClick={() => setSelectedWorkflow(workflow)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {workflow.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-bolt w-4 mr-2"></i>
                    <span className="font-medium">Déclencheur:</span>
                    <span className="ml-1">{workflow.trigger}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <i className="fas fa-list w-4 mr-2"></i>
                      <span>{workflow.steps} étapes</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <i className="fas fa-clock w-4 mr-2"></i>
                      <span>{formatDate(workflow.lastRun)}</span>
                    </div>
                  </div>

                  {workflow.executions > 0 && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-sm">
                        <span className="text-gray-500">Exécutions:</span>
                        <span className="ml-1 font-medium text-gray-800">
                          {workflow.executions}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Succès:</span>
                        <span
                          className={`ml-1 font-medium ${
                            workflow.successRate >= 90
                              ? "text-green-600"
                              : workflow.successRate >= 70
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {workflow.successRate}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-project-diagram text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun workflow trouvé
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "all"
                ? "Commencez par créer votre premier workflow automatisé"
                : `Aucun workflow avec le statut "${getStatusText(
                    activeTab
                  ).toLowerCase()}"`}
            </p>
            {activeTab === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Créer un workflow
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Nouveau workflow
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du workflow
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newWorkflow.name}
                    onChange={(e) =>
                      setNewWorkflow({ ...newWorkflow, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Suivi des nouveaux prospects"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newWorkflow.description}
                    onChange={(e) =>
                      setNewWorkflow({
                        ...newWorkflow,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez ce que fait ce workflow..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Déclencheur
                  </label>
                  <input
                    type="text"
                    name="trigger"
                    value={newWorkflow.trigger}
                    onChange={(e) =>
                      setNewWorkflow({
                        ...newWorkflow,
                        trigger: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Nouveau prospect créé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={newWorkflow.category}
                    onChange={(e) =>
                      setNewWorkflow({
                        ...newWorkflow,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="leads">Prospects</option>
                    <option value="deals">Affaires</option>
                    <option value="contacts">Contacts</option>
                    <option value="tasks">Tâches</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateWorkflow}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Créer le workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;