import { supabase } from "@/integrations/supabase/client";
import type { ServicePricing } from "@/lib/cleanlink-data";

export async function fetchServicePricing(): Promise<ServicePricing> {
  const { data, error } = await supabase
    .from("service_pricing")
    .select(
      "standard_price, kitchen_price, urgent_fee_1_2, urgent_fee_3_4, urgent_fee_5_plus, bank_name, bank_account, bank_account_holder",
    )
    .eq("id", true)
    .single();

  if (error) throw error;
  return data;
}
