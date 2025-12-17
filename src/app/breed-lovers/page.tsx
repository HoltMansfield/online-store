import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { client } from "@/sanity/client";
import { breedLoversProductsQuery } from "@/sanity/queries";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
}

export default async function BreedLoversPage() {
  const products: Product[] = await client.fetch(breedLoversProductsQuery);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Breed Lovers</h1>
        <p className="text-muted-foreground">
          Discover our exclusive collection for breed enthusiasts
        </p>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No products found in the Breed Lovers category yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.imageUrl && (
                <div className="relative w-full h-64 bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.description && (
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
