import { CURRENCIES } from "@/utils/currency";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function CurrencySelector({
  value,
  onChange,
  label,
}: CurrencySelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
