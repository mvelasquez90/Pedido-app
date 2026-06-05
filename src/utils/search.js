
export function searchProducts(products, query) {
  if (!query) return products;

  const q = query.toLowerCase();

  return products.filter(p =>
    p.nombre.toLowerCase().includes(q)
  );
}
