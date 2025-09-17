import ProductPage from '@/components/ProductPage';

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPageRoute({ params }: ProductPageProps) {
  const { productId } = await params;
  return <ProductPage productId={productId} />;
}
