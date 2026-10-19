
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {Printer} from "lucide-react"

export default function ImpressionType ({tracking,handlePrint}) {
    return (  
        <Popover >
  <PopoverTrigger asChild>
   <Printer
                strokeWidth={1.5}
                className={`p-1 size-8 text-text-muted hover:text-text transition-all duration-200 border-1 rounded-lg border-border cursor-pointer ${
                  "" === tracking ? "opacity-50 animate-pulse pointer-events-none" : ""
                }`}/>
  </PopoverTrigger>
  <PopoverContent className="bg-background w-full h-full py-5 px-5 border-1 border-border ring-0 outline-0 mr-7">
    <PopoverHeader >
      <PopoverTitle><p className="text-text font-inter font-semibold mb-2 text-center">Format d'impression</p></PopoverTitle>
      <div className="flex items-center justify-between gap-2" >
        <button onClick={() => handlePrint(tracking,"10x10")} className="text-text font-inter text-sm bg-border/30 hover:bg-border border-1 border-border px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer">10x10cm</button>
        <button onClick={() => handlePrint(tracking,"10x13")} className="text-text font-inter text-sm bg-border/30 hover:bg-border border-1 border-border px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer">10x13cm</button>

      </div>
    </PopoverHeader>
  </PopoverContent>
</Popover>
    )
}