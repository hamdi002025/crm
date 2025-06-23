"use client";
import React from "react";

function MainComponent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
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
    contactedProspects: 0,
    qualifiedProspects: 0,
    convertedProspects: 0,
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProspects = [
        {
          id: 1,
          firstName: "Marie",
          lastName: "Dubois",
          email: "marie.dubois@email.com",
          phone: "0123456789",
          company: "Tech Solutions",
          title: "Directrice Marketing",
          status: "new",
          leadSource: "Site Web",
          score: 85,
          assignedTo: "Jean Dupont",
          notes: "Intéressée par une complémentaire santé famille",
          customFields: {},
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
          birthDate: "1985-03-15",
          postalCode: "75001",
          situationFamiliale: "Mariée",
          nombreEnfants: 2,
          revenusAnnuels: 45000,
          mutuelleActuelle: "Harmonie Mutuelle",
          dateFinContrat: "2024-06-30",
          besoinsSpe: "Couverture dentaire renforcée",
          sourcePublicite: "Google Ads",
          utmSource: "google",
          utmCampaign: "sante-famille",
          utmMedium: "cpc",
          lastCallAttempt: null,
          callAttemptsCount: 0,
          bestCallTime: "14h-17h",
        },
        {
          id: 2,
          firstName: "Pierre",
          lastName: "Martin",
          email: "pierre.martin@email.com",
          phone: "0987654321",
          company: "Consulting Pro",
          title: "Consultant Senior",
          status: "contacted",
          leadSource: "Référence",
          score: 72,
          assignedTo: "Sophie Laurent",
          notes: "Premier contact établi, RDV prévu",
          customFields: {},
          createdAt: "2024-01-12T14:20:00Z",
          updatedAt: "2024-01-16T09:15:00Z",
          birthDate: "1978-11-22",
          postalCode: "69001",
          situationFamiliale: "Célibataire",
          nombreEnfants: 0,
          revenusAnnuels: 38000,
          mutuelleActuelle: "MGEN",
          dateFinContrat: "2024-12-31",
          besoinsSpe: "Optique et dentaire",
          sourcePublicite: "Bouche à oreille",
          utmSource: "referral",
          utmCampaign: "word-of-mouth",
          utmMedium: "referral",
          lastCallAttempt: "2024-01-16T09:00:00Z",
          callAttemptsCount: 1,
          bestCallTime: "9h-12h",
        },
        {
          id: 3,
          firstName: "Sophie",
          lastName: "Laurent",
          email: "sophie.laurent@email.com",
          phone: "0147258369",
          company: "Design Studio",
          title: "Graphiste",
          status: "qualified",
          leadSource: "LinkedIn",
          score: 91,
          assignedTo: "Marc Durand",
          notes: "Très intéressée, devis en cours",
          customFields: {},
          createdAt: "2024-01-08T16:45:00Z",
          updatedAt: "2024-01-17T11:30:00Z",
          birthDate: "1990-07-08",
          postalCode: "13001",
          situationFamiliale: "Pacsée",
          nombreEnfants: 1,
          revenusAnnuels: 32000,
          mutuelleActuelle: "Malakoff Humanis",
          dateFinContrat: "2024-03-31",
          besoinsSpe: "Maternité et pédiatrie",
          sourcePublicite: "LinkedIn Ads",
          utmSource: "linkedin",
          utmCampaign: "freelance-sante",
          utmMedium: "social",
          lastCallAttempt: "2024-01-17T10:00:00Z",
          callAttemptsCount: 2,
          bestCallTime: "14h-18h",
        },
        {
          id: 4,
          firstName: "Jean",
          lastName: "Moreau",
          email: "jean.moreau@email.com",
          phone: "0156789123",
          company: "Auto Entrepreneur",
          title: "Développeur Web",
          status: "converted",
          leadSource: "Facebook",
          score: 95,
          assignedTo: "Jean Dupont",
          notes: "Contrat signé - excellent prospect",
          customFields: {},
          createdAt: "2024-01-05T08:15:00Z",
          updatedAt: "2024-01-18T15:45:00Z",
          birthDate: "1987-12-03",
          postalCode: "33000",
          situationFamiliale: "Marié",
          nombreEnfants: 3,
          revenusAnnuels: 42000,
          mutuelleActuelle: "Aucune",
          dateFinContrat: null,
          besoinsSpe: "Couverture complète famille nombreuse",
          sourcePublicite: "Facebook Ads",
          utmSource: "facebook",
          utmCampaign: "independants-sante",
          utmMedium: "social",
          lastCallAttempt: "2024-01-18T14:00:00Z",
          callAttemptsCount: 3,
          bestCallTime: "19h-21h",
        },
      ];

      setProspects(mockProspects);

      const newProspects = mockProspects.filter(
        (p) => p.status === "new"
      ).length;
      const contactedProspects = mockProspects.filter(
        (p) => p.status === "contacted"
      ).length;
      const qualifiedProspects = mockProspects.filter(
        (p) => p.status === "qualified"
      ).length;
      const convertedProspects = mockProspects.filter(
        (p) => p.status === "converted"
      ).length;
      const conversionRate =
        mockProspects.length > 0
          ? (convertedProspects / mockProspects.length) * 100
          : 0;

      setStats({
        totalProspects: mockProspects.length,
        newProspects,
        contactedProspects,
        qualifiedProspects,
        convertedProspects,
        conversionRate: Math.round(conversionRate * 10) / 10,
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
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "converted":
        return "bg-green-100 text-green-800 border-green-200";
      case "unqualified":
        return "bg-red-100 text-red-800 border-red-200";
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
      case "converted":
        return "Converti";
      case "unqualified":
        return "Non qualifié";
      default:
        return status;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredProspects = prospects.filter((prospect) => {
    if (filters.status !== "all" && prospect.status !== filters.status)
      return false;
    if (filters.source !== "all" && prospect.leadSource !== filters.source)
      return false;
    if (
      filters.search &&
      !`${prospect.firstName} ${prospect.lastName}`
        .toLowerCase()
        .includes(filters.search.toLowerCase()) &&
      !prospect.email.toLowerCase().includes(filters.search.toLowerCase()) &&
      !prospect.company.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateProspect = async (prospectData) => {
    try {
      const newProspect = {
        id: prospects.length + 1,
        ...prospectData,
        status: "new",
        score: Math.floor(Math.random() * 40) + 60,
        assignedTo: currentUser.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        callAttemptsCount: 0,
      };

      setProspects([...prospects, newProspect]);
      setShowCreateModal(false);

      // Simulation d'appel API
      console.log("Nouveau prospect créé:", newProspect);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const handleEditProspect = async (prospectData) => {
    try {
      const updatedProspects = prospects.map((prospect) =>
        prospect.id === selectedProspect.id
          ? {
              ...prospect,
              ...prospectData,
              updatedAt: new Date().toISOString(),
            }
          : prospect
      );

      setProspects(updatedProspects);
      setShowEditModal(false);
      setSelectedProspect(null);

      // Simulation d'appel API
      console.log("Prospect modifié:", prospectData);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
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
      title: "",
      leadSource: "Site Web",
      notes: "",
      birthDate: "",
      postalCode: "",
      situationFamiliale: "Célibataire",
      nombreEnfants: 0,
      revenusAnnuels: "",
      mutuelleActuelle: "",
      dateFinContrat: "",
      besoinsSpe: "",
      sourcePublicite: "",
      bestCallTime: "9h-12h",
    });

    React.useEffect(() => {
      if (prospect) {
        setFormData({
          firstName: prospect.firstName || "",
          lastName: prospect.lastName || "",
          email: prospect.email || "",
          phone: prospect.phone || "",
          company: prospect.company || "",
          title: prospect.title || "",
          leadSource: prospect.leadSource || "Site Web",
          notes: prospect.notes || "",
          birthDate: prospect.birthDate || "",
          postalCode: prospect.postalCode || "",
          situationFamiliale: prospect.situationFamiliale || "Célibataire",
          nombreEnfants: prospect.nombreEnfants || 0,
          revenusAnnuels: prospect.revenusAnnuels || "",
          mutuelleActuelle: prospect.mutuelleActuelle || "",
          dateFinContrat: prospect.dateFinContrat || "",
          besoinsSpe: prospect.besoinsSpe || "",
          sourcePublicite: prospect.sourcePublicite || "",
          bestCallTime: prospect.bestCallTime || "9h-12h",
        });
      }
    }, [prospect]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        nombreEnfants: parseInt(formData.nombreEnfants) || 0,
        revenusAnnuels: parseFloat(formData.revenusAnnuels) || 0,
      });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poste
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source du Lead
                </label>
                <select
                  value={formData.leadSource}
                  onChange={(e) =>
                    setFormData({ ...formData, leadSource: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Site Web">Site Web</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Référence">Référence</option>
                  <option value="Salon">Salon</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Naissance
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
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
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation Familiale
                </label>
                <select
                  value={formData.situationFamiliale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      situationFamiliale: e.target.value,
                    })
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
                  min="0"
                  value={formData.nombreEnfants}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreEnfants: e.target.value })
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
                  value={formData.revenusAnnuels}
                  onChange={(e) =>
                    setFormData({ ...formData, revenusAnnuels: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mutuelle Actuelle
                </label>
                <input
                  type="text"
                  value={formData.mutuelleActuelle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mutuelleActuelle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Fin Contrat Actuel
                </label>
                <input
                  type="date"
                  value={formData.dateFinContrat}
                  onChange={(e) =>
                    setFormData({ ...formData, dateFinContrat: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meilleur Créneau d'Appel
                </label>
                <select
                  value={formData.bestCallTime}
                  onChange={(e) =>
                    setFormData({ ...formData, bestCallTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="9h-12h">9h-12h</option>
                  <option value="12h-14h">12h-14h</option>
                  <option value="14h-17h">14h-17h</option>
                  <option value="17h-19h">17h-19h</option>
                  <option value="19h-21h">19h-21h</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Publicitaire
                </label>
                <input
                  type="text"
                  value={formData.sourcePublicite}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sourcePublicite: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Besoins Spécifiques
              </label>
              <textarea
                value={formData.besoinsSpe}
                onChange={(e) =>
                  setFormData({ ...formData, besoinsSpe: e.target.value })
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Besoins spécifiques en matière d'assurance santé..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-heartbeat text-blue-600 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AssurCRM</h1>
              <p className="text-blue-100 text-xs">Gestion Assurance Santé</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

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

      <div className="flex-1 lg:ml-0">
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
                Gestion des Prospects
              </h2>
              <p className="text-gray-600">
                Suivi et qualification des prospects assurance santé
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
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
                  {stats.newProspects}
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

        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                <p className="text-gray-600">Chargement des prospects...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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
                        <i className="fas fa-users mr-1"></i>Base complète
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-users text-blue-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Nouveaux
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.newProspects}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        <i className="fas fa-user-plus mr-1"></i>À traiter
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
                        Contactés
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.contactedProspects}
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        <i className="fas fa-phone mr-1"></i>En cours
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-phone text-yellow-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Qualifiés
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.qualifiedProspects}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        <i className="fas fa-star mr-1"></i>Chauds
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
                        Convertis
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.convertedProspects}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-check-circle mr-1"></i>Clients
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
                        Taux Conversion
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.conversionRate}%
                      </p>
                      <p className="text-sm text-emerald-600 mt-1">
                        <i className="fas fa-chart-line mr-1"></i>Performance
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-chart-line text-emerald-600 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

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
                      <option value="converted">Convertis</option>
                      <option value="unqualified">Non qualifiés</option>
                    </select>

                    <select
                      value={filters.source}
                      onChange={(e) =>
                        setFilters({ ...filters, source: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Toutes les sources</option>
                      <option value="Site Web">Site Web</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Facebook">Facebook</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Référence">Référence</option>
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
                          Score
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Source
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Assigné à
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
                                  {prospect.firstName[0]}
                                  {prospect.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {prospect.firstName} {prospect.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {prospect.company} - {prospect.title}
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
                            <div
                              className={`font-semibold ${getScoreColor(
                                prospect.score
                              )}`}
                            >
                              {prospect.score}/100
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  prospect.score >= 80
                                    ? "bg-green-500"
                                    : prospect.score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${prospect.score}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {prospect.leadSource}
                            </div>
                            <div className="text-xs text-gray-500">
                              {prospect.sourcePublicite}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {prospect.assignedTo}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(prospect.createdAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </div>
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
                              <a
                                href={`/comparateur?prospect=${prospect.id}`}
                                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                                title="Simulation Oggo"
                              >
                                <i className="fas fa-heartbeat"></i>
                              </a>
                              <button
                                onClick={() =>
                                  handleDeleteProspect(prospect.id)
                                }
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                title="Supprimer"
                              >
                                <i className="fas fa-trash"></i>
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