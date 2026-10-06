"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Tags,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Plus,
  Minus,
  ArrowRight,
  Calculator,
  Truck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";
import deliveryRatesData from "@/app/assets/tarifs_livraison_ecom_delivery.json";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // État du calculateur interactif FormeSection
  const [calcQuantity, setCalcQuantity] = useState(1);
  const [calcPrice, setCalcPrice] = useState(2500);
  const [calcWilayaCode, setCalcWilayaCode] = useState("16"); // Alger par défaut
  const [calcDeliveryType, setCalcDeliveryType] = useState("home"); // 'home' ou 'desk'
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDeducting, setIsDeducting] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState(false);

  // État du modal d'ajustement / déduction personnalisée
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustOrderCount, setAdjustOrderCount] = useState(1);
  const [adjustAmount, setAdjustAmount] = useState(2500);
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Chargement initial des statistiques
  useEffect(() => {
    let isMounted = true;
    async function loadInitialStats() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Échec du chargement des statistiques:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitialStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Actualisation manuelle
  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Échec de l'actualisation des statistiques:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Calcul des frais de livraison et du total conformément à FormeSection
  const selectedWilayaObj = deliveryRatesData.tarifs.find(
    (t) => String(t.code) === String(calcWilayaCode)
  );

  const calcShippingFee = selectedWilayaObj
    ? calcDeliveryType === "desk"
      ? selectedWilayaObj.stop_desk
      : selectedWilayaObj.domicile
    : 0;

  const calcItemsTotal = calcPrice * calcQuantity;
  const calcGrandTotal = calcItemsTotal + calcShippingFee;

  // Simulation d'une commande enregistrée via FormeSection (Ajouter)
  const handleSimulateOrder = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          grandTotal: calcGrandTotal,
          orderCount: 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setSimulationSuccess(true);
        toast.success("Commande enregistrée avec succès");
        setTimeout(() => setSimulationSuccess(false), 3000);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Erreur lors de la simulation:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Déduire directement une commande et le montant calculé (Diminuer)
  const handleDecreaseOrder = async () => {
    if (stats.totalOrders <= 0 && stats.totalRevenue <= 0) {
      toast.error("Le nombre de commandes et le chiffre d'affaires sont déjà à 0");
      return;
    }
    setIsDeducting(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "decrease",
          grandTotal: calcGrandTotal,
          orderCount: 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        toast.success("1 commande et son montant ont été déduits avec succès");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Erreur lors de la déduction:", err);
    } finally {
      setIsDeducting(false);
    }
  };

  // Déduction personnalisée depuis le modal
  const handleCustomDecrease = async (e) => {
    e.preventDefault();
    if (adjustOrderCount <= 0 && adjustAmount <= 0) {
      toast.error("Veuillez saisir un nombre de commandes ou un montant valide");
      return;
    }
    setIsAdjusting(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "decrease",
          grandTotal: Math.max(0, Number(adjustAmount) || 0),
          orderCount: Math.max(0, Number(adjustOrderCount) || 0),
        }),
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setIsAdjustModalOpen(false);
        toast.success("Déduction personnalisée effectuée avec succès");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsAdjusting(false);
    }
  };

  // Réinitialiser les commandes à 0
  const handleResetOrders = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir réinitialiser le nombre de commandes et le chiffre d'affaires à 0 ?")) return;
    setIsAdjusting(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setIsAdjustModalOpen(false);
        toast.success("Les statistiques de commandes ont été réinitialisées à 0");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsAdjusting(false);
    }
  };

  // Les 4 cartes statistiques principales
  const metricCards = [
    {
      id: "products",
      title: "Total des Produits",
      value: stats.totalProducts,
      suffix: "produits",
      subtitle: "Articles enregistrés en base de données",
      icon: Package,
      iconBg: "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20",
      accentBorder: "hover:border-indigo-500/40",
      badgeText: "Base de données",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      link: "/dashboard/products",
      linkText: "Gérer les produits",
    },
    {
      id: "categories",
      title: "Total des Catégories",
      value: stats.totalCategories,
      suffix: "catégories",
      subtitle: "Catégories actives dans la boutique",
      icon: Tags,
      iconBg: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
      accentBorder: "hover:border-purple-500/40",
      badgeText: "Actives",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      link: "/dashboard/category",
      linkText: "Gérer les catégories",
    },
    {
      id: "orders",
      title: "Total des Commandes",
      value: stats.totalOrders,
      suffix: "commandes",
      subtitle: "Calculées et enregistrées via FormeSection",
      icon: ShoppingBag,
      iconBg: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
      accentBorder: "hover:border-amber-500/40",
      badgeText: "elboutiqa",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      link: null,
      linkText: "Total commandes",
    },
    {
      id: "revenue",
      title: "Valeur Totale des Commandes",
      value: Number(stats.totalRevenue).toLocaleString("fr-FR"),
      suffix: "DZD",
      subtitle: "Montant cumulé de toutes les ventes",
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
      accentBorder: "hover:border-emerald-500/40",
      badgeText: "Chiffre d'affaires",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      link: null,
      linkText: "Revenu global",
      isHighlighted: true,
    },
  ];

  return (
    <div dir="ltr" className="w-full max-w-7xl pb-16  ">
      {/* ── En-tête de la page (Header & Toolbar) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-2 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="whitespace-nowrap items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Tableau de bord
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-alexandria text-primary">
            Vue d&apos;ensemble &amp; Statistiques
          </h1>
          <p className="text-sm text-text-muted mt-1 font-cairo">
            Suivi en temps réel des produits, catégories, total des commandes et chiffre d&apos;affaires global.
          </p>
        </div>

        {/* Boutons d'actions rapides */}
        <div className="flex items-center justify-center flex-wrap gap-2.5">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-background-muted active:scale-[0.98] text-sm font-semibold text-primary transition-all duration-200 shadow-xs cursor-pointer disabled:opacity-60"
            title="Actualiser les données"
          >
            <RefreshCw
              className={`w-4 h-4 text-primary ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span>{refreshing ? "Actualisation..." : "Actualiser"}</span>
          </button>

          {/* Bouton d'ajustement / déduction manuelle */}
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-background-muted active:scale-[0.98] text-sm font-semibold text-text hover:text-red transition-all duration-200 shadow-xs cursor-pointer"
            title="Ajuster ou déduire des commandes"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Ajuster / Diminuer</span>
          </button>

          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-background hover:bg-primary-hover active:scale-[0.98] text-sm font-semibold transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background hover:bg-background-muted text-sm font-semibold text-text-muted hover:text-primary transition-all duration-200 shadow-xs"
            title="Aperçu de la boutique"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Aperçu Boutique</span>
          </Link>
        </div>
      </div>

      {/* ── Les 4 Cartes Statistiques Principales ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-2xl bg-background border border-border/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                card.accentBorder
              } ${
                card.isHighlighted
                  ? "ring-1 ring-emerald-500/30 bg-gradient-to-br from-background via-background to-emerald-50/20"
                  : ""
              }`}
            >
              {/* Entête de carte */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${card.badgeColor}`}
                >
                  {card.badgeText}
                </span>
              </div>

              {/* Titre et Valeur */}
              <div>
                <p className="text-xs font-semibold text-text-muted">
                  {card.title}
                </p>

                {loading ? (
                  <div className="h-9 w-24 bg-border/60 rounded-lg animate-pulse my-1.5" />
                ) : (
                  <div className="flex items-baseline gap-1.5 my-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-alexandria text-primary tracking-tight">
                      {card.value}
                    </h3>
                    <span className="text-xs font-bold text-text-muted">
                      {card.suffix}
                    </span>
                  </div>
                )}

                <p className="text-[11px] text-text-muted/80 line-clamp-1 mt-0.5">
                  {card.subtitle}
                </p>
              </div>

              {/* Lien d'action si disponible */}
              {card.link && (
                <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <Link
                    href={card.link}
                    className="text-primary hover:text-primary-hover font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section Calculs et Simulateur FormeSection ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Simulateur de Calcul de Commande (FormeSection) */}
        <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-border bg-background p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-alexandria text-primary">
                  Calculateur de Commande
                </h2>
                <p className="text-xs text-text-muted">
                  Calcul conforme aux commandes clients : (Prix unitaire × Quantité) + Frais de livraison
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire du simulateur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {/* Prix du produit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary">
                Prix unitaire du produit (DZD)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={calcPrice}
                onChange={(e) => setCalcPrice(Math.max(0, Number(e.target.value) || 0))}
                className="w-full h-11 px-3 rounded-xl border border-border bg-background-muted/60 text-sm focus:outline-none focus:border-primary font-bold text-primary"
              />
            </div>

            {/* Quantité */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary">
                Quantité commandée
              </label>
              <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden h-11">
                <button
                  type="button"
                  onClick={() => setCalcQuantity(Math.max(1, calcQuantity - 1))}
                  className="px-3.5 h-full text-primary hover:bg-border/60 transition-colors font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm text-primary">
                  {calcQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setCalcQuantity(calcQuantity + 1)}
                  className="px-3.5 h-full text-primary hover:bg-border/60 transition-colors font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Wilaya */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary">
                Wilaya de livraison (58 wilayas)
              </label>
              <select
                value={calcWilayaCode}
                onChange={(e) => setCalcWilayaCode(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-border bg-background-muted/60 text-sm focus:outline-none focus:border-primary cursor-pointer text-text"
              >
                {deliveryRatesData.tarifs.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.code} - {t.wilaya}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode de livraison */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary">
                Mode de livraison
              </label>
              <div className="grid grid-cols-2 gap-2 h-11">
                <button
                  type="button"
                  onClick={() => setCalcDeliveryType("home")}
                  className={`rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    calcDeliveryType === "home"
                      ? "border-primary bg-primary text-background shadow-xs"
                      : "border-border bg-background text-text-muted hover:border-primary/40"
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>À domicile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcDeliveryType("desk")}
                  className={`rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    calcDeliveryType === "desk"
                      ? "border-primary bg-primary text-background shadow-xs"
                      : "border-border bg-background text-text-muted hover:border-primary/40"
                  }`}
                >
                  <span>Stop Desk</span>
                </button>
              </div>
            </div>
          </div>

          {/* Récapitulatif du calcul */}
          <div className="mt-5 p-4 rounded-2xl bg-background-muted border border-border space-y-2 text-sm">
            <div className="flex items-center justify-between text-text-muted">
              <span>Sous-total produits ({calcQuantity} pièce{calcQuantity > 1 ? "s" : ""}) :</span>
              <span className="font-bold text-text">
                {calcItemsTotal.toLocaleString("fr-FR")} DZD
              </span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Frais de livraison ({calcDeliveryType === "home" ? "À domicile" : "Stop Desk"}) :</span>
              <span className="font-bold text-text">
                {calcShippingFee.toLocaleString("fr-FR")} DZD
              </span>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="font-bold font-alexandria text-primary text-base">
                Montant calculé :
              </span>
              <span className="text-xl font-extrabold font-alexandria text-primary">
                {calcGrandTotal.toLocaleString("fr-FR")} DZD
              </span>
            </div>
          </div>

          {/* Actions : Ajouter ou Déduire */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60">
            <p className="text-xs text-text-muted flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <span>
                Vous pouvez ajouter ou déduire cette commande des compteurs en direct.
              </span>
            </p>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Bouton Diminuer / Déduire */}
              <button
                type="button"
                onClick={handleDecreaseOrder}
                disabled={isDeducting || (stats.totalOrders <= 0 && stats.totalRevenue <= 0)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red/30 bg-red/5 text-red hover:bg-red/10 active:scale-[0.98] font-bold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Déduire 1 commande et le montant calculé"
              >
                {isDeducting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Déduction...</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-4 h-4" />
                    <span>Déduire</span>
                  </>
                )}
              </button>

              {/* Bouton Ajouter */}
              <button
                type="button"
                onClick={handleSimulateOrder}
                disabled={isSimulating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-sm disabled:opacity-60"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : simulationSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ajouté avec succès !</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Carte Indicateurs de performance */}
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-background p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-base font-bold font-alexandria text-primary mb-1">
              Indicateurs de Performance
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Aperçu analytique rapide de votre activité
            </p>

            <div className="space-y-3">
              {/* Panier moyen */}
              <div className="p-3.5 rounded-xl bg-background-muted border border-border/80">
                <span className="text-xs text-text-muted block">
                  Panier moyen par commande
                </span>
                <span className="text-lg font-bold font-alexandria text-primary mt-0.5 block">
                  {stats.totalOrders > 0
                    ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString("fr-FR")
                    : 0}{" "}
                  DZD
                </span>
              </div>

              {/* Statut base de données */}
              <div className="p-3.5 rounded-xl bg-background-muted border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted block">
                    Base de données MongoDB
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Connectée &amp; Synchronisée
                  </span>
                </div>
                <div className="text-right text-xs text-text-muted">
                  <span>{stats.totalProducts} produits</span>
                  <span className="mx-1">•</span>
                  <span>{stats.totalCategories} catégories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Raccourcis rapides */}
          <div className="pt-5 mt-5 border-t border-border space-y-2">
            <span className="text-xs font-bold text-text-muted block">
              Raccourcis rapides
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/products"
                className="p-2.5 rounded-xl border border-border bg-background hover:bg-background-muted text-xs font-bold text-primary text-center transition-colors block"
              >
                Liste Produits
              </Link>
              <Link
                href="/dashboard/category"
                className="p-2.5 rounded-xl border border-border bg-background hover:bg-background-muted text-xs font-bold text-primary text-center transition-colors block"
              >
                Liste Catégories
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal de Déduction / Ajustement Manuel ── */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold font-alexandria text-primary">
                  Ajustement &amp; Déduction
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-primary hover:bg-border/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-text-muted mt-3 mb-5">
              Diminuez manuellement le nombre de commandes ou le chiffre d&apos;affaires selon vos besoins.
            </p>

            <form onSubmit={handleCustomDecrease} className="space-y-4">
              {/* Nombre de commandes à déduire */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary flex items-center justify-between">
                  <span>Nombre de commandes à déduire :</span>
                  <span className="text-text-muted font-normal text-[11px]">
                    Actuel : {stats.totalOrders}
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={stats.totalOrders}
                  value={adjustOrderCount}
                  onChange={(e) => setAdjustOrderCount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary font-bold text-primary"
                />
              </div>

              {/* Montant à déduire */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary flex items-center justify-between">
                  <span>Montant à déduire du chiffre d&apos;affaires (DZD) :</span>
                  <span className="text-text-muted font-normal text-[11px]">
                    Actuel : {stats.totalRevenue.toLocaleString("fr-FR")} DZD
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  max={stats.totalRevenue}
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary font-bold text-primary"
                />
              </div>

              {/* Boutons d'action du modal */}
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="w-full h-11 rounded-xl bg-red text-white hover:bg-red-hover active:scale-[0.98] font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isAdjusting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Déduction en cours...</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4" />
                      <span>Confirmer la déduction</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetOrders}
                    disabled={isAdjusting || (stats.totalOrders === 0 && stats.totalRevenue === 0)}
                    className="flex-1 h-9 rounded-xl border border-red/30 text-red hover:bg-red/5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser à 0</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdjustModalOpen(false)}
                    className="px-4 h-9 rounded-xl border border-border text-text-muted hover:bg-border/40 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}