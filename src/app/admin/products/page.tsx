"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import type { Product, Category } from "@/types/global"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import CreateProduct from "@/components/product/CreateProduct"
import EditProduct from "@/components/product/EditProduct"
import ProductDetail from "@/components/product/ProductDetail"
import Image from "next/image"
import { toast } from "sonner"

export default function ProductDataTable() {
    const [data, setData] = useState<Product[]>([])
    const [filteredData, setFilteredData] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [stockFilter, setStockFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    // Fetch products and categories
    useEffect(() => {
        setIsLoading(true)
        Promise.all([
            fetch("/api/admin/products").then(res => res.json()),
            fetch("/api/category").then(res => res.json())
        ])
            .then(([products, categoryData]) => {
                setData(products)
                setCategories(categoryData.categories || [])
            })
            .catch(error => {
                console.error("Error fetching data:", error)
                toast.error("Không thể tải dữ liệu")
            })
            .finally(() => setIsLoading(false))
    }, [])

    // Filter and search logic
    useEffect(() => {
        let filtered = data

        // Search by name
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(product =>
                product.category._id === selectedCategory
            )
        }

        // Filter by stock status
        if (stockFilter !== "all") {
            const inStock = stockFilter === "inStock"
            filtered = filtered.filter(product => product.inStock === inStock)
        }

        setFilteredData(filtered)
        setCurrentPage(1) // Reset to first page when filtering
    }, [data, searchTerm, selectedCategory, stockFilter])

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

    // Handle product deletion
    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                setData(prev => prev.filter(product => product._id !== productId))
                toast.success("Đã xóa sản phẩm thành công")
            } else {
                throw new Error("Xóa sản phẩm thất bại")
            }
        } catch (error) {
            console.error("Error deleting product:", error)
            toast.error("Không thể xóa sản phẩm")
        }
    }

    // Handle product update after edit
    const handleProductUpdate = (updatedProduct: Product) => {
        setData(prev => prev.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
        ))
        setIsEditDialogOpen(false)
        toast.success("Cập nhật sản phẩm thành công")
    }

    // Handle product creation
    const handleProductCreate = (newProduct: Product) => {
        setData(prev => [newProduct, ...prev])
        setIsCreateDialogOpen(false)
        toast.success("Tạo sản phẩm thành công")
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
                    <p className="text-muted-foreground">
                        Tổng cộng {filteredData.length} sản phẩm
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus size={16} />
                            Thêm sản phẩm
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tạo sản phẩm mới</DialogTitle>
                            <DialogDescription>
                                Điền thông tin để tạo sản phẩm mới
                            </DialogDescription>
                        </DialogHeader>
                        <CreateProduct onSuccess={handleProductCreate} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="inStock">Còn hàng</SelectItem>
                        <SelectItem value="outOfStock">Hết hàng</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Đã bán</TableHead>
                            <TableHead className="w-[120px]">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map((product) => {
                            const firstImage = product.images[0]?.url || ""
                            return (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        {firstImage ? (
                                            <Image
                                                src={firstImage}
                                                alt={product.name}
                                                className="h-12 w-12 object-cover rounded"
                                                width={48}
                                                height={48}
                                                priority
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                                <span className="text-xs text-gray-500">No img</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {product.slug}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">
                                            {product.price.toLocaleString("vi-VN")} ₫
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {product.category.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {product.inStock ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                Còn hàng
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                Hết hàng
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{product.sold}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedProduct(product)
                                                    setIsDetailDialogOpen(true)
                                                }}
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedProduct(product)
                                                    setIsEditDialogOpen(true)
                                                }}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredData.length)} trong tổng số {filteredData.length} sản phẩm
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <span className="text-sm">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin sản phẩm
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProduct && (
                        <EditProduct
                            product={selectedProduct}
                            onSuccess={handleProductUpdate}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <ProductDetail product={selectedProduct} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}