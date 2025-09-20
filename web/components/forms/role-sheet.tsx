'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Role, 
  CreateRoleData, 
  UpdateRoleData,
  AVAILABLE_PERMISSIONS,
  PERMISSION_CATEGORIES,
  PermissionCategory,
  getPermissionsByCategory,
  formatPermissionCategory
} from "@/lib/types/role";

const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  permissions: z.array(z.string()).min(1, "At least one permission must be selected"),
});

const updateRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  permissions: z.array(z.string()).min(1, "At least one permission must be selected"),
  isActive: z.boolean(),
});

interface RoleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  mode: 'create' | 'edit';
  onSave: (data: CreateRoleData | UpdateRoleData) => void;
}

export function RoleSheet({ open, onOpenChange, role, mode, onSave }: RoleSheetProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const isCreate = mode === 'create';
  const schema = isCreate ? createRoleSchema : updateRoleSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: isCreate ? {
      name: '',
      description: '',
      permissions: [],
    } : {
      name: role?.name || '',
      description: role?.description || '',
      permissions: role?.permissions.map(p => p.id) || [],
      isActive: role?.isActive ?? true,
    },
  });

  // Update form when role changes
  useEffect(() => {
    if (role && !isCreate) {
      const permissionIds = role.permissions.map(p => p.id);
      form.reset({
        name: role.name,
        description: role.description,
        permissions: permissionIds,
        isActive: role.isActive,
      });
      setSelectedPermissions(permissionIds);
    } else if (isCreate) {
      form.reset({
        name: '',
        description: '',
        permissions: [],
      });
      setSelectedPermissions([]);
    }
  }, [role, isCreate, form]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSave(data);
      form.reset();
      setSelectedPermissions([]);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    const newPermissions = checked 
      ? [...selectedPermissions, permissionId]
      : selectedPermissions.filter(id => id !== permissionId);
    
    setSelectedPermissions(newPermissions);
    form.setValue('permissions', newPermissions);
  };

  const handleCategoryToggle = (category: PermissionCategory, checked: boolean) => {
    const categoryPermissions = getPermissionsByCategory(category).map(p => p.id);
    
    let newPermissions;
    if (checked) {
      // Add all permissions from this category
      newPermissions = [...new Set([...selectedPermissions, ...categoryPermissions])];
    } else {
      // Remove all permissions from this category
      newPermissions = selectedPermissions.filter(id => !categoryPermissions.includes(id));
    }
    
    setSelectedPermissions(newPermissions);
    form.setValue('permissions', newPermissions);
  };

  const isCategorySelected = (category: PermissionCategory) => {
    const categoryPermissions = getPermissionsByCategory(category).map(p => p.id);
    return categoryPermissions.every(id => selectedPermissions.includes(id));
  };

  const isCategoryPartiallySelected = (category: PermissionCategory) => {
    const categoryPermissions = getPermissionsByCategory(category).map(p => p.id);
    const selectedCount = categoryPermissions.filter(id => selectedPermissions.includes(id)).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] w-[90vw] flex flex-col">
        <SheetHeader>
          <SheetTitle>
            {isCreate ? 'Create New Role' : `Edit ${role?.name}`}
          </SheetTitle>
          <SheetDescription>
            {isCreate 
              ? 'Create a new role and assign permissions for employee users.'
              : 'Update role information and modify assigned permissions.'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <Form {...form}>
            <div className="space-y-6">
              {/* Role Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the role and its responsibilities..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permissions */}
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="space-y-4">
                      {PERMISSION_CATEGORIES.map((category) => {
                        const categoryPermissions = getPermissionsByCategory(category.value);
                        const isSelected = isCategorySelected(category.value);
                        const isPartial = isCategoryPartiallySelected(category.value);
                        
                        return (
                          <div key={category.value} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={category.value}
                                checked={isSelected}
                                onCheckedChange={(checked) => 
                                  handleCategoryToggle(category.value, checked as boolean)
                                }
                                className={isPartial ? "data-[state=checked]:bg-primary/50" : ""}
                              />
                              <label
                                htmlFor={category.value}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.label}
                              </label>
                              {isPartial && (
                                <Badge variant="secondary" className="text-xs">
                                  Partial
                                </Badge>
                              )}
                            </div>
                            
                            <div className="ml-6 space-y-2">
                              {categoryPermissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={permission.id}
                                    checked={selectedPermissions.includes(permission.id)}
                                    onCheckedChange={(checked) => 
                                      handlePermissionToggle(permission.id, checked as boolean)
                                    }
                                  />
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permission.name}
                                  </label>
                                  <span className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status (Edit only) */}
              {!isCreate && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="isActive"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Role is active
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </Form>
        </div>

        <SheetFooter className="flex gap-2 pt-6 px-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {loading ? 'Saving...' : isCreate ? 'Create Role' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
