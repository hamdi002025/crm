"use client";
import React from "react";

function MainComponent() {
  const [stats, setStats] = React.useState({
    totalLeads: 0,
    totalContacts: 0,
    totalContracts: 0,
    totalRevenue: 0,
    conversionRate: 0,
    activeWorkflows: 0,
  });
  const [recentActivities, setRecentActivities] = React.useState([]);
  const [upcomingTasks, setUpcomingTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
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
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Simulation des données - à remplacer par de vrais appels API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalLeads: 156,
        totalContacts: 89,
        totalContracts: 23,
        totalRevenue: 125000,
        conversionRate: 18.5,
        activeWorkflows: 7,
      });

      setRecentActivities([
        {
          id: 1,
          type: "lead_created",
          title: "Nouveau prospect ajouté",
          description: "Marie Dubois - Complémentaire santé",
          time: "Il y a 2h",
          icon: "fas fa-user-plus",
          color: "text-blue-600",
        },
        {
          id: 2,
          type: "contract_signed",
          title: "Contrat signé",
          description: "Pierre Martin - 2,500€/an",
          time: "Il y a 4h",
          icon: "fas fa-file-signature",
          color: "text-green-600",
        },
        {
          id: 3,
          type: "simulation_completed",
          title: "Simulation terminée",
          description: "Jean Dupont - Oggo Data",
          time: "Il y a 6h",
          icon: "fas fa-calculator",
          color: "text-purple-600",
        },
        {
          id: 4,
          type: "email_sent",
          title: "Email envoyé",
          description: "Campagne follow-up - 45 destinataires",
          time: "Hier",
          icon: "fas fa-envelope",
          color: "text-orange-600",
        },
      ]);

      setUpcomingTasks([
        {
          id: 1,
          title: "Rappeler Sophie Laurent",
          description: "Suivi devis complémentaire santé",
          dueDate: "Aujourd'hui 14:30",
          priority: "high",
          type: "call",
        },
        {
          id: 2,
          title: "Envoyer proposition",
          description: "Contrat famille Moreau",
          dueDate: "Demain 10:00",
          priority: "medium",
          type: "email",
        },
        {
          id: 3,
          title: "Rendez-vous client",
          description: "Signature contrat - Bureau",
          dueDate: "Vendredi 15:00",
          priority: "high",
          type: "meeting",
        },
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case "call":
        return "fas fa-phone";
      case "email":
        return "fas fa-envelope";
      case "meeting":
        return "fas fa-calendar";
      default:
        return "fas fa-tasks";
    }
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
                item.id === "dashboard"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i
                className={`${item.icon} mr-4 text-lg ${
                  item.id === "dashboard"
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
                    item.id === "dashboard" ? "text-blue-100" : "text-gray-500"
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
            <button className="w-full bg-white text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors">
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
              Tableau de Bord
            </h2>
            <p className="text-gray-600">Bienvenue, {currentUser.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Profile Menu */}
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

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                <p className="text-gray-600">
                  Chargement du tableau de bord...
                </p>
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
                        Prospects
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalLeads}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+12%
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
                        Contacts
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalContacts}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+8%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-users text-green-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Contrats
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalContracts}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+15%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-file-contract text-purple-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Chiffre d'Affaires
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalRevenue.toLocaleString()}€
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+22%
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
                        Taux Conversion
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.conversionRate}%
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+3%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-chart-line text-orange-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Workflows Actifs
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.activeWorkflows}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        <i className="fas fa-robot mr-1"></i>Automatisés
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-robot text-indigo-600 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Activités Récentes
                    </h3>
                    <a
                      href="/activities"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Voir tout <i className="fas fa-arrow-right ml-1"></i>
                    </a>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color
                            .replace("text-", "bg-")
                            .replace("-600", "-100")}`}
                        >
                          <i
                            className={`${activity.icon} ${activity.color}`}
                          ></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Tâches à Venir
                    </h3>
                    <a
                      href="/tasks"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <i className="fas fa-plus"></i>
                    </a>
                  </div>
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {task.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority === "high"
                              ? "Urgent"
                              : task.priority === "medium"
                              ? "Moyen"
                              : "Faible"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {task.dueDate}
                          </span>
                          <i
                            className={`${getTaskIcon(
                              task.type
                            )} text-gray-400`}
                          ></i>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
                    <i className="fas fa-plus mr-2"></i>
                    Nouvelle Tâche
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <a
                  href="/prospects"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-2">Nouveau Prospect</h4>
                      <p className="text-blue-100 text-sm">
                        Ajouter un prospect
                      </p>
                    </div>
                    <i className="fas fa-user-plus text-2xl text-blue-200"></i>
                  </div>
                </a>

                <a
                  href="/comparateur"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-2">Simulation Santé</h4>
                      <p className="text-purple-100 text-sm">Oggo Data</p>
                    </div>
                    <i className="fas fa-heartbeat text-2xl text-purple-200"></i>
                  </div>
                </a>

                <a
                  href="/import"
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-2">Import Données</h4>
                      <p className="text-green-100 text-sm">CSV/Excel</p>
                    </div>
                    <i className="fas fa-upload text-2xl text-green-200"></i>
                  </div>
                </a>

                <a
                  href="/reports"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-2">Rapports</h4>
                      <p className="text-orange-100 text-sm">Analytics</p>
                    </div>
                    <i className="fas fa-chart-bar text-2xl text-orange-200"></i>
                  </div>
                </a>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default MainComponent;