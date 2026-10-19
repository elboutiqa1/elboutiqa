"use client"
import { useEffect ,useState } from "react";
import { OrdersTable } from "../components/OrdersTable";
import SectionTitle from "../components/SectionTitle";
import {Package} from "lucide-react"
import { toast } from "sonner";



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

          <OrdersTable orders={orders} reload={reload} setReload={setReload} limit={limit} setLimit={setLimit}/>
        </div>
    );
}