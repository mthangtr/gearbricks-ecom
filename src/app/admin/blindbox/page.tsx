"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import type { Blindbox, Product } from "@/types/global"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Copy,
    ChevronLeft,
    ChevronRight,
    Gift,
    TrendingUp
} from "lucide-react"
import CreateBlindBox from "@/components/blindbox/CreateBlindBox"
import EditBlindBox from "@/components/blindbox/EditBlindBox"
import BlindboxDetail from "@/components/blindbox/BlindboxDetail"
import Image from "next/image"
import { toast } from "sonner"

export default function AdminBlindBoxManagement() {
    const [data, setData] = useState<Blindbox[]>([])
    const [filteredData, setFilteredData] = useState<Blindbox[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [selectedBlindbox, setSelectedBlindbox] = useState<Blindbox | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    // Fetch blindboxes
    useEffect(() => {
        setIsLoading(true)
        fetch("/api/blindbox")
            .then((res) => res.json())
            .then((blindboxes: Blindbox[]) => {
                setData(blindboxes)
            })
            .catch(error => {
                console.error("Error fetching blindboxes:", error)
                toast.error("Không thể tải dữ liệu")
            })
            .finally(() => setIsLoading(false))
    }, [])

    // Filter and search logic
    useEffect(() => {
        let filtered = data

        // Search by title
        if (searchTerm) {
            filtered = filtered.filter(blindbox =>
                blindbox.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredData(filtered)
        setCurrentPage(1) // Reset to first page when filtering
    }, [data, searchTerm])

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

    // Handle blindbox deletion
    const handleDeleteBlindbox = async (blindboxId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa blindbox này?")) return

        try {
            const response = await fetch(`/api/admin/blindbox/${blindboxId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                setData(prev => prev.filter(blindbox => blindbox._id !== blindboxId))
                toast.success("Đã xóa blindbox thành công")
            } else {
                throw new Error("Xóa blindbox thất bại")
            }
        } catch (error) {
            console.error("Error deleting blindbox:", error)
            toast.error("Không thể xóa blindbox")
        }
    }

    // Handle blindbox duplication
    const handleDuplicateBlindbox = async (blindbox: Blindbox) => {
        try {
            const duplicatedBlindbox = {
                title: `${blindbox.title} (Copy)`,
                slug: `${blindbox.slug}-copy`,
                description: blindbox.description,
                price: blindbox.price,
                thumbnailUrl: blindbox.thumbnailUrl,
                products: blindbox.products.map(item => ({
                    product: item.product._id,
                    probability: item.probability
                }))
            }

            const response = await fetch("/api/admin/blindbox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(duplicatedBlindbox),
            })

            if (response.ok) {
                const newBlindbox = await response.json()
                setData(prev => [newBlindbox.blindbox, ...prev])
                toast.success("Đã tạo bản sao blindbox thành công")
            } else {
                throw new Error("Tạo bản sao thất bại")
            }
        } catch (error) {
            console.error("Error duplicating blindbox:", error)
            toast.error("Không thể tạo bản sao blindbox")
        }
    }

    // Handle blindbox update after edit
    const handleBlindboxUpdate = (updatedBlindbox: Blindbox) => {
        setData(prev => prev.map(blindbox =>
            blindbox._id === updatedBlindbox._id ? updatedBlindbox : blindbox
        ))
        setIsEditDialogOpen(false)
        toast.success("Cập nhật blindbox thành công")
    }

    // Handle blindbox creation
    const handleBlindboxCreate = (newBlindbox: Blindbox) => {
        setData(prev => [newBlindbox, ...prev])
        setIsCreateDialogOpen(false)
        toast.success("Tạo blindbox thành công")
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
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Gift className="h-6 w-6" />
                        Quản lý Blindbox
                    </h1>
                    <p className="text-muted-foreground">
                        Tổng cộng {filteredData.length} blindbox
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus size={16} />
                            Tạo blindbox mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tạo blindbox mới</DialogTitle>
                            <DialogDescription>
                                Điền thông tin để tạo blindbox mới
                            </DialogDescription>
                        </DialogHeader>
                        <CreateBlindBox onSuccess={handleBlindboxCreate} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                        placeholder="Tìm kiếm blindbox..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Ảnh</TableHead>
                            <TableHead>Tên blindbox</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Sản phẩm</TableHead>
                            <TableHead>Lượt quay</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="w-[150px]">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map((blindbox) => (
                            <TableRow key={blindbox._id}>
                                <TableCell>
                                    {blindbox.thumbnailUrl ? (
                                        <Image
                                            src={blindbox.thumbnailUrl}
                                            alt={blindbox.title}
                                            className="h-12 w-12 object-cover rounded"
                                            width={48}
                                            height={48}
                                            priority
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                            <Gift size={20} className="text-gray-400" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{blindbox.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {blindbox.slug}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">
                                        {blindbox.price.toLocaleString("vi-VN")} ₫
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {blindbox.products.length} sản phẩm
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp size={14} className="text-green-500" />
                                        <span className="font-medium">{blindbox.totalOpens}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-green-100 text-green-800">
                                        Hoạt động
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedBlindbox(blindbox)
                                                setIsDetailDialogOpen(true)
                                            }}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedBlindbox(blindbox)
                                                setIsEditDialogOpen(true)
                                            }}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDuplicateBlindbox(blindbox)}
                                        >
                                            <Copy size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteBlindbox(blindbox._id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredData.length)} trong tổng số {filteredData.length} blindbox
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
                        <DialogTitle>Chỉnh sửa blindbox</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin blindbox
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBlindbox && (
                        <EditBlindBox
                            blindbox={selectedBlindbox}
                            onSuccess={handleBlindboxUpdate}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết blindbox</DialogTitle>
                    </DialogHeader>
                    {selectedBlindbox && (
                        <BlindboxDetail blindbox={selectedBlindbox} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}