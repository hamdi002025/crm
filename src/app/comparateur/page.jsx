"use client";
import React from "react";

function MainComponent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showOggoModal, setShowOggoModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [simulationHistory, setSimulationHistory] = React.useState([]);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    birthDate: "",
    situationFamiliale: "Célibataire",
    nombreEnfants: 0,
    revenusAnnuels: "",
    mutuelleActuelle: "",
    dateFinContrat: "",
    besoinsSpe: "",
  });
  const [currentUser] = React.useState({
    name: "Jean Dupont",
    role: "Commercial Senior",
    avatar: null,
  });

  const navigationItems = [
    {
      id: "dashboard",
      name: "Tableau de Bord",
      icon: "fas fa-chart-line",
      path: "/",
      description: "Vue d'ensemble et statistiques",
    },
    {
      id: "prospects",
      name: "Prospects",
      icon: "fas fa-user-plus",
      path: "/prospects",
      description: "Gestion des prospects",
      badge: "12",
    },
    {
      id: "contacts",
      name: "Contacts",
      icon: "fas fa-users",
      path: "/contacts",
      description: "Base de contacts clients",
    },
    {
      id: "contracts",
      name: "Contrats",
      icon: "fas fa-file-contract",
      path: "/contracts",
      description: "Suivi des contrats",
      badge: "3",
    },
    {
      id: "comparateur",
      name: "Comparateur Santé",
      icon: "fas fa-heartbeat",
      path: "/comparateur",
      description: "Simulation Oggo Data",
    },
    {
      id: "workflows",
      name: "Automatisation",
      icon: "fas fa-robot",
      path: "/workflows",
      description: "Workflows automatisés",
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: "fas fa-bullhorn",
      path: "/marketing",
      description: "Campagnes marketing",
    },
    {
      id: "import",
      name: "Import Données",
      icon: "fas fa-upload",
      path: "/import",
      description: "Import CSV/Excel",
    },
    {
      id: "reports",
      name: "Rapports",
      icon: "fas fa-chart-bar",
      path: "/reports",
      description: "Analytics et rapports",
    },
    {
      id: "profile",
      name: "Profil",
      icon: "fas fa-user-circle",
      path: "/profile",
      description: "Paramètres utilisateur",
    },
  ];

  React.useEffect(() => {
    loadSimulationHistory();
  }, []);

  const loadSimulationHistory = () => {
    const mockHistory = [
      {
        id: 1,
        clientName: "Jean Dupont",
        simulationType: "Complémentaire Santé",
        date: "2025-01-10 14:30",
        status: "Terminée",
        result: "Devis généré",
      },
      {
        id: 2,
        clientName: "Marie Martin",
        simulationType: "Complémentaire Santé",
        date: "2025-01-08 16:15",
        status: "En cours",
        result: "En attente",
      },
    ];
    setSimulationHistory(mockHistory);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const launchOggoSimulation = async () => {
    // Validation des champs requis
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.postalCode ||
      !formData.birthDate
    ) {
      setError(
        "Veuillez remplir au minimum le prénom, nom, code postal et date de naissance"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Appel API pour enregistrer la simulation
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "oggo_simulation",
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      // Afficher le modal Oggo
      setShowOggoModal(true);

      // Ajouter à l'historique
      const newSimulation = {
        id: Date.now(),
        clientName: `${formData.firstName} ${formData.lastName}`,
        simulationType: "Complémentaire Santé",
        date: new Date().toLocaleString("fr-FR"),
        status: "En cours",
        result: "Simulation lancée",
      };

      setSimulationHistory((prev) => [newSimulation, ...prev]);
    } catch (err) {
      setError("Erreur lors du lancement de la simulation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeOggoModal = () => {
    setShowOggoModal(false);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postalCode: "",
      birthDate: "",
      situationFamiliale: "Célibataire",
      nombreEnfants: 0,
      revenusAnnuels: "",
      mutuelleActuelle: "",
      dateFinContrat: "",
      besoinsSpe: "",
    });
    setShowOggoModal(false);
    setError(null);
  };

  React.useEffect(() => {
    if (showOggoModal && formData.firstName && formData.lastName) {
      // Charger le script Oggo Data
      const script = document.createElement("script");
      script.src = "https://cks.oggo-data.net/icomparator/health.js";
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        console.log("Script Oggo Data chargé avec succès");
      };

      script.onerror = () => {
        setError("Erreur lors du chargement du comparateur Oggo Data");
      };

      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [showOggoModal, formData.firstName, formData.lastName]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Logo & Brand */}
        <div className="h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
            <i className="fas fa-heartbeat text-blue-600 text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AssurCRM</h1>
            <p className="text-blue-100 text-xs">Gestion Assurance Santé</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{currentUser.name}</p>
              <p className="text-sm text-gray-600">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                item.id === "comparateur"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i
                className={`${item.icon} mr-4 text-lg ${
                  item.id === "comparateur"
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              ></i>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    item.id === "comparateur"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
            <h4 className="font-semibold mb-2">Action Rapide</h4>
            <p className="text-sm text-green-100 mb-3">
              Nouvelle simulation santé
            </p>
            <button
              onClick={resetForm}
              className="w-full bg-white text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center justify-between px-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Comparateur Complémentaire Santé
            </h2>
            <p className="text-gray-600">
              Simulation Oggo Data avec formulaire client intégré
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <i className="fas fa-chevron-down text-sm"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Formulaire Client */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fas fa-user-edit text-blue-600 mr-2"></i>
                Informations Client
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
                title="Réinitialiser le formulaire"
              >
                <i className="fas fa-redo text-sm"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Prénom"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@exemple.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01 23 45 67 89"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code Postal *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="75001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de Naissance *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Situation Familiale
                </label>
                <select
                  name="situationFamiliale"
                  value={formData.situationFamiliale}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Pacsé(e)">Pacsé(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf/Veuve">Veuf/Veuve</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'Enfants
                </label>
                <input
                  type="number"
                  name="nombreEnfants"
                  min="0"
                  value={formData.nombreEnfants}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Revenus Annuels (€)
                </label>
                <input
                  type="number"
                  name="revenusAnnuels"
                  value={formData.revenusAnnuels}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="35000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mutuelle Actuelle
                </label>
                <input
                  type="text"
                  name="mutuelleActuelle"
                  value={formData.mutuelleActuelle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de la mutuelle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Fin Contrat Actuel
                </label>
                <input
                  type="date"
                  name="dateFinContrat"
                  value={formData.dateFinContrat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Besoins Spécifiques
                </label>
                <textarea
                  name="besoinsSpe"
                  value={formData.besoinsSpe}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optique, dentaire, hospitalisation..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={launchOggoSimulation}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center justify-center text-lg"
                disabled={loading}
              >
                <i className="fas fa-heartbeat mr-2"></i>
                {loading ? "Lancement..." : "Comparer les Offres (Oggo)"}
              </button>
            </div>
          </div>

          {/* Historique des Simulations */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-history text-gray-600 mr-2"></i>
              Historique des Simulations
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de Simulation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Résultat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {simulationHistory.map((simulation) => (
                    <tr key={simulation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {simulation.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {simulation.simulationType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {simulation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            simulation.status === "Terminée"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {simulation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {simulation.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Oggo Data */}
      {showOggoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header du Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Comparateur d'Offres Mutuelles - Oggo Data
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">
                    DEVIS GRATUIT COMPLÉMENTAIRE SANTÉ
                  </span>{" "}
                  - {formData.firstName} {formData.lastName}
                </p>
              </div>
              <button
                onClick={closeOggoModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Contenu du Modal */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Date de naissance:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {formData.birthDate || "--/--/--"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Régime:</span>
                    <span className="ml-2 text-gray-600">Salarié</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-700">
                        Conjoint
                      </span>
                      <button className="ml-2 text-blue-600 hover:text-blue-700">
                        <i className="fas fa-plus"></i> Ajouter
                      </button>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Enfants</span>
                      <button className="ml-2 text-blue-600 hover:text-blue-700">
                        <i className="fas fa-plus"></i> Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zone du widget Oggo */}
              <div
                className="border rounded-lg overflow-hidden bg-gray-50"
                style={{ height: "500px" }}
              >
                <div
                  id="oggodata-icomparator-health"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "500px",
                  }}
                ></div>
              </div>

              {/* Bouton d'action */}
              <div className="mt-6 text-center">
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-all">
                  Comparer les assurances
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