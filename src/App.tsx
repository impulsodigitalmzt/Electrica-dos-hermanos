import { CartDrawer } from "@/components/CartDrawer";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { SearchPage } from "@/pages/SearchPage";
import { useRoute } from "@/lib/nav";

export default function App() {
  const route = useRoute();
  return (
    <>
      {route.name === "home" ? <HomePage /> : null}
      {route.name === "search" ? <SearchPage q={route.q} categoria={route.categoria} iluminacion={route.iluminacion} /> : null}
      {route.name === "product" ? <ProductPage sku={route.sku} /> : null}
      <CartDrawer />
    </>
  );
}
