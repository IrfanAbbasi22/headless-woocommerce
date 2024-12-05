'use client'
import Image from "next/image";
import ProductCard from "../components/productCard";
import ProductCartModal from "../components/productCartModal";
import { useEffect, useState } from 'react';

export default function FetchProducts(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/v3/products`;
   
        // Fetch the products
        const fetchData = async () => {
          try {
            const response = await fetch(url, {
              method: 'GET',
              auth: {
                username: process.env.NEXT_PUBLIC_CONSUMER_KEY,
                password: process.env.NEXT_PUBLIC_CONSUMER_SECRET
              },
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_CONSUMER_SECRET}`),
              }
            });
            const data = await response.json();
            
            setProducts(data);
            
          } catch (error) {
            console.error("Error fetching products:", error);
          }finally{
            setLoading(false);
          }
        };
    
        fetchData();
    }, []);
    
    if (loading) {
        return <div className="container flex flex-wrap gap-5 mx-auto text-center items-center justify-center">Loading products...</div>;
    }

    return (
        <div className="container gap-5 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {products.length ? 
              products.map((product, index) => (
                <ProductCard key={`productCard${index}`} product={product}   />
              )) : (
                'Products Not Found'
              )
            
            }

            <ProductCartModal/>
        </div>
    )
}