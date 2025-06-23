"use client";
import React from "react";

function MainComponent() {
  const [prospects, setProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedProspect, setSelectedProspect] = React.useState(null);
  const [filters, setFilters] = React.useState({
    status: "all",
    source: "all",
    search: "",
    dateRange: "all",
  });
  const [stats, setStats] = React.useState({
    totalProspects: 0,
    newProspects: 0,
    qualifiedProspects: 0,
    conversionRate: 0,
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
    loadProspectsData();
  }, []);

  const loadProspectsData = async () => {
    try {
      setLoading(true);
      
      // Simulation des données - à remplacer par de vrais appels API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProspects = [
        {
          id: 1,
          firstName: "Marie",
          lastName: "Dubois",
          email: "marie.dubois@email.com",
          phone: "01 23 45 67 89",
          company: "Tech Solutions",
          status: "new",
          source: "website",
          score: 85,
          lastContact: "2025-01-15",
          createdAt: "2025-01-10",
          notes: "Intéressée par une complémentaire santé famille",
          postalCode: "75001",
          birthDate: "1985-03-15",
          situationFamiliale: "Mariée",
          nombreEnfants: 2,
          revenusAnnuels: 45000,
        },
        {
          id: 2,
          firstName: "Pierre",
          lastName: "Martin",
          email: "pierre.martin@email.com",
          phone: "01 34 56 78 90",
          company: "Freelance",
          status: "qualified",
          source: "referral",
          score: 92,
          lastContact: "2025-01-14",
          createdAt: "2025-01-08",
          notes: "Recherche une mutuelle pour travailleur indépendant",
          postalCode: "69001",
          birthDate: "1978-11-22",
          situationFamiliale: "Célibataire",
          nombreEnfants: 0,
          revenusAnnuels: 38000,
        },
        {
          id: 3,
          firstName: "Sophie",
          lastName: "Laurent",
          email: "sophie.laurent@email.com",
          phone: "01 45 67 89 01",
          company: "Global Corp",
          status: "contacted",
          source: "social_media",
          score: 78,
          lastContact: "2025-01-12",
          createdAt: "2025-01-05",
          notes: "Demande de devis pour complémentaire optique",
          postalCode: "13001",
          birthDate: "1990-07-08",
          situationFamiliale: "Pacsée",
          nombreEnfants: 1,
          revenusAnnuels: 52000,
        },
        {
          id: 4,
          firstName: "Jean",
          lastName: "Moreau",
          email: "jean.moreau@email.com",
          phone: "01 56 78 90 12",
          company: "Startup Inc",
          status: "proposal",
          source: "google_ads",
          score: 95,
          lastContact: "2025-01-16",
          createdAt: "2025-01-03",
          notes: "Prêt à signer, attente validation conjoint",
          postalCode: "33000",
          birthDate: "1982-12-03",
          situationFamiliale: "Marié",
          nombreEnfants: 3,
          revenusAnnuels: 65000,
        },
      ];

      setProspects(mockProspects);

      const newProspects = mockProspects.filter(p => p.status === "new").length;
      const qualifiedProspects = mockProspects.filter(p => p.status === "qualified").length;
      const conversionRate = mockProspects.length > 0 ? (qualifiedProspects / mockProspects.length) * 100 : 0;

      setStats({
        totalProspects: mockProspects.length,
        newProspects,
        qualifiedProspects,
        conversionRate: conversionRate.toFixed(1),
      });
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "qualified":
        return "bg-green-100 text-green-800 border-green-200";
      case "proposal":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "new":
        return "Nouveau";
      case "contacted":
        return "Contacté";
      case "qualified":
        return "Qualifié";
      case "proposal":
        return "Proposition";
      case "closed":
        return "Fermé";
      default:
        return status;
    }
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case "website":
        return "Site Web";
      case "referral":
        return "Recommandation";
      case "social_media":
        return "Réseaux Sociaux";
      case "google_ads":
        return "Google Ads";
      case "email":
        return "Email";
      default:
        return source;
    }
  };

  const filteredProspects = prospects.filter((prospect) => {
    if (filters.status !== "all" && prospect.status !== filters.status) return false;
    if (filters.source !== "all" && prospect.source !== filters.source) return false;
    if (
      filters.search &&
      !prospect.firstName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !prospect.lastName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !prospect.email.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateProspect = (prospectData) => {
    const newProspect = {
      id: prospects.length + 1,
      ...prospectData,
      status: "new",
      score: Math.floor(Math.random() * 40) + 60,
      lastContact: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProspects([...prospects, newProspect]);
    setShowCreateModal(false);
  };

  const handleEditProspect = (prospectData) => {
    const updatedProspects = prospects.map((prospect) =>
      prospect.id === selectedProspect.id
        ? { ...prospect, ...prospectData, lastContact: new Date().toISOString().split("T")[0] }
        : prospect
    );
    setProspects(updatedProspects);
    setShowEditModal(false);
    setSelectedProspect(null);
  };

  const handleDeleteProspect = (prospectId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) {
      setProspects(prospects.filter((prospect) => prospect.id !== prospectId));
    }
  };

  const ProspectModal = ({ isOpen, onClose, onSubmit, prospect, title }) => {
    const [formData, setFormData] = React.useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
      postalCode: "",
      birthDate: "",
      situationFamiliale: "Célibataire",
      nombreEnfants: 0,
      revenusAnnuels: "",
    });

    React.useEffect(() => {
      if (prospect) {
        setFormData({
          firstName: prospect.firstName || "",
          lastName: prospect.lastName || "",
          email: prospect.email || "",
          phone: prospect.phone || "",
          company: prospect.company || "",
          notes: prospect.notes || "",
          postalCode: prospect.postalCode || "",
          birthDate: prospect.birthDate || "",
          situationFamiliale: prospect.situationFamiliale || "Célibataire",
          nombreEnfants: prospect.nombreEnfants || 0,
          revenusAnnuels: prospect.revenusAnnuels || "",
        });
      }
    }, [prospect]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code Postal
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Naissance
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation Familiale
                </label>
                <select
                  name="situationFamiliale"
                  value={formData.situationFamiliale}
                  onChange={(e) =>
                    setFormData({ ...formData, situationFamiliale: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Pacsé(e)">Pacsé(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf/Veuve">Veuf/Veuve</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'Enfants
                </label>
                <input
                  type="number"
                  name="nombreEnfants"
                  min="0"
                  value={formData.nombreEnfants}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreEnfants: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenus Annuels (€)
                </label>
                <input
                  type="number"
                  name="revenusAnnuels"
                  value={formData.revenusAnnuels}
                  onChange={(e) =>
                    setFormData({ ...formData, revenusAnnuels: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notes additionnelles..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {prospect ? "Modifier" : "Créer"} le Prospect
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
                item.id === "prospects"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i
                className={`${item.icon} mr-4 text-lg ${
                  item.id === "prospects"
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
                    item.id === "prospects" ? "text-blue-100" : "text-gray-500"
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
              Ajouter un nouveau prospect
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-white text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouveau Prospect
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
              Gestion des Prospects
            </h2>
            <p className="text-gray-600">
              Suivez et gérez vos prospects d'assurance santé
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un prospect..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                <p className="text-gray-600">Chargement des prospects...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Prospects
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalProspects}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        <i className="fas fa-users mr-1"></i>Tous statuts
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-user-plus text-blue-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Nouveaux Prospects
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.newProspects}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>Ce mois
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-user-check text-green-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Prospects Qualifiés
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.qualifiedProspects}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        <i className="fas fa-star mr-1"></i>Qualité
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-star text-purple-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Taux de Conversion
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.conversionRate}%
                      </p>
                      <p className="text-sm text-orange-600 mt-1">
                        <i className="fas fa-chart-line mr-1"></i>Performance
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-percentage text-orange-600 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prospects Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
                    Liste des Prospects
                  </h3>

                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="new">Nouveaux</option>
                      <option value="contacted">Contactés</option>
                      <option value="qualified">Qualifiés</option>
                      <option value="proposal">Proposition</option>
                      <option value="closed">Fermés</option>
                    </select>

                    <select
                      value={filters.source}
                      onChange={(e) =>
                        setFilters({ ...filters, source: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Toutes les sources</option>
                      <option value="website">Site Web</option>
                      <option value="referral">Recommandation</option>
                      <option value="social_media">Réseaux Sociaux</option>
                      <option value="google_ads">Google Ads</option>
                      <option value="email">Email</option>
                    </select>

                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Nouveau Prospect
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Prospect
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Contact
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Statut
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Source
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Score
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Dernier Contact
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProspects.map((prospect) => (
                        <tr
                          key={prospect.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-semibold text-sm">
                                  {prospect.firstName[0]}{prospect.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {prospect.firstName} {prospect.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {prospect.company}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {prospect.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {prospect.phone}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                prospect.status
                              )}`}
                            >
                              {getStatusLabel(prospect.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-900">
                              {getSourceLabel(prospect.source)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${prospect.score}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {prospect.score}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-900">
                              {new Date(prospect.lastContact).toLocaleDateString("fr-FR")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedProspect(prospect);
                                  setShowEditModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                title="Modifier"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteProspect(prospect.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                title="Supprimer"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <button
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                                title="Appeler"
                              >
                                <i className="fas fa-phone"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredProspects.length === 0 && (
                    <div className="text-center py-12">
                      <i className="fas fa-user-plus text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg">
                        Aucun prospect trouvé
                      </p>
                      <p className="text-gray-400">
                        Créez votre premier prospect pour commencer
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <ProspectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProspect}
        title="Créer un Nouveau Prospect"
      />

      <ProspectModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProspect(null);
        }}
        onSubmit={handleEditProspect}
        prospect={selectedProspect}
        title="Modifier le Prospect"
      />
    </div>
  );
}

export default MainComponent;