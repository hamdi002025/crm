"use client";
import React from "react";

function MainComponent() {
  const [contracts, setContracts] = React.useState([]);
  const [prospects, setProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedContract, setSelectedContract] = React.useState(null);
  const [filters, setFilters] = React.useState({
    status: "all",
    type: "all",
    search: "",
    dateRange: "all",
  });
  const [stats, setStats] = React.useState({
    totalContracts: 0,
    activeContracts: 0,
    pendingContracts: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    renewalsDue: 0,
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
    loadContractsData();
  }, []);

  const loadContractsData = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockContracts = [
        {
          id: 1,
          contractNumber: "CTR-2024-001",
          clientName: "Marie Dubois",
          clientEmail: "marie.dubois@email.com",
          type: "Complémentaire Santé",
          status: "active",
          startDate: "2024-01-15",
          endDate: "2024-12-31",
          monthlyAmount: 89.5,
          annualAmount: 1074.0,
          prospectId: 1,
          createdDate: "2024-01-10",
          lastModified: "2024-01-15",
          renewalDate: "2024-12-31",
          paymentMethod: "Prélèvement",
          coverage: "Famille",
          notes: "Client satisfait, renouvellement prévu",
        },
        {
          id: 2,
          contractNumber: "CTR-2024-002",
          clientName: "Pierre Martin",
          clientEmail: "pierre.martin@email.com",
          type: "Mutuelle Entreprise",
          status: "pending",
          startDate: "2024-02-01",
          endDate: "2025-01-31",
          monthlyAmount: 125.0,
          annualAmount: 1500.0,
          prospectId: 2,
          createdDate: "2024-01-25",
          lastModified: "2024-01-28",
          renewalDate: "2025-01-31",
          paymentMethod: "Virement",
          coverage: "Individuelle",
          notes: "En attente de signature",
        },
        {
          id: 3,
          contractNumber: "CTR-2024-003",
          clientName: "Sophie Laurent",
          clientEmail: "sophie.laurent@email.com",
          type: "Assurance Santé",
          status: "expired",
          startDate: "2023-03-01",
          endDate: "2024-02-29",
          monthlyAmount: 67.8,
          annualAmount: 813.6,
          prospectId: 3,
          createdDate: "2023-02-20",
          lastModified: "2024-02-29",
          renewalDate: "2024-02-29",
          paymentMethod: "Carte Bancaire",
          coverage: "Individuelle",
          notes: "Contrat expiré, relance nécessaire",
        },
        {
          id: 4,
          contractNumber: "CTR-2024-004",
          clientName: "Jean Moreau",
          clientEmail: "jean.moreau@email.com",
          type: "Complémentaire Santé",
          status: "draft",
          startDate: "2024-03-01",
          endDate: "2025-02-28",
          monthlyAmount: 95.0,
          annualAmount: 1140.0,
          prospectId: 4,
          createdDate: "2024-02-15",
          lastModified: "2024-02-20",
          renewalDate: "2025-02-28",
          paymentMethod: "Prélèvement",
          coverage: "Couple",
          notes: "Brouillon en cours de finalisation",
        },
      ];

      const mockProspects = [
        { id: 1, name: "Marie Dubois", email: "marie.dubois@email.com" },
        { id: 2, name: "Pierre Martin", email: "pierre.martin@email.com" },
        { id: 3, name: "Sophie Laurent", email: "sophie.laurent@email.com" },
        { id: 4, name: "Jean Moreau", email: "jean.moreau@email.com" },
        { id: 5, name: "Claire Durand", email: "claire.durand@email.com" },
      ];

      setContracts(mockContracts);
      setProspects(mockProspects);

      const activeContracts = mockContracts.filter(
        (c) => c.status === "active"
      ).length;
      const pendingContracts = mockContracts.filter(
        (c) => c.status === "pending"
      ).length;
      const totalRevenue = mockContracts.reduce(
        (sum, c) => sum + c.annualAmount,
        0
      );
      const monthlyRevenue = mockContracts
        .filter((c) => c.status === "active")
        .reduce((sum, c) => sum + c.monthlyAmount, 0);
      const renewalsDue = mockContracts.filter((c) => {
        const renewalDate = new Date(c.renewalDate);
        const now = new Date();
        const diffTime = renewalDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
      }).length;

      setStats({
        totalContracts: mockContracts.length,
        activeContracts,
        pendingContracts,
        totalRevenue,
        monthlyRevenue,
        renewalsDue,
      });
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Actif";
      case "pending":
        return "En attente";
      case "expired":
        return "Expiré";
      case "draft":
        return "Brouillon";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    if (filters.status !== "all" && contract.status !== filters.status)
      return false;
    if (filters.type !== "all" && contract.type !== filters.type) return false;
    if (
      filters.search &&
      !contract.clientName
        .toLowerCase()
        .includes(filters.search.toLowerCase()) &&
      !contract.contractNumber
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateContract = (contractData) => {
    const newContract = {
      id: contracts.length + 1,
      contractNumber: `CTR-2024-${String(contracts.length + 1).padStart(
        3,
        "0"
      )}`,
      ...contractData,
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      status: "draft",
    };
    setContracts([...contracts, newContract]);
    setShowCreateModal(false);
  };

  const handleEditContract = (contractData) => {
    const updatedContracts = contracts.map((contract) =>
      contract.id === selectedContract.id
        ? {
            ...contract,
            ...contractData,
            lastModified: new Date().toISOString().split("T")[0],
          }
        : contract
    );
    setContracts(updatedContracts);
    setShowEditModal(false);
    setSelectedContract(null);
  };

  const handleDeleteContract = (contractId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      setContracts(contracts.filter((contract) => contract.id !== contractId));
    }
  };

  const ContractModal = ({ isOpen, onClose, onSubmit, contract, title }) => {
    const [formData, setFormData] = React.useState({
      clientName: "",
      clientEmail: "",
      type: "Complémentaire Santé",
      startDate: "",
      endDate: "",
      monthlyAmount: "",
      paymentMethod: "Prélèvement",
      coverage: "Individuelle",
      notes: "",
      prospectId: "",
    });

    React.useEffect(() => {
      if (contract) {
        setFormData({
          clientName: contract.clientName || "",
          clientEmail: contract.clientEmail || "",
          type: contract.type || "Complémentaire Santé",
          startDate: contract.startDate || "",
          endDate: contract.endDate || "",
          monthlyAmount: contract.monthlyAmount || "",
          paymentMethod: contract.paymentMethod || "Prélèvement",
          coverage: contract.coverage || "Individuelle",
          notes: contract.notes || "",
          prospectId: contract.prospectId || "",
        });
      }
    }, [contract]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const annualAmount = parseFloat(formData.monthlyAmount) * 12;
      onSubmit({
        ...formData,
        monthlyAmount: parseFloat(formData.monthlyAmount),
        annualAmount,
        prospectId: parseInt(formData.prospectId) || null,
      });
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
                  Nom du Client *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email du Client *
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Contrat *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Complémentaire Santé">
                    Complémentaire Santé
                  </option>
                  <option value="Mutuelle Entreprise">
                    Mutuelle Entreprise
                  </option>
                  <option value="Assurance Santé">Assurance Santé</option>
                  <option value="Prévoyance">Prévoyance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couverture
                </label>
                <select
                  name="coverage"
                  value={formData.coverage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Individuelle">Individuelle</option>
                  <option value="Couple">Couple</option>
                  <option value="Famille">Famille</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Début *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Fin *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant Mensuel (€) *
                </label>
                <input
                  type="number"
                  name="monthlyAmount"
                  step="0.01"
                  value={formData.monthlyAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyAmount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode de Paiement
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Prélèvement">Prélèvement</option>
                  <option value="Virement">Virement</option>
                  <option value="Carte Bancaire">Carte Bancaire</option>
                  <option value="Chèque">Chèque</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lier à un Prospect
              </label>
              <select
                name="prospectId"
                value={formData.prospectId}
                onChange={(e) =>
                  setFormData({ ...formData, prospectId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Aucun prospect lié</option>
                {prospects.map((prospect) => (
                  <option key={prospect.id} value={prospect.id}>
                    {prospect.name} - {prospect.email}
                  </option>
                ))}
              </select>
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
                {contract ? "Modifier" : "Créer"} le Contrat
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
                item.id === "contracts"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i
                className={`${item.icon} mr-4 text-lg ${
                  item.id === "contracts"
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
                    item.id === "contracts" ? "text-blue-100" : "text-gray-500"
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
              Créer un nouveau contrat
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-white text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouveau Contrat
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Gestion des Contrats
              </h2>
              <p className="text-gray-600">
                Suivi et gestion des contrats d'assurance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Rechercher un contrat..."
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
                  {stats.renewalsDue}
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
                <p className="text-gray-600">Chargement des contrats...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Contrats
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalContracts}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        <i className="fas fa-file-contract mr-1"></i>Tous
                        statuts
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-file-contract text-blue-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Contrats Actifs
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.activeContracts}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-check-circle mr-1"></i>En cours
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        En Attente
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.pendingContracts}
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        <i className="fas fa-clock mr-1"></i>À traiter
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-clock text-yellow-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        CA Total
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalRevenue.toLocaleString()}€
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>Annuel
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-euro-sign text-emerald-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        CA Mensuel
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.monthlyRevenue.toLocaleString()}€
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        <i className="fas fa-calendar mr-1"></i>Récurrent
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-calendar text-purple-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Renouvellements
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.renewalsDue}
                      </p>
                      <p className="text-sm text-orange-600 mt-1">
                        <i className="fas fa-exclamation-triangle mr-1"></i>30
                        jours
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contracts Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
                    Liste des Contrats
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
                      <option value="active">Actifs</option>
                      <option value="pending">En attente</option>
                      <option value="draft">Brouillons</option>
                      <option value="expired">Expirés</option>
                    </select>

                    <select
                      value={filters.type}
                      onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Tous les types</option>
                      <option value="Complémentaire Santé">
                        Complémentaire Santé
                      </option>
                      <option value="Mutuelle Entreprise">
                        Mutuelle Entreprise
                      </option>
                      <option value="Assurance Santé">Assurance Santé</option>
                      <option value="Prévoyance">Prévoyance</option>
                    </select>

                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Nouveau Contrat
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          N° Contrat
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Client
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Statut
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Montant/Mois
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Renouvellement
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.map((contract) => (
                        <tr
                          key={contract.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {contract.contractNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              Créé le{" "}
                              {new Date(
                                contract.createdDate
                              ).toLocaleDateString("fr-FR")}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {contract.clientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contract.clientEmail}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {contract.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contract.coverage}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                contract.status
                              )}`}
                            >
                              {getStatusLabel(contract.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {contract.monthlyAmount.toFixed(2)}€
                            </div>
                            <div className="text-sm text-gray-500">
                              {contract.annualAmount.toFixed(2)}€/an
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                contract.renewalDate
                              ).toLocaleDateString("fr-FR")}
                            </div>
                            <div className="text-xs text-gray-500">
                              {contract.paymentMethod}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowEditModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                title="Modifier"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteContract(contract.id)
                                }
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                title="Supprimer"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <button
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                                title="Télécharger PDF"
                              >
                                <i className="fas fa-download"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredContracts.length === 0 && (
                    <div className="text-center py-12">
                      <i className="fas fa-file-contract text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg">
                        Aucun contrat trouvé
                      </p>
                      <p className="text-gray-400">
                        Créez votre premier contrat pour commencer
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
      <ContractModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateContract}
        title="Créer un Nouveau Contrat"
      />

      <ContractModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedContract(null);
        }}
        onSubmit={handleEditContract}
        contract={selectedContract}
        title="Modifier le Contrat"
      />
    </div>
  );
}

export default MainComponent;