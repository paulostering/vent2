'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";

interface UserInfo {
  id: string;
  email: string;
  type: 'employee' | 'customer';
  role: string;
  tenantId: string;
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from the API
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  // Mock user data as fallback (matches our demo customer)
  const displayUser = user || {
    id: '2',
    email: 'customer@example.com',
    type: 'customer' as const,
    role: 'manager',
    tenantId: 'tenant-2'
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].split('.').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-semibold">Customer Dashboard</h1>
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 px-3 py-2 h-auto"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/customer.jpg" alt={displayUser.email} />
                    <AvatarFallback>
                      {getUserInitials(displayUser.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{displayUser.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRole(displayUser.role)} • {displayUser.type}
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayUser.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {formatRole(displayUser.role)} • {displayUser.type}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Demo Info Banner */}
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-100">Customer Portal Demo</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                You're logged in as: <strong>{displayUser.email}</strong> ({formatRole(displayUser.role)} • {displayUser.type})
              </p>
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
              Demo Mode
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">
            Welcome back, {displayUser.email.split('@')[0]}!
          </h2>
          <p className="text-muted-foreground">
            You're logged in as a <strong>{formatRole(displayUser.role)}</strong> in the customer portal.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-muted/50 p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Recent Orders</h3>
            <p className="text-muted-foreground">View and track your orders</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Account Settings</h3>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Support</h3>
            <p className="text-muted-foreground">Get help when you need it</p>
          </div>
        </div>
      </div>
    </main>
  );
}
