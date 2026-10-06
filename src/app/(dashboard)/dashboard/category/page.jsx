"use client";

import React, { useState, useMemo,useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  FolderTree,
  Package,
  Layers,
  UploadCloud,
  Link2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";

import { toast } from "sonner"


export default function CategoryPage() {
  // Liste des catégories (tu remplaceras ceci par ton fetch MongoDB / SWR / React Query)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchCategories = async () => {
  try {
    const res = await fetch("/api/category");
    const data = await res.json();

    if (data.success) {
      setCategories(data.categories);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchCategories();
}, []);






  // Recherche & Vue
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' ou 'table'

  // État du modal d'ajout / modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = Mode Ajout, Object = Mode Modif

  // État du modal de suppression
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Formulaire Catégorie
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
  });

  const [imageTab, setImageTab] = useState("upload"); // 'upload' | 'url'
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrer les catégories selon la recherche
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Statistiques
  const totalProducts = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  }, [categories]);

  // Générer automatiquement le slug à partir du nom
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generateSlug(name),
    }));
  };

  // Gestion du téléversement d'image en local (Preview)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Ouvrir le modal d'ajout
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", image: ""});
    setImagePreview("");
    setImageTab("upload");
    setIsModalOpen(true);
  };

  // Ouvrir le modal de modification
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || "",
    });
    setImagePreview(cat.image || "");
    setImageTab(cat.image?.startsWith("data:") ? "upload" : "url");
    setIsModalOpen(true);
  };

  // Soumission du formulaire (Ajout / Modif)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    try {
      const url = editingCategory
        ? `/api/category/${editingCategory._id}`
        : "/api/category";

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          image: imagePreview || formData.image,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Erreur serveur (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      await fetchCategories();
      toast.success("categorie enregistrer avec succes");
      setIsModalOpen(false);
    } catch (error) {
      console.error("CATEGORY ERROR:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression
  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const res = await fetch(
        `/api/category/${categoryToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Erreur serveur (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Erreur de suppression");
      }

      await fetchCategories();
      toast.success("categorie supprimer avec succes");
      setCategoryToDelete(null);
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);
      toast.error(error.message);
    }
  };


  return (
    <div className="w-full max-w-7xl pb-16  ">
      {/* 1. Header & Titre de section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <SectionTitle title="Gestion des Catégories" />
          <p className="text-sm text-text-muted mt-1">
            Organisez et structurez le catalogue de votre boutique en quelques clics.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium  hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 cursor-pointer w-fit"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* 2. Cartes de statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-border/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FolderTree size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Total Catégories</p>
            <h3 className="text-2xl font-bold text-primary mt-0.5">{categories.length}</h3>
          </div>
        </div>

        <div className="bg-white border border-border/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/20 text-yellow-700 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Produits Associés</p>
            <h3 className="text-2xl font-bold text-primary mt-0.5">{totalProducts}</h3>
          </div>
        </div>

        <div className="bg-white border border-border/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Catégories Actives</p>
            <h3 className="text-2xl font-bold text-primary mt-0.5">{categories.length}</h3>
          </div>
        </div>
      </div>

      {/* 3. Barre d'outils (Recherche + Switch Vue Grid/Table) */}
      <div className="bg-white border border-border/80 rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Champ de recherche */}
        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted opacity-60"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une catégorie..."
            className="w-full pl-10 pr-9 py-2 bg-background-muted/70 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Contrôles de vue */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-text-muted font-medium">
            {filteredCategories.length} {filteredCategories.length <= 1 ? "catégorie trouvée" : "catégories trouvées"}
          </span>

          <div className="flex items-center bg-background-muted border border-border rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-primary shadow-xs font-medium"
                  : "text-text-muted hover:text-text"
              }`}
              title="Vue Grille"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white text-primary shadow-xs font-medium"
                  : "text-text-muted hover:text-text"
              }`}
              title="Vue Tableau"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Affichage des catégories */}
      {filteredCategories.length === 0 ? (
        /* État vide si aucune catégorie trouvée */
        <div className="bg-white border border-border/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary/40 flex items-center justify-center mb-4">
            <FolderTree size={32} />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1">Aucune catégorie trouvée</h3>
          <p className="text-sm text-text-muted max-w-sm mb-6">
            {searchQuery
              ? `Aucun résultat ne correspond à "${searchQuery}". Essayez un autre mot-clé.`
              : "Commencez par ajouter votre première catégorie pour organiser vos produits."}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 text-sm text-primary font-medium border border-border rounded-xl hover:bg-background-muted transition-colors"
            >
              Réinitialiser la recherche
            </button>
          ) : (
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Créer une catégorie</span>
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* ================= VUE GRILLE ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <div
              key={category._id}
              className="group bg-white border border-border/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image de la catégorie */}
              <div className="relative w-full h-44 bg-slate-100 overflow-hidden flex justify-center items-center">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    priority={index < 4}
                    className="w-45 h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                    <ImagePlus size={32} strokeWidth={1.5} />
                    <span className="text-xs mt-1">Pas d'image</span>
                  </div>
                )}

                {/* Badge nombre de produits */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 shadow-xs">
                  <Package size={13} />
                  <span>{category.productCount || 0} produits</span>
                </div>

                {/* Actions overlay sur hover */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenEditModal(category)}
                    className="p-2.5 bg-white text-primary rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all transform hover:scale-110 cursor-pointer"
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(category)}
                    className="p-2.5 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Informations */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-primary group-hover:text-primary-hover transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-text-muted/80 font-mono mt-0.5">
                    /{category.slug}
                  </p>
                </div>

                {/* Footer de la carte */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                  <span>Créé le {category.createdAt || "Récemment"}</span>

                  <div className="flex items-center gap-1 sm:hidden">
                    <button
                      onClick={() => handleOpenEditModal(category)}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(category)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= VUE TABLEAU ================= */
        <div className="bg-white border border-border/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-background-muted/60 border-b border-border text-xs uppercase font-semibold text-text-muted">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Nom de la Catégorie</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4 text-center">Produits</th>
                  <th className="py-3.5 px-4">Date de création</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-background-muted/40 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-border shrink-0">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImagePlus size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-primary line-clamp-1">{category.name}</div>
                     
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-text-muted">
                      /{category.slug}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {category.productCount || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-text-muted">
                      {category.createdAt || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(category)}
                          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL AJOUT / MODIFICATION ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white border border-border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-background-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {editingCategory ? <Pencil size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {editingCategory
                      ? "Mettez à jour les informations de la catégorie"
                      : "Remplissez les détails pour créer une nouvelle catégorie"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-text-muted hover:text-text rounded-xl hover:bg-black/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Corps du formulaire */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              {/* Nom de la catégorie */}
              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  Nom de la catégorie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Ex: Électronique & Smartphones"
                  className="w-full px-4 py-2.5 bg-background-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Slug (URL) */}
              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  Identifiant URL (Slug)
                </label>
                <div className="flex items-center rounded-xl border border-border bg-background-muted/40 overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <span className="px-3 text-xs text-text-muted font-mono bg-background-muted border-r border-border py-2.5">
                    /category/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="electronique-smartphones"
                    className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Image de la catégorie */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
                    Image de la catégorie
                  </label>

                  {/* Switch Upload / URL */}
                  <div className="flex items-center bg-background-muted p-0.5 rounded-lg border border-border text-xs">
                    <button
                      type="button"
                      onClick={() => setImageTab("upload")}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                        imageTab === "upload"
                          ? "bg-white text-primary shadow-xs"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      <UploadCloud size={13} />
                      Fichier
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab("url")}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                        imageTab === "url"
                          ? "bg-white text-primary shadow-xs"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      <Link2 size={13} />
                      Lien URL
                    </button>
                  </div>
                </div>

                {imageTab === "upload" ? (
                  /* Zone de téléversement fichier */
                  <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors bg-background-muted/20 relative">
                    {imagePreview ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden group">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          sizes="(max-width: 640px) 100vw, 500px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview("");
                              setFormData({ ...formData, image: "" });
                            }}
                            className="p-2 bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-red-700 transition-colors"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                          <ImagePlus size={24} />
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          Cliquez pour choisir une image
                        </span>
                        <span className="text-xs text-text-muted mt-1">
                          PNG, JPG, WEBP jusqu'à 5 Mo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  /* Champ URL d'image */
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 bg-background-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />

                    {imagePreview && (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden border border-border bg-slate-100">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          sizes="(max-width: 640px) 100vw, 500px"
                          className="object-cover"
                          onError={() => setImagePreview("")}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              

              {/* Boutons d'action du Modal */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:text-text hover:bg-background-muted transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>{editingCategory ? "Mettre à jour" : "Créer la catégorie"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CONFIRMATION SUPPRESSION ================= */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-lg font-bold text-primary mb-2">
              Supprimer la catégorie ?
            </h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement la catégorie{" "}
              <strong className="text-primary font-semibold">"{categoryToDelete.name}"</strong> ?
              Cette action est irréversible.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-muted transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-red-600/20 cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}