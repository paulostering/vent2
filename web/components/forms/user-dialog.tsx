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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  CreateUserData, 
  UpdateUserData, 
  USER_TYPES, 
  getRolesByType 
} from "@/lib/types/user";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  type: z.enum(['employee']),
  role: z.string().min(1, "Role is required"),
  tenantId: z.string().min(1, "Tenant ID is required"),
});

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(['employee']),
  role: z.string().min(1, "Role is required"),
  isActive: z.boolean(),
});

interface UserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  mode: 'create' | 'edit';
  onSave: (data: CreateUserData | UpdateUserData) => void;
}

export function UserDialog({ open, onOpenChange, user, mode, onSave }: UserSheetProps) {
  const [selectedType, setSelectedType] = useState<'employee' | 'customer'>('employee');
  const [loading, setLoading] = useState(false);

  const isCreate = mode === 'create';
  const schema = isCreate ? createUserSchema : updateUserSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: isCreate ? {
      name: '',
      email: '',
      password: '',
      type: 'employee' as const,
      role: '',
      tenantId: 'tenant-1', // Default tenant
    } : {
      name: user?.name || '',
      type: 'employee' as const, // Always employee
      role: user?.role || '',
      isActive: user?.isActive ?? true,
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user && !isCreate) {
      form.reset({
        name: user.name,
        type: 'employee', // Always employee
        role: user.role,
        isActive: user.isActive,
      });
      setSelectedType('employee');
    } else if (isCreate) {
      form.reset({
        name: '',
        email: '',
        password: '',
        type: 'employee',
        role: '',
        tenantId: 'tenant-1',
      });
      setSelectedType('employee');
    }
  }, [user, isCreate, form]);

  // Reset role when type changes
  useEffect(() => {
    form.setValue('role', '');
  }, [selectedType, form]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSave(data);
      form.reset();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = getRolesByType(selectedType);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] w-[90vw]">
        <SheetHeader>
          <SheetTitle>
            {isCreate ? 'Create New User' : `Edit ${user?.name}`}
          </SheetTitle>
          <SheetDescription>
            {isCreate 
              ? 'Add a new user to the system with appropriate role and permissions.'
              : 'Update user information, role, and status.'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field (Create only) */}
            {isCreate && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="user@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Password Field (Create only) */}
            {isCreate && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* User Type - Fixed to Employee */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(value as 'employee' | 'customer');
                    }} 
                    defaultValue="employee"
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'true')} 
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Active</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="false">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">Inactive</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

              <SheetFooter className="flex gap-2 pt-6 px-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : isCreate ? 'Create User' : 'Save Changes'}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
