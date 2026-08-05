import { getDictionary } from "@/lib/i18n";

export default async function StoreIndex() {
  const dict = await getDictionary();

  return (
    <p className="text-muted-foreground text-[13px]">
      {dict.lab.store.pickOne}
    </p>
  );
}
