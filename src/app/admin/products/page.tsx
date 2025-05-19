"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import type { Product } from "@/types/global"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CreateProduct from "@/components/product/CreateProduct"

export default function ProductDataTable() {
    const [data, setData] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetch("/api/admin/products")
            .then((res) => res.json())
            .then((products: Product[]) => setData(products))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return <div className="p-4">Loading products...</div>
    }

    return (
        <div className="">
            <CreateProduct />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Thumbnail</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Sold</TableHead>
                        <TableHead>Category</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((product) => {
                        // Lấy ảnh đầu tiên
                        const firstImage =
                            product.images[0]?.url || ""
                        console.log(product.category.name)
                        return (
                            <TableRow key={product._id}>
                                <TableCell>
                                    {firstImage ? (
                                        <img
                                            src={firstImage}
                                            alt={product.name}
                                            className="h-10 w-10 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 bg-gray-200 rounded" />
                                    )}
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{handleDisplayCurrencyInVND(product.price)}</TableCell>
                                <TableCell>{handleInStockDisplay(product.inStock)}</TableCell>
                                <TableCell>{product.sold}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div >
    )
}

const handleDisplayCurrencyInVND = (price: number) => {
    return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    })
}

const handleInStockDisplay = (inStock: boolean) => {
    return inStock ? (
        <span className="text-green-500">Còn hàng</span>
    ) : (
        <span className="text-red-500">Hết hàng</span>
    )
}