"use client";

import { useState ,useEffect } from "react";
import { importPixel, testPixelConnection, getPixel} from "./importPixel";
import SectionTitle from "../components/SectionTitle";
import { ShieldCheck , ShieldX , Cable ,Import } from "lucide-react"
import { toast } from "sonner"


export default function MetaPixelPage() {
 const [pixelId, setPixelId] = useState("");
 const [accessToken, setAccessToken] = useState("");
 const [isActive, setIsActive] = useState(true);
 const [isSaving, setIsSaving] = useState(false);

useEffect(() => {
  async function loadPixel() {
    const data = await getPixel();
    if (data.success && data.pixelId) {
      setPixelId(data.pixelId);

      if(data.pixelId.length<15){
        setIsActive(false);
      }else{
        setIsActive(true);
      }
    }
  }
  loadPixel();
}, [isSaving]);

async function handleSubmit(e) {
  e.preventDefault();
if(pixelId.length==0){
  toast.error("Veuillez entrer votre Meta Pixel")
  return;
}


  setIsSaving(true);


  const formData = new FormData();
  formData.append("pixelId", pixelId);
  formData.append("isActive", String(isActive));
 

  const result = await importPixel(formData);
  if(result.success === true){
    toast.success(result.message);
  }else{
    toast.error(result.message);
  }
  setIsSaving(false);

}



const [isTesting, setIsTesting] = useState(false);

const testConnection = async () => {
  if (!pixelId) {
    toast.error("Veuillez entrer votre Meta Pixel.");
    return;
  }

  setIsTesting(true);

  const result = await testPixelConnection(pixelId,accessToken);

  if(result.success === true){
    toast.success(result.message);
  }else{
    toast.error(result.message);
  }

  setIsTesting(false);
};


    return (
        <div className=" h-full w-full ">
            <SectionTitle title="Meta Pixel Configuration" />


            {/*pixel section */}
            <form  onSubmit={handleSubmit} className="flex flex-col  items-center justify-center  w-[90%] max-w-[600px] mx-auto mt-20  rounded-xl border-border border-2 p-5
            shadow-lg
            ">
          {/*headers*/}
            <div className="flex items-center justify-center relative w-full">
                <h1 className="text-xl font-bold text-primary text-center mb-5">Meta Pixel ID</h1>
                {/*meta status*/}

               {isActive? <div className="absolute top-0 right-0  text-whatsapp flex justify-center items-center gap-1">
                <ShieldCheck strokeWidth={2} />
                <span>active</span>
                </div> : <div className="absolute top-0 right-0  text-red flex justify-center items-center gap-1">
                    <ShieldX  strokeWidth={2} />
                    <span>inactive</span>
                </div>}
            </div>

            {/*input field for meta pixel id*/}
        <div className="w-full flex flex-col items-start justify-start gap-4 ">

            <div className="flex flex-col items-start gap-2  w-full">
                <label htmlFor="metaPixelId" className="text-text text-md font-semibold">Meta Pixel ID</label>
            <input type="text"  value={pixelId} onChange={(e) => setPixelId(e.target.value)} id="metaPixelId" placeholder="entrer votre meta pixel id"  className="w-full p-2 border-2 border-border rounded-xl text-text text-lg outline-0"/>

            <p className="text-xs text-muted-foreground mt-1">   
                <a href="https://fr-fr.facebook.com/business/help/952192354843755?id=1205376682832142" target="_blank" rel="noopener noreferrer" className="text-whatsapp hover:text-whatsapp/80 transition-colors cursor-pointer underline underline-offset-4">Comment trouver mon meta pixel id?</a>
            </p>
            </div>
            

            <div className="flex flex-col items-start gap-2 w-full">
                <label htmlFor="metaAccessToken" className="text-text text-md font-semibold">Acces Token</label>
            <input type="text"  value={accessToken} onChange={(e) => setAccessToken(e.target.value)} id="metaAccessToken" placeholder="entrer votre acces token"  className="w-full p-2 border-2 border-border rounded-xl text-text text-lg outline-0"/>

            <p className="text-xs text-muted-foreground mt-1">   
                <a href="https://docs.addingwell.com/fr/meta-capi/find-meta-conversion-api-access-token" target="_blank" rel="noopener noreferrer" className="text-whatsapp hover:text-whatsapp/80 transition-colors cursor-pointer underline underline-offset-4">Comment trouver l'acces token?</a>
            </p>
            </div>
        </div>

        {/*buttons*/}
        <div className="w-full flex justify-center items-center flex-col  gap-3 mt-10 font-semibold text-sm sm:text-lg">
            <button type="button" onClick={testConnection} disabled={isTesting} className="px-4 py-2 bg-background text-text hover:bg-background-muted  w-full  h-12 rounded-xl border-2  border-border cursor-pointer flex items-center justify-center  gap-2 transition-all duration-200">{isTesting ? "Test en cours..." : "Tester la connexion"} <Cable size={20} strokeWidth={2} /></button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 cursor-pointer flex items-center justify-center h-12 w-full  gap-2 transition-all duration-200">Enregistrer <Import size={20} strokeWidth={2} /></button>
        </div>
 </form>

        </div>
    )
}