"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("campaigns");
  const [campaigns, setCampaigns] = React.useState([
    {
      id: 1,
      name: "Campagne Mutuelle Santé - Janvier 2025",
      status: "active",
      type: "email",
      sent: 1247,
      opened: 423,
      clicked: 89,
      converted: 12,
      created_at: "2025-01-15",
      template: "mutuelle_promo",
    },
    {
      id: 2,
      name: "Relance Prospects Inactifs",
      status: "scheduled",
      type: "sequence",
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      created_at: "2025-01-20",
      template: "relance_prospects",
    },
  ]);

  const [sequences, setSequences] = React.useState([
    {
      id: 1,
      name: "Séquence Nouveaux Prospects",
      status: "active",
      steps: 5,
      active_contacts: 156,
      completion_rate: 68,
      conversion_rate: 15,
    },
    {
      id: 2,
      name: "Relance Post-Simulation",
      status: "active",
      steps: 3,
      active_contacts: 89,
      completion_rate: 82,
      conversion_rate: 23,
    },
  ]);

  const [templates, setTemplates] = React.useState([
    {
      id: 1,
      name: "Bienvenue Nouveau Prospect",
      type: "email",
      category: "onboarding",
      usage_count: 234,
      last_used: "2025-01-20",
    },
    {
      id: 2,
      name: "Offre Mutuelle Personnalisée",
      type: "email",
      category: "promotion",
      usage_count: 156,
      last_used: "2025-01-19",
    },
    {
      id: 3,
      name: "Rappel Simulation Expirée",
      type: "email",
      category: "relance",
      usage_count: 89,
      last_used: "2025-01-18",
    },
  ]);

  const [showCampaignModal, setShowCampaignModal] = React.useState(false);
  const [showSequenceModal, setShowSequenceModal] = React.useState(false);
  const [showTemplateModal, setShowTemplateModal] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Campagnes Email</h2>
        <button
          onClick={() => setShowCampaignModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Nouvelle Campagne</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emails Envoyés</p>
              <p className="text-2xl font-bold text-blue-600">1,247</p>
            </div>
            <i className="fas fa-paper-plane text-blue-500 text-2xl"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux d'Ouverture</p>
              <p className="text-2xl font-bold text-green-600">34%</p>
            </div>
            <i className="fas fa-envelope-open text-green-500 text-2xl"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de Clic</p>
              <p className="text-2xl font-bold text-purple-600">7.1%</p>
            </div>
            <i className="fas fa-mouse-pointer text-purple-500 text-2xl"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <i className="fas fa-chart-line text-orange-500 text-2xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campagne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Envoyés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ouvertures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {campaign.created_at}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status === "active"
                        ? "Active"
                        : campaign.status === "scheduled"
                        ? "Programmée"
                        : "Terminée"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.sent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.opened} (
                    {campaign.sent > 0
                      ? Math.round((campaign.opened / campaign.sent) * 100)
                      : 0}
                    %)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.clicked} (
                    {campaign.opened > 0
                      ? Math.round((campaign.clicked / campaign.opened) * 100)
                      : 0}
                    %)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.converted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSequences = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Séquences Automatiques
        </h2>
        <button
          onClick={() => setShowSequenceModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Nouvelle Séquence</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sequences.map((sequence) => (
          <div key={sequence.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {sequence.name}
                </h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    sequence.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {sequence.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Étapes</p>
                <p className="text-xl font-bold text-gray-800">
                  {sequence.steps}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contacts Actifs</p>
                <p className="text-xl font-bold text-blue-600">
                  {sequence.active_contacts}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taux de Completion</span>
                <span className="font-medium">{sequence.completion_rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${sequence.completion_rate}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Taux de Conversion
                </span>
                <span className="text-lg font-bold text-green-600">
                  {sequence.conversion_rate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Templates Email</h2>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Nouveau Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {template.name}
                </h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                    template.category === "onboarding"
                      ? "bg-blue-100 text-blue-800"
                      : template.category === "promotion"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {template.category === "onboarding"
                    ? "Accueil"
                    : template.category === "promotion"
                    ? "Promotion"
                    : "Relance"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button className="text-green-600 hover:text-green-800">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Utilisations</span>
                <span className="font-medium">{template.usage_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dernière utilisation</span>
                <span className="font-medium">{template.last_used}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium">
                Utiliser ce Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Statistiques & Performance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Prospects Générés</p>
              <p className="text-2xl font-bold text-blue-600">156</p>
              <p className="text-xs text-green-600">+12% ce mois</p>
            </div>
            <i className="fas fa-user-plus text-blue-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de Conversion</p>
              <p className="text-2xl font-bold text-green-600">18.5%</p>
              <p className="text-xs text-green-600">+3.2% ce mois</p>
            </div>
            <i className="fas fa-chart-line text-green-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ROI Campagnes</p>
              <p className="text-2xl font-bold text-purple-600">340%</p>
              <p className="text-xs text-green-600">+45% ce mois</p>
            </div>
            <i className="fas fa-euro-sign text-purple-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coût par Lead</p>
              <p className="text-2xl font-bold text-orange-600">12.50€</p>
              <p className="text-xs text-red-600">-8% ce mois</p>
            </div>
            <i className="fas fa-calculator text-orange-500 text-2xl"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance par Canal
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email Marketing</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Séquences Auto</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Relances Manuelles</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Meilleurs Templates
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Offre Mutuelle Personnalisée
                </p>
                <p className="text-xs text-gray-600">Taux d'ouverture: 42%</p>
              </div>
              <span className="text-green-600 font-bold">23%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Bienvenue Nouveau Prospect
                </p>
                <p className="text-xs text-gray-600">Taux d'ouverture: 38%</p>
              </div>
              <span className="text-green-600 font-bold">19%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Rappel Simulation
                </p>
                <p className="text-xs text-gray-600">Taux d'ouverture: 35%</p>
              </div>
              <span className="text-green-600 font-bold">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Marketing Automation
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez vos campagnes email et automatisez vos relances prospects
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <i className="fas fa-download"></i>
                <span>Exporter</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <i className="fas fa-cog"></i>
                <span>Paramètres</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "campaigns"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Campagnes
            </button>
            <button
              onClick={() => setActiveTab("sequences")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sequences"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-project-diagram mr-2"></i>
              Séquences
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "templates"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-file-alt mr-2"></i>
              Templates
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-chart-bar mr-2"></i>
              Statistiques
            </button>
          </nav>
        </div>

        {activeTab === "campaigns" && renderCampaigns()}
        {activeTab === "sequences" && renderSequences()}
        {activeTab === "templates" && renderTemplates()}
        {activeTab === "analytics" && renderAnalytics()}
      </div>

      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Nouvelle Campagne Email
              </h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la campagne
                </label>
                <input
                  type="text"
                  name="campaign_name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Campagne Mutuelle Février 2025"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <select
                    name="template"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un template</option>
                    <option value="mutuelle_promo">
                      Offre Mutuelle Personnalisée
                    </option>
                    <option value="bienvenue">
                      Bienvenue Nouveau Prospect
                    </option>
                    <option value="relance">Rappel Simulation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audience
                  </label>
                  <select
                    name="audience"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une audience</option>
                    <option value="all_prospects">Tous les prospects</option>
                    <option value="new_prospects">Nouveaux prospects</option>
                    <option value="inactive_prospects">
                      Prospects inactifs
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'envoi
                </label>
                <input
                  type="datetime-local"
                  name="send_date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Créer la Campagne
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSequenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Nouvelle Séquence Automatique
              </h3>
              <button
                onClick={() => setShowSequenceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la séquence
                </label>
                <input
                  type="text"
                  name="sequence_name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Séquence Onboarding Prospects"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Déclencheur
                  </label>
                  <select
                    name="trigger"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sélectionner un déclencheur</option>
                    <option value="new_lead">Nouveau prospect</option>
                    <option value="simulation_completed">
                      Simulation terminée
                    </option>
                    <option value="email_opened">Email ouvert</option>
                    <option value="no_activity">Inactivité 7 jours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai entre emails
                  </label>
                  <select
                    name="delay"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1">1 jour</option>
                    <option value="3">3 jours</option>
                    <option value="7">7 jours</option>
                    <option value="14">14 jours</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étapes de la séquence
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                      1
                    </span>
                    <select className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm">
                      <option>Bienvenue Nouveau Prospect</option>
                      <option>Offre Mutuelle Personnalisée</option>
                      <option>Rappel Simulation</option>
                    </select>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                      2
                    </span>
                    <select className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm">
                      <option>Rappel Simulation</option>
                      <option>Offre Mutuelle Personnalisée</option>
                      <option>Bienvenue Nouveau Prospect</option>
                    </select>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3 text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                >
                  <i className="fas fa-plus"></i>
                  <span>Ajouter une étape</span>
                </button>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSequenceModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  Créer la Séquence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Nouveau Template Email
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du template
                  </label>
                  <input
                    type="text"
                    name="template_name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Email de bienvenue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="onboarding">Accueil</option>
                    <option value="promotion">Promotion</option>
                    <option value="relance">Relance</option>
                    <option value="newsletter">Newsletter</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objet de l'email
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Bienvenue chez [Nom de l'entreprise] !"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu de l'email
                </label>
                <textarea
                  name="content"
                  rows="12"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Bonjour [Prénom],

Merci de votre intérêt pour nos services d'assurance santé.

Nous avons bien reçu votre demande de simulation et notre équipe d'experts va analyser votre profil pour vous proposer les meilleures offres du marché.

Vous recevrez vos devis personnalisés dans les 24h.

En attendant, n'hésitez pas à nous contacter si vous avez des questions.

Cordialement,
L'équipe [Nom de l'entreprise]"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg"
                >
                  Aperçu
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Créer le Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Aperçu Template
              </h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">
                  {selectedTemplate.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Catégorie: {selectedTemplate.category}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-700">
                  Ceci est un aperçu du template sélectionné. Le contenu réel
                  serait affiché ici avec les variables personnalisées
                  remplacées par les données du prospect.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Utiliser ce Template
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