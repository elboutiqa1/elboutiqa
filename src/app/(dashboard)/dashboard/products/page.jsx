"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  Package,
  UploadCloud,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Tag,
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp,
  Boxes,
  Zap,
  BadgePercent,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  Minus,
  GalleryHorizontal,
  ExternalLink,
  Globe,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import { toast } from "sonner"
/* ─────────────────────────────────────────────
   Utility helpers
───────────────────────────────────────────── */
const fmtPrice = (n) =>
  Number(n).toLocaleString("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 });

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY_OPTION = { name: "", price: "", oldPrice: "" };
const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  price: "",
  oldPrice: "",
  category: "",
  inStock: true,
  isFeatured: false,
  features: [],
  options: [],
  img: "",
  images: [],
};

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const [imgTab, setImgTab] = useState("upload");
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Fetch data ── */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  /* ── Filters ── */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.slug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        filterCategory === "all" ||
        String(p.category?._id || p.category) === filterCategory;
      const matchStock =
        filterStock === "all" ||
        (filterStock === "in" && p.inStock) ||
        (filterStock === "out" && !p.inStock);
      return matchSearch && matchCat && matchStock;
    });
  }, [products, searchQuery, filterCategory, filterStock]);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    featured: products.filter((p) => p.isFeatured).length,
    withOptions: products.filter((p) => p.options?.length > 0).length,
  }), [products]);

  /* ── Image handlers ── */
  const handleImgFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(reader.result);
      setFormData((p) => ({ ...p, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((p) => ({ ...p, images: [...p.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeExtraImage = (idx) =>
    setFormData((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  /* ── Modal openers ── */
  const openAdd = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setIsSlugManuallyEdited(false);
    setImgPreview("");
    setImgTab("upload");
    setNewFeature("");
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug || "",
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || "",
      category: String(product.category?._id || product.category),
      inStock: product.inStock,
      isFeatured: product.isFeatured || false,
      features: product.features || [],
      options: (product.options || []).map((o) => ({ ...o })),
      img: product.img,
      images: product.images || [],
    });
    setIsSlugManuallyEdited(true);
    setImgPreview(product.img);
    setImgTab(product.img?.startsWith("data:") ? "upload" : "url");
    setNewFeature("");
    setIsModalOpen(true);
  };

  /* ── Features ── */
  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((p) => ({ ...p, features: [...p.features, newFeature.trim()] }));
    setNewFeature("");
  };

  const removeFeature = (idx) =>
    setFormData((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));

  /* ── Options ── */
  const addOption = () =>
    setFormData((p) => ({ ...p, options: [...p.options, { ...EMPTY_OPTION }] }));

  const updateOption = (idx, field, val) =>
    setFormData((p) => ({
      ...p,
      options: p.options.map((o, i) => (i === idx ? { ...o, [field]: val } : o)),
    }));

  const removeOption = (idx) =>
    setFormData((p) => ({ ...p, options: p.options.filter((_, i) => i !== idx) }));

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.category) return;

    setIsSubmitting(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const payload = {
        ...formData,
        slug: formData.slug.trim() || slugify(formData.name),
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice) || 0,
        img: imgPreview || formData.img,
        options: formData.options.map((o) => ({
          name: o.name,
          price: Number(o.price) || 0,
          oldPrice: Number(o.oldPrice) || 0,
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      await fetchProducts();
      toast.success("produit enregistrer avec succes");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/products/${productToDelete._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchProducts();
      setProductToDelete(null);
      toast.success("produit supprimer avec succes");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  /* ── Render ── */
  return (
    <div className="w-full max-w-7xl pb-16   ">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ">
        <div>
          <SectionTitle title="Gestion des Produits" />
          <p className="text-sm text-text-muted mt-1">
            Ajoutez, modifiez et gérez tous vos produits et leurs liens (slug) pour le magasin.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 cursor-pointer w-fit"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="text-md">Nouveau Produit</span>
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Produits", value: stats.total, icon: <Package size={22} />, color: "bg-primary/10 text-primary" },
          { label: "En Stock", value: stats.inStock, icon: <CheckCircle2 size={22} />, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Mis en avant", value: stats.featured, icon: <Star size={22} />, color: "bg-amber-400/10 text-amber-600" },
          { label: "Avec Options", value: stats.withOptions, icon: <Boxes size={22} />, color: "bg-violet-500/10 text-violet-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{s.label}</p>
              <h3 className="text-2xl font-bold text-primary mt-0.5">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border border-border/80 rounded-2xl p-4 mb-6 shadow-xs flex flex-row  items-center justify-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted opacity-60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher nom, slug..."
            className="w-full pl-10 pr-9 py-2 bg-background-muted/70 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-background-muted/70 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text"
        >
          <option value="all">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* Stock filter */}
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="px-3 py-2 bg-background-muted/70 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text"
        >
          <option value="all">Tout le stock</option>
          <option value="in">En stock</option>
          <option value="out">Rupture</option>
        </select>

        <span className="text-xs text-text-muted font-medium ml-auto hidden sm:block">
          {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
        </span>

        {/* View toggle */}
        <div className="flex items-center bg-background-muted border border-border rounded-xl p-1 gap-1">
          <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-primary shadow-xs" : "text-text-muted hover:text-text"}`} title="Grille">
            <LayoutGrid size={18} />
          </button>
          <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-white text-primary shadow-xs" : "text-text-muted hover:text-text"}`} title="Tableau">
            <List size={18} />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-text-muted">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3" />
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState searchQuery={searchQuery} onAdd={openAdd} onReset={() => setSearchQuery("")} />
      ) : viewMode === "grid" ? (
        <GridView products={filtered} onEdit={openEdit} onDelete={setProductToDelete} />
      ) : (
        <TableView products={filtered} onEdit={openEdit} onDelete={setProductToDelete} />
      )}

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed  inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200
      
        ">
          <div
            className=" bg-white sm:border sm:border-border  w-full max-w-2xl  sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background-muted/40 rounded-t-3xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {editingProduct ? <Pencil size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">
                    {editingProduct ? "Modifier le produit" : "Nouveau produit"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {editingProduct ? "Mettez à jour les informations et le slug" : "Remplissez les détails du produit"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-text-muted hover:text-text rounded-xl hover:bg-black/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative p-6 pb-0 overflow-y-auto space-y-6 flex-1 ">

              {/* ── Name ── */}
              <Field label="Nom du produit" required>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((p) => ({
                      ...p,
                      name,
                      slug: !isSlugManuallyEdited ? slugify(name) : p.slug,
                    }));
                  }}
                  placeholder="Ex: Hub USB-C 11-en-1"
                  className={inputCls}
                />
              </Field>

              {/* ── Slug ── */}
              <Field label="Slug URL (identifiant URL)" icon={<Globe size={14} />}>
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => {
                        setIsSlugManuallyEdited(true);
                        setFormData((p) => ({ ...p, slug: slugify(e.target.value) }));
                      }}
                      placeholder={slugify(formData.name) || "ex: hub-usb-c-11-en-1"}
                      className={`${inputCls} font-mono text-xs`}
                    />
                  </div>
                  <p className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
                    <span>Lien du produit:</span>
                    <span className="text-primary font-semibold">/product/{formData.slug || slugify(formData.name) || "..."}</span>
                  </p>
                </div>
              </Field>

              {/* ── Description ── */}
              <Field label="Description" required>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description détaillée du produit..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* ── Prices + Category ── */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Prix (DZD)" required>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                      placeholder="15000"
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                </Field>

                <Field label="Ancien Prix (DZD)">
                  <div className="relative">
                    <BadgePercent size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="number"
                      min={0}
                      value={formData.oldPrice}
                      onChange={(e) => setFormData((p) => ({ ...p, oldPrice: e.target.value }))}
                      placeholder="0"
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                </Field>

                <Field label="Catégorie" required>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Choisir...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* ── Toggles ── */}
              <div className="flex items-center gap-6">
                <ToggleField
                  label="En stock"
                  value={formData.inStock}
                  onChange={(v) => setFormData((p) => ({ ...p, inStock: v }))}
                  activeColor="text-emerald-600"
                />
                <ToggleField
                  label="Mis en avant"
                  value={formData.isFeatured}
                  onChange={(v) => setFormData((p) => ({ ...p, isFeatured: v }))}
                  activeColor="text-amber-500"
                />
              </div>

              {/* ── Main Image ── */}
              <Field label="Image principale">
                <div className="flex items-center bg-background-muted p-0.5 rounded-lg border border-border text-xs mb-3 w-fit">
                  {[["upload", <UploadCloud size={13} key="u" />, "Fichier"], ["url", <Link2 size={13} key="l" />, "URL"]].map(([tab, icon, lbl]) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setImgTab(tab)}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${imgTab === tab ? "bg-white text-primary shadow-xs" : "text-text-muted"}`}
                    >
                      {icon}{lbl}
                    </button>
                  ))}
                </div>

                {imgTab === "upload" ? (
                  <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors bg-background-muted/20">
                    {imgPreview ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden group">
                        <Image src={imgPreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 500px" className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => { setImgPreview(""); setFormData((p) => ({ ...p, img: "" })); }}
                            className="p-2 bg-red-600 text-white rounded-lg text-xs flex items-center gap-1 hover:bg-red-700">
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center py-5 cursor-pointer">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                          <ImagePlus size={22} />
                        </div>
                        <span className="text-sm font-semibold text-primary">Choisir une image</span>
                        <span className="text-xs text-text-muted mt-0.5">PNG, JPG, WEBP — max 5 Mo</span>
                        <input type="file" accept="image/*" onChange={handleImgFile} className="hidden" />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.img}
                      onChange={(e) => { setFormData((p) => ({ ...p, img: e.target.value })); setImgPreview(e.target.value); }}
                      placeholder="https://..."
                      className={inputCls}
                    />
                    {imgPreview && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border">
                        <Image src={imgPreview} alt="Preview" fill sizes="500px" className="object-cover" onError={() => setImgPreview("")} />
                      </div>
                    )}
                  </div>
                )}
              </Field>

              {/* ── Extra Images ── */}
              <Field label="Galerie d'images" icon={<GalleryHorizontal size={14} />}>
                <div className="space-y-3">
                  {/* Existing images grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {formData.images.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-slate-50">
                          <Image
                            src={src}
                            alt={`img-${i}`}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeExtraImage(i)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add images button */}
                  <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-border rounded-xl text-sm text-text-muted hover:border-primary hover:text-primary transition-all cursor-pointer bg-background-muted/20">
                    <PlusCircle size={16} />
                    <span>Ajouter des images ({formData.images.length} ajoutée{formData.images.length !== 1 ? "s" : ""})</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddImages}
                      className="hidden"
                    />
                  </label>
                </div>
              </Field>

              {/* ── Features ── */}
              <Field label="Caractéristiques" icon={<Zap size={14} />}>
                <div className="space-y-2">
                  {formData.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-background-muted/60 border border-border rounded-xl px-3 py-2">
                      <span className="flex-1 text-sm text-text">{f}</span>
                      <button type="button" onClick={() => removeFeature(i)} className="text-text-muted hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                      placeholder="Ajouter une caractéristique..."
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </div>
              </Field>

              {/* ── Options / Variants ── */}
              <Field label="Options / Variantes" icon={<Tag size={14} />}>
                <div className="space-y-3">
                  {formData.options.map((opt, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center bg-background-muted/40 border border-border rounded-xl p-3">
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => updateOption(i, "name", e.target.value)}
                        placeholder="Nom de l'option (ex: Grand)"
                        className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all w-full"
                      />
                      <input
                        type="number"
                        value={opt.price}
                        onChange={(e) => updateOption(i, "price", e.target.value)}
                        placeholder="Prix"
                        min={0}
                        className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all w-24"
                      />
                      <input
                        type="number"
                        value={opt.oldPrice}
                        onChange={(e) => updateOption(i, "oldPrice", e.target.value)}
                        placeholder="Ancien"
                        min={0}
                        className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all w-24"
                      />
                      <button type="button" onClick={() => removeOption(i)} className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Minus size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-text-muted hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={16} /> Ajouter une option
                  </button>
                </div>
              </Field>

              {/* ── Submit ── */}
              <div className="py-4 border-t border-border flex items-center justify-center gap-3 sticky bottom-0 bg-background  ">
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
                      <span>{editingProduct ? "Mettre à jour" : "Créer le produit"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Supprimer le produit ?</h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Voulez-vous supprimer définitivement{" "}
              <strong className="text-primary">&quot;{productToDelete.name}&quot;</strong> ? Cette action est irréversible.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
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

/* ─────────────────────────────────────────────
   Sub-Components
───────────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-2.5 bg-background-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

function Field({ label, required, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
        {icon && <span className="text-primary/60">{icon}</span>}
        {label}
        {required && <span className="text-red-500 normal-case tracking-normal font-normal text-sm">*</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleField({ label, value, onChange, activeColor = "text-primary" }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-2 group"
    >
      {value ? (
        <ToggleRight size={28} className={`${activeColor} transition-colors`} />
      ) : (
        <ToggleLeft size={28} className="text-text-muted/50 transition-colors" />
      )}
      <span className={`text-sm font-medium transition-colors ${value ? activeColor : "text-text-muted"}`}>
        {label}
      </span>
    </button>
  );
}

function EmptyState({ searchQuery, onAdd, onReset }) {
  return (
    <div className="bg-white border border-border/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary/40 flex items-center justify-center mb-4">
        <Package size={32} />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1">Aucun produit trouvé</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">
        {searchQuery
          ? `Aucun résultat pour "${searchQuery}".`
          : "Commencez par ajouter votre premier produit."}
      </p>
      {searchQuery ? (
        <button onClick={onReset} className="px-4 py-2 text-sm text-primary font-medium border border-border rounded-xl hover:bg-background-muted transition-colors">
          Réinitialiser
        </button>
      ) : (
        <button onClick={onAdd} className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-all flex items-center gap-2">
          <Plus size={16} /> Ajouter un produit
        </button>
      )}
    </div>
  );
}

/* ── Grid View ── */
function GridView({ products, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product, index) => (
        <div key={product._id} className="group bg-white border border-border/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col">
          {/* Image */}
          <div className="relative w-full h-44 bg-slate-50 overflow-hidden">
            {product.img ? (
              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index < 3}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <ImagePlus size={32} strokeWidth={1.5} />
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isFeatured && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400/90 text-white text-xs font-semibold backdrop-blur-sm">
                  <Star size={11} fill="white" /> Vedette
                </span>
              )}
              {!product.inStock && (
                <span className="px-2 py-0.5 rounded-lg bg-red-600/90 text-white text-xs font-semibold backdrop-blur-sm">
                  Rupture
                </span>
              )}
            </div>
            {product.options?.length > 0 && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                {product.options.length} options
              </div>
            )}
            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Link
                href={`/product/${product.slug || product._id}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white text-primary rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all hover:scale-110 cursor-pointer"
                title="Voir sur le site"
              >
                <ExternalLink size={16}  />
              </Link>
              <button onClick={() => onEdit(product)} className="p-2.5 bg-white text-primary rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all hover:scale-110 cursor-pointer" title="Modifier">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(product)} className="p-2.5  bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all hover:scale-110 cursor-pointer" title="Supprimer">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-text-muted font-medium">{product.category?.name || "—"}</span>
              {product.slug && (
                <span className="text-[11px] font-mono text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                  /{product.slug}
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-primary line-clamp-2 mb-2">{product.name}</h3>
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/60">
              <span className="text-md font-bold text-primary">
                {Number(product.price).toLocaleString()} DA
              </span>
              {product.oldPrice > 0 && (
                <span className="text-xs text-text-muted line-through">
                  {Number(product.oldPrice).toLocaleString()} DA
                </span>
              )}
              <div className="ml-auto flex gap-1 sm:hidden">
                <Link href={`/product/${product.slug || product._id}`} target="_blank" className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><ExternalLink size={14} /></Link>
                <button onClick={() => onEdit(product)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                <button onClick={() => onDelete(product)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Table View ── */
function TableView({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-border/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-background-muted/60 border-b border-border text-xs uppercase font-semibold text-text-muted">
              <th className="py-3.5 px-4">Produit</th>
              <th className="py-3.5 px-4">Slug URL</th>
              <th className="py-3.5 px-4">Catégorie</th>
              <th className="py-3.5 px-4">Prix</th>
              <th className="py-3.5 px-4 text-center">Stock</th>
              <th className="py-3.5 px-4 text-center">Options</th>
              <th className="py-3.5 px-4 text-center">Vedette</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-background-muted/30 transition-colors group">
                {/* Product */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-border shrink-0">
                      {product.img ? (
                        <Image src={product.img} alt={product.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImagePlus size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-primary line-clamp-1 max-w-[200px]">{product.name}</div>
                      <div className="text-xs text-text-muted line-clamp-1 max-w-[200px] mt-0.5">{product.description}</div>
                    </div>
                  </div>
                </td>
                {/* Slug */}
                <td className="py-3 px-4">
                  <Link
                    href={`/product/${product.slug || product._id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-mono text-xs text-primary/80 bg-background-muted/80 px-2 py-1 rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors max-w-[160px] truncate"
                    title={`Ouvrir /product/${product.slug || product._id}`}
                  >
                    <span className="truncate">/{product.slug || product._id}</span>
                    <ExternalLink size={11} className="shrink-0 opacity-60" />
                  </Link>
                </td>
                {/* Category */}
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15">
                    {product.category?.name || "—"}
                  </span>
                </td>
                {/* Price */}
                <td className="py-3 px-4">
                  <div className="font-bold text-primary">{Number(product.price).toLocaleString()} DA</div>
                  {product.oldPrice > 0 && (
                    <div className="text-xs text-text-muted line-through">{Number(product.oldPrice).toLocaleString()} DA</div>
                  )}
                </td>
                {/* Stock */}
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold ${product.inStock ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                    {product.inStock ? "En stock" : "Rupture"}
                  </span>
                </td>
                {/* Options */}
                <td className="py-3 px-4 text-center">
                  {product.options?.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                      <Boxes size={11} /> {product.options.length}
                    </span>
                  ) : (
                    <span className="text-xs text-text-muted">—</span>
                  )}
                </td>
                {/* Featured */}
                <td className="py-3 px-4 text-center">
                  {product.isFeatured ? (
                    <Star size={16} className="text-amber-400 fill-amber-400 mx-auto" />
                  ) : (
                    <span className="text-xs text-text-muted">—</span>
                  )}
                </td>
                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/product/${product.slug || product._id}`}
                      target="_blank"
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                      title="Voir sur le site"
                    >
                      <ExternalLink size={15} />
                    </Link>
                    <button onClick={() => onEdit(product)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer" title="Modifier">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(product)} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}