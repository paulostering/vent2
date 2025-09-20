'use client';

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield, ShieldOff, Users } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, AVAILABLE_PERMISSIONS, PermissionCategory } from "@/lib/types/role";
import { RoleSheet } from "@/components/forms/role-sheet";

// Mock data - replace with API calls
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: AVAILABLE_PERMISSIONS, // All permissions
    isActive: true,
    userCount: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Management access with order and customer permissions',
    permissions: AVAILABLE_PERMISSIONS.filter(p => 
      p.category === PermissionCategory.ORDER_MANAGEMENT ||
      p.category === PermissionCategory.CUSTOMER_MANAGEMENT ||
      p.category === PermissionCategory.REPORTS
    ),
    isActive: true,
    userCount: 1,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: '3',
    name: 'Warehouse',
    description: 'Warehouse operations and inventory management',
    permissions: AVAILABLE_PERMISSIONS.filter(p => 
      p.category === PermissionCategory.INVENTORY_MANAGEMENT ||
      (p.category === PermissionCategory.ORDER_MANAGEMENT && p.action === 'fulfill')
    ),
    isActive: true,
    userCount: 1,
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
  },
  {
    id: '4',
    name: 'Customer Service',
    description: 'Customer support and order assistance',
    permissions: AVAILABLE_PERMISSIONS.filter(p => 
      p.category === PermissionCategory.CUSTOMER_MANAGEMENT ||
      (p.category === PermissionCategory.ORDER_MANAGEMENT && p.action !== 'delete')
    ),
    isActive: false,
    userCount: 1,
    createdAt: '2024-01-10T15:00:00Z',
    updatedAt: '2024-01-18T16:30:00Z',
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles', {
          credentials: 'include',
        });
        if (response.ok) {
          const roleData = await response.json();
          setRoles(roleData);
        } else {
          // Fallback to mock data if API fails
          setRoles(mockRoles);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        // Fallback to mock data
        setRoles(mockRoles);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Filter roles based on search and filters
  useEffect(() => {
    let filtered = roles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(role => 
        statusFilter === "active" ? role.isActive : !role.isActive
      );
    }

    setFilteredRoles(filtered);
  }, [roles, searchTerm, statusFilter]);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setSheetMode('create');
    setIsSheetOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setSheetMode('edit');
    setIsSheetOpen(true);
  };

  const handleToggleStatus = async (role: Role) => {
    try {
      const response = await fetch(`/api/roles/${role.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !role.isActive }),
        credentials: 'include',
      });

      if (response.ok) {
        setRoles(prev => prev.map(r => 
          r.id === role.id ? { ...r, isActive: !r.isActive } : r
        ));
      } else {
        const error = await response.json();
        alert(`Error updating role: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.userCount > 0) {
      alert(`Cannot delete role "${role.name}" because it is assigned to ${role.userCount} user(s). Please reassign users first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      try {
        const response = await fetch(`/api/roles/${role.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          setRoles(prev => prev.filter(r => r.id !== role.id));
        } else {
          const error = await response.json();
          alert(`Error deleting role: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Header with Breadcrumbs */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">
                  Admin Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/settings">
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Roles</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Role Management</h1>
            <p className="text-muted-foreground">
              Manage employee roles and assign permissions
            </p>
          </div>
          <Button onClick={handleCreateRole}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Roles Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton loading rows
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No roles found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.name}</span>
                        <span className="text-sm text-muted-foreground">{role.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">
                          {role.permissions.length} permissions
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{role.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isActive ? 'default' : 'destructive'}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(role.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditRole(role)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(role)}>
                            {role.isActive ? (
                              <>
                                <ShieldOff className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRole(role)}
                            className="text-red-600 focus:text-red-600"
                            disabled={role.userCount > 0}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Role Sheet */}
        <RoleSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          role={selectedRole}
          mode={sheetMode}
          onSave={async (roleData) => {
            try {
              if (sheetMode === 'create') {
                const response = await fetch('/api/roles', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(roleData),
                  credentials: 'include',
                });

                if (response.ok) {
                  const newRole = await response.json();
                  setRoles(prev => [...prev, newRole]);
                } else {
                  const error = await response.json();
                  alert(`Error creating role: ${error.message || 'Unknown error'}`);
                  return;
                }
              } else if (selectedRole) {
                const response = await fetch(`/api/roles/${selectedRole.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(roleData),
                  credentials: 'include',
                });

                if (response.ok) {
                  const updatedRole = await response.json();
                  setRoles(prev => prev.map(r => 
                    r.id === selectedRole.id ? updatedRole : r
                  ));
                } else {
                  const error = await response.json();
                  alert(`Error updating role: ${error.message || 'Unknown error'}`);
                  return;
                }
              }
              setIsSheetOpen(false);
            } catch (error) {
              console.error('Save error:', error);
              alert('Network error. Please try again.');
            }
          }}
        />
      </div>
    </>
  );
}
