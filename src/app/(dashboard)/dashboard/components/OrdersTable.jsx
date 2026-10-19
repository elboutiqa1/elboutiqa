"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {Copy , RotateCcwClock , Printer ,RefreshCcw } from 'lucide-react'
import {toast} from "sonner"
import CustomSelect from "./CustomSelect"
import ImpressionType from "./ImpressionType"

import {useEffect ,useState} from 'react'

const tableHeadItems = [
  "Tracking",
  "Avancement",
  "Situation",
  "Client",
  "Wilaya / Commune",
  "Article",
  "Note",
  "Total",
  "Actions"
]




const situationLibelle = (situationId) => {
  switch (situationId) {
    case 1:
      // EnCours - Colis créé / en cours
      return "bg-text-muted"
    case 2:
      // Ne Réponde pas #1 - 1ère tentative
      return "bg-amber-500"
    case 3:
      // Ne Réponde pas #2 - 2ème tentative
      return "bg-orange-500"
    case 4:
      // Ne Réponde pas #3 - 3ème tentative
      return "bg-rose-500"
    case 5:
      // Annuler - Commande annulée
      return "bg-red"
    case 6:
      // Annuler x3 - Annulée après 3 tentatives
      return "bg-red-700"
    case 7:
      // Livrée - Colis livré avec succès
      return "bg-whatsapp"
    case 8:
      // En attente du client
      return "bg-yellow-600"
    case 9:
      // Reporté
      return "bg-indigo-500"
    case 10:
      // Reporté Commune Erronée
      return "bg-purple-600"
    case 11:
      // Reporté Wilaya Erronée
      return "bg-purple-800"
    case 12:
      // BIZ - Colis d'échange
      return "bg-teal-600"
    case 13:
      // Appel Tel
      return "bg-sky-500"
    case 14:
      // Encaisser
      return "bg-emerald-600"
    case 15:
      // Recouvert
      return "bg-emerald-800"
    case 16:
      // SMS Envoyé
      return "bg-sky-600"
    case 17:
      // Attend Confirmation
      return "bg-amber-600"
    case 18:
      // Commande Annuler
      return "bg-red"
    case 19:
      // Commande Confirmée
      return "bg-whatsapp"
    case 20:
      // Commande Reporté
      return "bg-orange-400"
    case 21:
      // Commande a Relancé
      return "bg-violet-600"
    case 22:
      // WhatsApp OK
      return "bg-whatsapp"
    case 23:
      // Retour de Dispatche
      return "bg-rose-700"
    case 24:
      // Retour Navette
      return "bg-zinc-600"
    case 25:
      // Au Bureau
      return "bg-primary"
    case 26:
      // Sortir en livraison
      return "bg-facebook"
    case 27:
      // Dispatcher
      return "bg-blue-600"
    case 28:
      // Suivi par E-com
      return "bg-fuchsia-600"
    default:
      return "bg-text-muted"
  }
}

const avancementLibelle = (avancementId) => {
  switch(avancementId){

case 1:
  return "bg-purple-800"
case 3:
  return "bg-primary"
case 5:
  return "bg-blue-600"
case 8:
  return "bg-whatsapp"

    default:
      return "bg-text-muted"
  }
}
  






export function OrdersTable({orders,reload,setReload,limit,setLimit}) {
  const [printingTracking, setPrintingTracking] = useState(null);


  async function handlePrint(tracking,format) {
    if (!tracking || printingTracking) return;
    setPrintingTracking(tracking);
    const toastId = toast.loading("Génération du bordereau...");

    try {
      const res = await fetch(
        `/api/orders/impression?tracking=${encodeURIComponent(tracking)}&format=${encodeURIComponent(format || "10x10")}`,
        {
          cache: "no-store",
        }
      );

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, "_blank");
        toast.success("Bordereau prêt pour l'impression", { id: toastId });
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Échec de l'impression du bordereau");
      }

      const url = data.url || data.bordereau || data.link || data.pdf_url;
      if (url) {
        window.open(url, "_blank");
        toast.success("Bordereau ouvert avec succès", { id: toastId });
      } else {
        toast.success("Opération effectuée avec succès", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Échec du chargement du bordereau", { id: toastId });
    } finally {
      setPrintingTracking(null);
    }
  };


  return (
    <div className="w-full h-full relative overflow-x-scroll">

      <div className="flex justify-center items-center w-fit absolute top-2 left-0 gap-2 text-text-muted ">
            <p className="text-text-muted text-sm font-bold  bg-border/30 border-1 border-border px-3 py-1.5 rounded-lg">Colis Actuels : <span className="ml-2">{orders.length}</span></p>
        <RefreshCcw onClick={() => setReload(!reload)} strokeWidth={1.75} className="border-border border-1 px-3 py-1.5 rounded-lg bg-border/30 h-full w-12 cursor-pointer hover:bg-border transition-all duration-200 z-40  " />
        <CustomSelect   label={"Afficher"} options={[10,20,50,100]} value={limit} onChange={setLimit} />
      </div>

     

    <Table className=" bg-background  border-1 border-border mt-13">
        {/*count of colis*/}

      <TableHeader className="w-full bg-border/30 ">
         
        <TableRow className="">

          {tableHeadItems.map((item) => (
            <TableHead className="text-text-muted font-inter text-md" key={item}>{item}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((item) => (
          <TableRow className="hover:bg-border/30"  key={item.tracking}>

            
           <TableCell onClick={() => navigator.clipboard.writeText(item.tracking).then(() => toast.success("Order tracking copied successfully"))} className="flex flex-col items-center justify-center" >
            <div className="flex items-center  justify-start gap-2">{item.tracking}<Copy className="size-4 cursor-pointer hover:text-text transition-all duration-200 text-text-muted/50" /></div>
            <span className="text-xs text-text-muted">{item.date_creation?.split(" ")[0]}</span>
            </TableCell>
              
            
            
            <TableCell><span className={`${avancementLibelle(item.id_etat_logistique)} text-xs font-bold text-background py-1 px-2 rounded-lg`}>{item.etat_logistique}</span></TableCell>
            <TableCell><span className={`${situationLibelle(item.id_situation)} text-xs font-bold text-background py-1 px-2 rounded-lg`}>{item.situation}</span></TableCell>
            <TableCell className="flex flex-col" ><p className="font-cairo font-semibold">{item.nom_complet} </p><span className="text-text-muted text-xs font-cairo">{item.mobile}</span></TableCell>
            
            <TableCell  >
           <div className="flex justify-start items-center  w-full h-full gap-2" >
              <span className="rounded-lg bg-border py-1 px-2 text-primary text-md">{item.id_wilaya }</span>

            <div className="flex flex-col items-start ">
            <span className="text-md font-semibold font-cairo">{item.commune}</span>
            <div className="flex justify-center items-center gap-1">
              {item.stopdesk===1 && <span className="text-xs font-semibold text-background py-0.5 px-1 rounded-lg bg-primary">SD</span>}
             <span className="text-text-muted text-xs font-cairo">{item.commune}</span>
            </div>
            
              </div>
           </div>


              </TableCell>
            <TableCell className="max-w-[200px]  w-fit overflow-x-scroll  " ><span className="rounded-lg  bg-primary py-1 px-2 text-background text-xs mr-1 ">x{item.quantite}</span> <span className="text-md  font-cairo ">{item.article}</span></TableCell>


            <TableCell className=" max-w-[100px] text-center text-text-muted overflow-x-scroll">{item.note_fournisseur ===null ?"-":
               <span  className="text-sm font-cairo  ">{item.note_fournisseur}</span>
            }
            </TableCell>

            <TableCell className="text-center font-cairo text-text font-semibold text-md "><span className="">{item.total}</span></TableCell>


            <TableCell>
              <div className="flex items-center justify-start gap-3 w-full h-full " >
              <RotateCcwClock strokeWidth={1.5} className="p-1 size-8 text-text-muted hover:text-text transition-all duration-200 border-1 rounded-lg border-border cursor-pointer" />
               <ImpressionType tracking={item.tracking} handlePrint={handlePrint} />
              </div>
             
            </TableCell>
           
        



          </TableRow>

         
        ))}
      </TableBody>
    </Table>


    </div>
  )
}
