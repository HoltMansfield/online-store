# Sanity.io Integration

## Setup Complete ✓

Your project now has Sanity.io integrated! Here's what was set up:

### Files Created

1. **`sanity.config.ts`** - Main Sanity configuration
2. **`src/sanity/config.ts`** - Sanity client configuration
3. **`src/sanity/client.ts`** - Sanity client instance
4. **`src/sanity/schemaTypes/`** - Schema definitions
5. **`src/sanity/queries.ts`** - GROQ queries for fetching data
6. **`src/sanity/lib/fetch.ts`** - Helper function for fetching data
7. **`src/app/studio/[[...tool]]/page.tsx`** - Sanity Studio route

### Next Steps

1. **Add your Project ID**

   - Open `.env.local`
   - Replace `your_project_id_here` with your actual Sanity project ID
   - You can find this in your Sanity dashboard at https://sanity.io/manage

2. **Start your dev server**

   ```bash
   npm run dev
   ```

3. **Access Sanity Studio**
   - Navigate to http://localhost:3000/studio
   - Log in with your Sanity account
   - Start creating content!

### Example: Fetching Products

```typescript
import { sanityFetch } from '@/sanity/lib/fetch'
import { productsQuery } from '@/sanity/queries'

// In a Server Component
export default async function ProductsPage() {
  const products = await sanityFetch({
    query: productsQuery,
    tags: ['product'],
  })

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Schema

A basic `product` schema has been created with:

- name
- slug
- description
- price
- image
- category
- inStock

You can extend this in `src/sanity/schemaTypes/product.ts` or add new schemas.

### Useful Commands

- **Access Studio**: http://localhost:3000/studio
- **Sanity Docs**: https://www.sanity.io/docs
- **GROQ Docs**: https://www.sanity.io/docs/groq

### Environment Variables

Make sure these are set in `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Usually "production"
