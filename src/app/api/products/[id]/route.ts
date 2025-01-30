// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

// Fetch a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Directly destructure the id from params (no need for `await`)
    const { id } = params;

    // Fetch the product from Sanity
    const product = await client.getDocument(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Ensure the image URL is included in the response
    const productWithImage = {
      ...product,
      image: product.image?.asset?.url || '', // Adding the image URL here
    };

    return NextResponse.json(productWithImage);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create a new product in Sanity
    const newProduct = await client.create({
      _type: 'products',
      title: body.title,
      price: parseFloat(body.price),
      priceWithoutDiscount: parseFloat(body.priceWithoutDiscount),
      badge: body.badge,
      description: body.description,
      inventory: parseInt(body.inventory, 10),
      tags: body.tags.split(',').map((tag: string) => tag.trim()),
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: body.imageRef, // Replace with the actual image reference ID
        },
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update a product
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Directly destructure the id from params (no need for `await`)
    const { id } = params;

    const body = await request.json();

    const updatedProduct = {
      title: body.title,
      price: parseFloat(body.price),
      priceWithoutDiscount: parseFloat(body.priceWithoutDiscount),
      badge: body.badge,
      description: body.description,
      inventory: parseInt(body.inventory, 10),
      tags: body.tags,
    };

    const result = await client.patch(id).set(updatedProduct).commit();

    if (!result) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Directly destructure the id from params (no need for `await`)
    const { id } = params;

    // Delete product from Sanity
    const result = await client.delete(id);

    if (!result) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}