import { groq } from "next-sanity";

export const productsQuery = groq`*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  "imageUrl": image.asset->url,
  category,
  inStock
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  price,
  "imageUrl": image.asset->url,
  category,
  inStock
}`;
