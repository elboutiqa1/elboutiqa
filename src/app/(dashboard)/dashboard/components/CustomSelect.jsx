"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CustomSelect({label,value,onChange,options}) {
  return (
    <Select value={value != null ? value.toString() : undefined} onValueChange={onChange}>
      <SelectTrigger className="w-fit  max-w-30 bg-border/30 border-1 border-border text-text-muted font-bold cursor-pointer hover:bg-border transition-all duration-200  ring-0 outline-none ">
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent className="bg-background text-text-muted font-bold text-center ring-0 outline-none border-border border-1 w-fit min-w-fit">
        <SelectGroup className="ring-0 outline-none">
          <SelectLabel>{label}</SelectLabel>
          {options?.map((item) => (
            <SelectItem key={item} value={item.toString()} className="hover:bg-border/30">
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
