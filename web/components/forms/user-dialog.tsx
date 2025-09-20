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
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(6, "Password must be at least 6 characters"),
  type: z.enum(['employee']),
  role: z.string().min(1, "Role is required"),
  tenantId: z.string().min(1, "Tenant ID is required"),
});

const updateUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal('')),
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      type: 'employee' as const,
      role: '', // No default role
      tenantId: 'tenant-1', // Default tenant
    } : {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      type: 'employee' as const, // Always employee
      role: user?.role ?? '',
      isActive: user?.isActive ?? true,
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user && !isCreate) {
      form.reset({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        type: 'employee', // Always employee
        role: user.role ?? '',
        isActive: user.isActive ?? true,
      });
      setSelectedType('employee');
    } else if (isCreate) {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        type: 'employee',
        role: '', // No default role
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
      <SheetContent className="sm:max-w-[540px] w-[90vw] flex flex-col">
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

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <Form {...form}>
            <div className="space-y-6">
              {/* Name Fields - First and Last in one row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
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

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+1 (555) 123-4567" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* User Type - Hidden, always employee */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <input type="hidden" {...field} value="employee" />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
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
            </div>
          </Form>
        </div>

        <SheetFooter className="pt-6 px-4 border-t">
          <div className="flex gap-2 w-full">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              onClick={form.handleSubmit(onSubmit)}
              className="flex-1"
            >
              {loading ? 'Saving...' : isCreate ? 'Create User' : 'Save Changes'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
