"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  PackagePlus,
  RefreshCw,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import defaultTarifs from "@/app/assets/tarifs_livraison_ecom_delivery.json";
import defaultCommunes from "@/app/assets/communes.json";



    



const INITIAL_FORM_STATE = {
  nom_complet: "",
  mobile_1: "",
  mobile_2: "",
  adresse: "",
  id_wilaya: 1, // Wilaya par défaut (Adrar)
  commune: "",
  code_stopdesk: "",
  stopdesk: 0, // 0 = Domicile, 1 = Stopdesk (Bureau)
  article: "",
  ref_article: "",
  echange: 0, // 0 = non, 1 = oui
  quantite: 1,
  note_fournisseur: "",
  total: "",
  id_externe: "",
  confirmee: 0,
};

export function NewColisForm({
  wilayas = null,
  communes = null,
  stopdesks = null,
  tarifs = null,
  fetchCommunes = null,
  fetchStopdesks = null,
  defaultHasStock = false,
  onSubmit = null,
  onSuccess = null,
  onCancel = null,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [hasStockAccount, setHasStockAccount] = useState(defaultHasStock);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Données E-com Delivery
  const [wilayasList, setWilayasList] = useState([]);
  const [isLoadingWilayas, setIsLoadingWilayas] = useState(false);

  const [tarifsData, setTarifsData] = useState(tarifs);
  const [isLoadingTarifs, setIsLoadingTarifs] = useState(false);

  const [asyncCommunes, setAsyncCommunes] = useState([]);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);

  const [asyncStopdesks, setAsyncStopdesks] = useState([]);
  const [isLoadingStopdesks, setIsLoadingStopdesks] = useState(false);

  // 1. Récupération des wilayas depuis /api/ecom/wilayas
  useEffect(() => {
    async function getWilayas() {
      setIsLoadingWilayas(true);
      try {
        const response = await fetch("/api/ecom/wilayas");
        if (!response.ok) throw new Error("Failed to fetch wilayas");
        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.wilayas || [];
        setWilayasList(list);

        if (list.length > 0) {
          setFormData((prev) => {
            const exists = list.some((w) => Number(w.id) === Number(prev.id_wilaya));
            if (!exists) {
              return { ...prev, id_wilaya: list[0].id };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des wilayas:", error);
      } finally {
        setIsLoadingWilayas(false);
      }
    }
    getWilayas();
  }, []);

  // 2. Récupération des tarifs depuis /api/ecom/tarifs
  useEffect(() => {
    async function getTarifs() {
      setIsLoadingTarifs(true);
      try {
        const response = await fetch("/api/ecom/tarifs");
        if (!response.ok) throw new Error("Failed to fetch tarifs");
        const data = await response.json();
        setTarifsData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tarifs:", error);
      } finally {
        setIsLoadingTarifs(false);
      }
    }
    getTarifs();
  }, []);

  // 3. Récupération des communes depuis /api/ecom/communes?id_wilaya=X
  useEffect(() => {
    let isMounted = true;

    async function getCommunes() {
      if (!formData.id_wilaya) {
        if (isMounted) setAsyncCommunes([]);
        return;
      }

      setIsLoadingCommunes(true);
      try {
        if (typeof fetchCommunes === "function") {
          const data = await fetchCommunes(formData.id_wilaya);
          if (isMounted) setAsyncCommunes(Array.isArray(data) ? data : []);
        } else {
          const res = await fetch(`/api/ecom/communes?id_wilaya=${formData.id_wilaya}`);
          if (!res.ok) throw new Error("Failed to fetch communes");
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.communes || [];
          if (isMounted) {
            setAsyncCommunes(list);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des communes:", error);
        if (isMounted) {
          const fallback = defaultCommunes?.[String(formData.id_wilaya)] || [];
          setAsyncCommunes(
            fallback.map((name, idx) => ({
              id: idx,
              id_wilaya: formData.id_wilaya,
              commune: name,
              livrable: true,
            }))
          );
        }
      } finally {
        if (isMounted) setIsLoadingCommunes(false);
      }
    }

    getCommunes();

    return () => {
      isMounted = false;
    };
  }, [formData.id_wilaya, fetchCommunes]);

  // 4. Récupération des stopdesks depuis /api/ecom/stopdesk?id_wilaya=X
  useEffect(() => {
    let isMounted = true;

    async function getStopdesks() {
      if (!formData.id_wilaya) {
        if (isMounted) setAsyncStopdesks([]);
        return;
      }

      setIsLoadingStopdesks(true);
      try {
        if (typeof fetchStopdesks === "function") {
          const data = await fetchStopdesks(formData.id_wilaya);
          if (isMounted) setAsyncStopdesks(Array.isArray(data) ? data : []);
         
        } else {
          const res = await fetch(`/api/ecom/stopdesk?id_wilaya=${formData.id_wilaya}`);
          if (!res.ok) throw new Error("Failed to fetch stopdesks");
          const data = await res.json();
          
          const raw = Array.isArray(data) ? data : data?.stopdesks || [];
          const list = raw.map((item) => ({
            code: item.code_stopdesk || item.code || item.id || "",
            name: item.nom_bureau || item.nom_stopdesk || item.nom || item.name || "",
          }));

          if (isMounted) {
            setAsyncStopdesks(list);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stopdesks:", error);
      } finally {
        if (isMounted) setIsLoadingStopdesks(false);
        
      }
    }

    getStopdesks();

    return () => {
      isMounted = false;
    };
  }, [formData.id_wilaya, fetchStopdesks]);

  // Listes actives
  const activeWilayas = useMemo(() => {
    if (Array.isArray(wilayas) && wilayas.length > 0) return wilayas;
    return wilayasList;
  }, [wilayas, wilayasList]);

  const activeCommunes = useMemo(() => {
    if (Array.isArray(communes) && communes.length > 0) return communes;
    return asyncCommunes;
  }, [communes, asyncCommunes]);

  const activeStopdesks = useMemo(() => {
    if (Array.isArray(stopdesks) && stopdesks.length > 0) return stopdesks;
    return asyncStopdesks;
  }, [stopdesks, asyncStopdesks]);

  const currentWilaya = useMemo(() => {
    return activeWilayas.find((w) => Number(w.id) === Number(formData.id_wilaya));
  }, [activeWilayas, formData.id_wilaya]);

  // Calcul du tarif appliqué
  const tarifInfo = useMemo(() => {
    const wilayasTarifs = Array.isArray(tarifsData)
      ? tarifsData
      : tarifsData?.wilayas || tarifsData?.tarifs || [];
    const matched = wilayasTarifs.find(
      (t) => Number(t.wilaya ?? t.id_wilaya ?? t.code ?? t.id) === Number(formData.id_wilaya)
    );

    const isStopdesk = Number(formData.stopdesk) === 1;

    if (matched) {
      const livre = isStopdesk ? (matched.stopdesk ?? matched.stop_desk ?? 0) : (matched.domicile ?? 0);
      const annule = matched.annuler ?? matched.retour ?? 0;
      return { livre, annule };
    }

    // Secours via fichier JSON local
    const defaultMatched = defaultTarifs?.tarifs?.find(
      (t) => Number(t.code) === Number(formData.id_wilaya)
    );
    if (defaultMatched) {
      const livre = isStopdesk ? (defaultMatched.stop_desk ?? 0) : (defaultMatched.domicile ?? 0);
      const annule = defaultMatched.retour ?? 0;
      return { livre, annule };
    }

    return { livre: 0, annule: 0 };
  }, [tarifsData, formData.id_wilaya, formData.stopdesk]);









  // Gestion des changements
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    const nom = (formData.nom_complet || "").trim();
    if (!nom) {
      newErrors.nom_complet = "Nom du destinataire obligatoire";
    } else if (nom.length > 60) {
      newErrors.nom_complet = "60 caractères maximum";
    }

    const m1 = (formData.mobile_1 || "").trim();
    if (!m1) {
      newErrors.mobile_1 = "Numéro de téléphone obligatoire";
    } else if (m1.length > 25) {
      newErrors.mobile_1 = "25 caractères maximum";
    } else if (!/^[0-9+ \-.]{8,25}$/.test(m1)) {
      newErrors.mobile_1 = "Format invalide (ex: 0550123456)";
    }

    const m2 = (formData.mobile_2 || "").trim();
    if (m2 && m2.length > 25) {
      newErrors.mobile_2 = "25 caractères maximum";
    }

    const wilayaNum = parseInt(formData.id_wilaya, 10);
    if (!formData.id_wilaya || isNaN(wilayaNum) || wilayaNum < 1 || wilayaNum > 58) {
      newErrors.id_wilaya = "Wilaya invalide (1 - 58)";
    }

    if (formData.stopdesk === 0) {
      const com = (formData.commune || "").trim();
      if (!com) {
        newErrors.commune = "Commune obligatoire pour la livraison à domicile";
      } else if (com.length > 50) {
        newErrors.commune = "50 caractères maximum";
      }
    } else {
      const sdCode = (formData.code_stopdesk || "").trim();
      if (!sdCode) {
        newErrors.code_stopdesk = "Code stopdesk obligatoire";
      } else if (sdCode.length > 10) {
        newErrors.code_stopdesk = "10 caractères maximum (ex: 16B)";
      }
    }

    if (hasStockAccount) {
      const ref = (formData.ref_article || "").trim();
      if (!ref) {
        newErrors.ref_article = "Référence obligatoire pour compte avec stock";
      } else if (ref.length > 64) {
        newErrors.ref_article = "64 caractères maximum";
      }
    } else {
      const art = (formData.article || "").trim();
      if (!art) {
        newErrors.article = "Désignation de l'article obligatoire";
      } else if (art.length > 255) {
        newErrors.article = "255 caractères maximum";
      }
    }

    const adr = (formData.adresse || "").trim();
    if (adr && adr.length > 100) {
      newErrors.adresse = "100 caractères maximum";
    }

    const qty = parseInt(formData.quantite, 10);
    if (isNaN(qty) || qty < 1) {
      newErrors.quantite = "Quantité minimale : 1";
    }

    const tot = formData.total === "" ? 0 : Number(formData.total);
    if (isNaN(tot) || tot < 0 || tot > 150000) {
      newErrors.total = "Montant entre 0 et 150 000 DA";
    }

    const note = (formData.note_fournisseur || "").trim();
    if (note && note.length > 255) {
      newErrors.note_fournisseur = "255 caractères maximum";
    }

    const idExt = (formData.id_externe || "").trim();
    if (idExt && idExt.length > 20) {
      newErrors.id_externe = "20 caractères maximum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!validateForm()) {
      toast.error("Veuillez remplir correctement les champs obligatoires");
      return;
    }

    const isStopdesk = formData.stopdesk ? 1 : 0;
    const payload = {
      nom_complet: formData.nom_complet.trim(),
      mobile_1: formData.mobile_1.trim(),
      id_wilaya: parseInt(formData.id_wilaya, 10),
      quantite: parseInt(formData.quantite, 10) || 1,
      total: formData.total === "" ? 0 : Number(formData.total),
      stopdesk: isStopdesk,
      echange: formData.echange ? 1 : 0,
      confirmee: formData.confirmee ? 1 : 0,
    };

    if (isStopdesk === 1) {
      payload.code_stopdesk = formData.code_stopdesk.trim();
    } else {
      payload.commune = formData.commune.trim();
    }

    if (hasStockAccount) {
      if (formData.ref_article.trim()) {
        payload.ref_article = formData.ref_article.trim();
      }
    } else {
      if (formData.article.trim()) {
        payload.article = formData.article.trim();
      }
    }

    if (formData.mobile_2?.trim()) payload.mobile_2 = formData.mobile_2.trim();
    if (formData.adresse?.trim()) payload.adresse = formData.adresse.trim();
    if (formData.note_fournisseur?.trim()) payload.note_fournisseur = formData.note_fournisseur.trim();
    if (formData.id_externe?.trim()) payload.id_externe = formData.id_externe.trim();

    setIsSubmitting(true);

    try {
      if (typeof onSubmit === "function") {
        const res = await onSubmit(payload);
        if (res === false) return;
      } else {
        const response = await fetch("/api/ecom/addColis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          let errText = "Échec de l'enregistrement du colis";
          if (typeof result.error === "string") {
            errText = result.error;
          } else if (result.error && typeof result.error.message === "string") {
            if (Array.isArray(result.error.details) && result.error.details.length > 0) {
              const detailsStr = result.error.details
                .map((d) => (d.champ && d.raison ? `${d.champ}: ${d.raison}` : typeof d === "string" ? d : JSON.stringify(d)))
                .join("; ");
              errText = `${result.error.message} (${detailsStr})`;
            } else {
              errText = result.error.message;
            }
          } else if (typeof result.message === "string") {
            errText = result.message;
          }
          throw new Error(errText);
        }
      }

      toast.success("Colis créé avec succès !");
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      onSuccess?.(payload);
    } catch (err) {
      console.error("Erreur création colis:", err);
      toast.error(err?.message || "Échec de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} dir="ltr" className="w-full text-gray-800 space-y-4">
      {/* Client */}
      <div>
        <label className="block text-sm font-inter text-gray-700 mb-1.5">
          Client
        </label>
        <input
          type="text"
          value={formData.nom_complet}
          maxLength={60}
          onChange={(e) => handleChange("nom_complet", e.target.value)}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm outline-none transition-colors ${
            errors.nom_complet
              ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
              : "border-gray-200 focus:border-gray-400"
          }`}
        />
        {errors.nom_complet && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="size-3" /> {errors.nom_complet}
          </p>
        )}
      </div>

      {/* Numéro de téléphone */}
      <div>
        <label className="block text-sm font-inter text-gray-700 mb-1.5">
          Numéro de téléphone
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              type="tel"
              placeholder="Mobile 1"
              value={formData.mobile_1}
              maxLength={25}
              onChange={(e) => handleChange("mobile_1", e.target.value)}
              className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm outline-none transition-colors placeholder:text-gray-400 ${
                errors.mobile_1
                  ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                  : "border-gray-200 focus:border-gray-400"
              }`}
            />
            {errors.mobile_1 && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.mobile_1}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Mobile 2 (optionnel)"
              value={formData.mobile_2}
              maxLength={25}
              onChange={(e) => handleChange("mobile_2", e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
            />
            {errors.mobile_2 && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.mobile_2}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-inter text-gray-700 mb-1.5">
          Adresse
        </label>
        <input
          type="text"
          value={formData.adresse}
          maxLength={100}
          onChange={(e) => handleChange("adresse", e.target.value)}
          className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-gray-400 transition-colors"
        />
        {errors.adresse && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="size-3" /> {errors.adresse}
          </p>
        )}
      </div>

      {/* Wilaya */}
      <div>
        <label className="block text-sm font-inter text-gray-700 mb-1.5">
          Wilaya
        </label>
        <div className="relative">
          <select
            value={formData.id_wilaya}
            disabled={isLoadingWilayas && activeWilayas.length === 0}
            onChange={(e) => {
              const wCode = parseInt(e.target.value, 10);
              handleChange("id_wilaya", wCode);

              // Réinitialiser la commune ou stopdesk
              handleChange("commune", "");
              handleChange("code_stopdesk", "");

              // Adapter le type de livraison si le type sélectionné n'est pas disponible pour cette wilaya
              const nextW = activeWilayas.find((w) => Number(w.id) === wCode);
              if (nextW) {
                if (nextW.domicile === false && nextW.stopdesk === true) {
                  handleChange("stopdesk", 1);
                } else if (nextW.stopdesk === false && nextW.domicile === true) {
                  handleChange("stopdesk", 0);
                }
              }
            }}
            className="w-full h-11 px-3.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-gray-400 transition-colors cursor-pointer appearance-none text-gray-800 disabled:opacity-60"
          >
            {activeWilayas.length === 0 && (
              <option value="">Chargement des wilayas...</option>
            )}
            {activeWilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} - {w.libelle}
              </option>
            ))}
          </select>
          {isLoadingWilayas ? (
            <RefreshCw className="size-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none animate-spin" />
          ) : (
            <ChevronDown className="size-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
          )}
        </div>
        {errors.id_wilaya && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="size-3" /> {errors.id_wilaya}
          </p>
        )}
      </div>

      {/* Radios Domicile / Stopdesk */}
      <div className="flex items-center gap-8 pt-1 pb-1">
        <label
          className={`inline-flex items-center gap-2 text-sm font-inter ${
            currentWilaya && currentWilaya.domicile === false
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer text-gray-700"
          }`}
        >
          <input
            type="radio"
            name="delivery_type"
            checked={formData.stopdesk === 0}
            disabled={currentWilaya && currentWilaya.domicile === false}
            onChange={() => {
              handleChange("stopdesk", 0);
              handleChange("code_stopdesk", "");
            }}
            className="size-4 text-blue-600 accent-blue-600 cursor-pointer"
          />
          <span>Domicile</span>
        </label>

        <label
          className={`inline-flex items-center gap-2 text-sm font-inter ${
            currentWilaya && currentWilaya.stopdesk === false
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer text-gray-700"
          }`}
        >
          <input
            type="radio"
            name="delivery_type"
            checked={formData.stopdesk === 1}
            disabled={currentWilaya && currentWilaya.stopdesk === false}
            onChange={() => {
              handleChange("stopdesk", 1);
              handleChange("commune", "");
            }}
            className="size-4 text-blue-600 accent-blue-600 cursor-pointer"
          />
          <span>Stopdesk (Bureau)</span>
        </label>
      </div>

      {/* Commune ou Stopdesk (Bureau) selon la sélection */}
      {formData.stopdesk === 0 ? (
        <div>
          <label className="block text-sm font-inter text-gray-700 mb-1.5">
            Commune
          </label>
          <div className="relative">
            {activeCommunes.length > 0 ? (
              <>
                <input
                  type="text"
                  list="communes-options"
                  value={formData.commune}
                  maxLength={50}
                  onChange={(e) => handleChange("commune", e.target.value)}
                  placeholder={isLoadingCommunes ? "Chargement des communes..." : "Sélectionner ou saisir la commune..."}
                  className={`w-full h-11 px-3.5 pr-10 rounded-xl border bg-white text-sm outline-none transition-colors ${
                    errors.commune
                      ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                      : "border-gray-200 focus:border-gray-400"
                  }`}
                />
                <datalist id="communes-options">
                  {activeCommunes.map((c, i) => {
                    const val = typeof c === "string" ? c : c.commune || c.nom || c.name || "";
                    return (
                      <option key={c.id ?? i} value={val}>
                        {val} {c.code_postal ? `(${c.code_postal})` : ""}
                      </option>
                    );
                  })}
                </datalist>
              </>
            ) : (
              <input
                type="text"
                value={formData.commune}
                maxLength={50}
                onChange={(e) => handleChange("commune", e.target.value)}
                placeholder={isLoadingCommunes ? "Chargement des communes..." : "Sélectionner ou saisir la commune..."}
                className={`w-full h-11 px-3.5 pr-10 rounded-xl border bg-white text-sm outline-none transition-colors ${
                  errors.commune
                    ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                    : "border-gray-200 focus:border-gray-400"
                }`}
              />
            )}
            {isLoadingCommunes ? (
              <RefreshCw className="size-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none animate-spin" />
            ) : (
              <ChevronDown className="size-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            )}
          </div>
          {errors.commune && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="size-3" /> {errors.commune}
            </p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-inter text-gray-700 mb-1.5">
            Stopdesk (Bureau)
          </label>
          <div className="relative">
            {isLoadingStopdesks ? (
              <div className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm flex items-center text-gray-400 gap-2">
                <RefreshCw className="size-4 animate-spin text-gray-400" />
                <span>Chargement des agences...</span>
              </div>
            ) : activeStopdesks.length > 0 ? (
              <select
                value={formData.code_stopdesk}
                onChange={(e) => handleChange("code_stopdesk", e.target.value)}
                className={`w-full h-11 px-3.5 pr-10 rounded-xl border bg-white text-sm outline-none transition-colors cursor-pointer appearance-none text-gray-800 ${
                  errors.code_stopdesk
                    ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                    : "border-gray-200 focus:border-gray-400"
                }`}
              >
                <option value="">Sélectionner une agence...</option>
                {activeStopdesks.map((sd, i) => {
                  const code = sd.code || sd.code_stopdesk || sd.id || "";
                  const name = sd.name || sd.nom_bureau || sd.nom_stopdesk || sd.nom || code;
                  return (
                    <option key={code || i} value={code}>
                      {name}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                type="text"
                maxLength={10}
                value={formData.code_stopdesk}
                placeholder="Code Stopdesk (ex: 16B)"
                onChange={(e) => handleChange("code_stopdesk", e.target.value.toUpperCase())}
                className={`w-full h-11 px-3.5 pr-10 rounded-xl border bg-white text-sm uppercase tracking-wider outline-none transition-colors ${
                  errors.code_stopdesk
                    ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                    : "border-gray-200 focus:border-gray-400"
                }`}
              />
            )}
            {!isLoadingStopdesks && (
              <ChevronDown className="size-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            )}
          </div>
          {errors.code_stopdesk && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="size-3" /> {errors.code_stopdesk}
            </p>
          )}
        </div>
      )}

      {/* Article & Quantité */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-4">
              <label className="text-sm font-inter text-gray-700">Article</label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-sm font-normal text-gray-600">
                <input
                  type="checkbox"
                  checked={formData.echange === 1}
                  onChange={(e) => handleChange("echange", e.target.checked ? 1 : 0)}
                  className="size-4 rounded border-gray-300 text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>Avec Échange</span>
              </label>
            </div>

            {/* Bouton discret pour basculer vers compte stock si nécessaire */}
            <button
              type="button"
              onClick={() => setHasStockAccount(!hasStockAccount)}
              className="text-[11px] text-gray-400 hover:text-gray-600 underline"
            >
              {hasStockAccount ? "Saisie libre" : "Réf stock"}
            </button>
          </div>

          <input
            type="text"
            value={hasStockAccount ? formData.ref_article : formData.article}
            maxLength={hasStockAccount ? 64 : 255}
            placeholder={hasStockAccount ? "Réf produit en stock" : ""}
            onChange={(e) =>
              handleChange(hasStockAccount ? "ref_article" : "article", e.target.value)
            }
            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm outline-none transition-colors ${
              (hasStockAccount ? errors.ref_article : errors.article)
                ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                : "border-gray-200 focus:border-gray-400"
            }`}
          />
          {(hasStockAccount ? errors.ref_article : errors.article) && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="size-3" />{" "}
              {hasStockAccount ? errors.ref_article : errors.article}
            </p>
          )}
        </div>

        <div className="sm:col-span-1">
          <label className="block text-sm font-inter text-gray-700 mb-1.5">
            Quantité
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantite}
            onChange={(e) =>
              handleChange("quantite", Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            className={`w-full h-11 px-3 rounded-xl border bg-white text-sm outline-none transition-colors text-center font-inter ${
              errors.quantite
                ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                : "border-gray-200 focus:border-gray-400"
            }`}
          />
          {errors.quantite && (
            <p className="text-red-500 text-xs mt-1">{errors.quantite}</p>
          )}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-inter text-gray-700 mb-1.5">
          Note
        </label>
        <textarea
          rows={3}
          value={formData.note_fournisseur}
          maxLength={255}
          onChange={(e) => handleChange("note_fournisseur", e.target.value)}
          className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-gray-400 transition-colors resize-none"
        />
        {errors.note_fournisseur && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="size-3" /> {errors.note_fournisseur}
          </p>
        )}
      </div>

      {/* Tarif Appliqué */}
      <div>
        <label className="block text-sm font-inter text-gray-700 mb-1.5">
          Tarif Appliqué
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#EAF7EE] text-[#0E7A3E] border border-[#D1F0DA] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-inter">Si Livré</span>
            <span className="text-sm font-bold">
              {tarifInfo.livre.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Da
            </span>
          </div>
          <div className="bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-inter">Si Annulé</span>
            <span className="text-sm font-bold">
              {tarifInfo.annule.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Da
            </span>
          </div>
        </div>
      </div>

      {/* Total à ramasser (Da) */}
      <div>
        <label className="block text-sm font-inter text-gray-700 mb-1.5">
          Total à ramasser (Da)
        </label>
        <input
          type="number"
          min="0"
          max="150000"
          value={formData.total}
          placeholder="0"
          onChange={(e) => handleChange("total", e.target.value)}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm outline-none transition-colors ${
            errors.total
              ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
              : "border-gray-200 focus:border-gray-400"
          }`}
        />
        {tarifInfo.livre > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Plancher si montant à encaisser : minimum {tarifInfo.livre} DA (tarif livraison wilaya)
          </p>
        )}
        {errors.total && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="size-3" /> {errors.total}
          </p>
        )}
      </div>



      {/* Bouton Valider */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00A650] hover:bg-[#008f45] active:scale-[0.99] text-white font-semibold text-base py-3.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              <span>Validation en cours...</span>
            </>
          ) : (
            <span>Valider</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default function NewColis({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger = null,
  wilayas = null,
  communes = null,
  stopdesks = null,
  tarifs = null,
  fetchCommunes = null,
  fetchStopdesks = null,
  onSubmit = null,
  onSuccess = null,
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const handleOpenChange = (newVal) => {
    if (isControlled) {
      setControlledOpen?.(newVal);
    } else {
      setInternalOpen(newVal);
    }
  };

  const handleSuccess = (payload) => {
    handleOpenChange(false);
    onSuccess?.(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary text-background hover:bg-primary-hover active:scale-[0.98] text-sm font-bold transition-all duration-200 shadow-sm cursor-pointer">
            <PackagePlus strokeWidth={2} className="size-5" />
            <span className="hidden min-[460px]:block">Ajouter un Colis</span>
          </button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-100 p-6 max-h-[92vh] overflow-y-auto">
       
        <DialogHeader className="pb-3 ">
          <div className="flex items-center justify-center gap-2">
            <PlusCircle className="size-6 text-primary stroke-[2.2]" />
            <DialogTitle className="text-xl font-bold text-primary">
              Nouveau Colis
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Formulaire de création d&apos;un nouveau colis
          </DialogDescription>
        </DialogHeader>

        <NewColisForm
          wilayas={wilayas}
          communes={communes}
          stopdesks={stopdesks}
          tarifs={tarifs}
          fetchCommunes={fetchCommunes}
          fetchStopdesks={fetchStopdesks}
          onSubmit={onSubmit}
          onSuccess={handleSuccess}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
