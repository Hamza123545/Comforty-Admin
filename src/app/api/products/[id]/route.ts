import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await the params object
    const { id } = await params;

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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await the params object
    const { id } = await params;

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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await the params object
    const { id } = await params;

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
