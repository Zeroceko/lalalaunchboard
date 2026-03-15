import { notFound } from "next/navigation";

import { requireSessionContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getProductByIdForUser } from "@/lib/products/service";
import { EditProductForm } from "@/components/products/EditProductForm";

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const { user } = await requireSessionContext();
  const supabase = createClient();

  const product = await getProductByIdForUser(supabase, user.id, params.id);
  if (!product) notFound();

  return <EditProductForm product={product} />;
}
