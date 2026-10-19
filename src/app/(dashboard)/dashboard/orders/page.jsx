"use client"
import { useEffect ,useState } from "react";
import { OrdersTable } from "../components/OrdersTable";
import SectionTitle from "../components/SectionTitle";
import {Package} from "lucide-react"
import { toast } from "sonner";
import { PackagePlus ,RefreshCcw } from 'lucide-react'
import CustomSelect from "../components/CustomSelect"

export default function OrdersPage() {
const [error,setError] = useState(null)
const [loading,setLoading] = useState(false)
const [orders,setOrders] = useState([])
const [reload,setReload] = useState(false)
const [limit,setLimit] = useState("10")

  useEffect(() => {
    const controller = new AbortController();
    
    async function getOrders() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/orders?limit=${limit}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "فشل جلب الطرود");
        }

        const items = Array.isArray(data)
          ? data
          : data.items || data.data || [];
        toast.success("l'importation des colis est terminee")
        setOrders(items);
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(err.message || "حدث خطأ أثناء جلب الطرود");
        toast.error("Échec du chargement des colis");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getOrders();

    return () => controller.abort();
  }, [reload,limit]);


    return (
        <div className="h-full  w-full   " >

           <div>
            <div className="w-fit flex items-center justify-center  gap-2 " >
                <SectionTitle title="Gestion des Colis" />
                <Package strokeWidth={1.8} className="size-10 text-primary" />
            </div>
            <p className="text-text-muted text-sm" >Suivez l&apos;ensemble de vos commandes</p>
          </div>

      <div className="flex justify-between items-center w-full mt-5 ">

        <div className="flex justify-center items-center w-fit  gap-2 text-text-muted ">
         <p className="text-text-muted text-sm whitespace-nowrap font-bold  bg-border/30 border-1 border-border px-3 py-1.5 rounded-lg">Colis Actuels : <span className="ml-1">{orders.length}</span></p>
        <RefreshCcw onClick={() => setReload(!reload)} strokeWidth={1.75} className="border-border border-1 px-3 py-1.5 rounded-lg bg-border/30 h-full w-12 cursor-pointer hover:bg-border transition-all duration-200 z-30  " />
        <CustomSelect   label={"Afficher"} options={[10,20,50,100]} value={limit} onChange={setLimit} />
          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary text-background hover:bg-primary-hover active:scale-[0.98] text-sm font-bold transition-all duration-200 shadow-sm cursor-pointer">
          <PackagePlus strokeWidth={2} className="size-6" /><span className="hidden min-[460px]:block">Ajouter un Colis</span>
          </button>
    </div>
       
      </div>

        <OrdersTable orders={orders} reload={reload} setReload={setReload} limit={limit} setLimit={setLimit}/>
        </div>
    );
}