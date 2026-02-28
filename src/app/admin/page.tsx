"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: string;
  name?: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    } else if (isLoaded && user) {
      if (user.publicMetadata?.role !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        fetchUsers();
      }
    }
  }, [isLoaded, user, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setMessage('Failed to fetch users');
      }
    } catch {
      setMessage('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    setUpdating(userId);
    setMessage('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        // Update the user in the local state
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        setMessage(data.message || 'Failed to update user role');
      }
    } catch {
      setMessage('Error updating user role');
    } finally {
      setUpdating(null);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.publicMetadata?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="text-lg sm:text-xl font-bold text-blue-600">
                ProFolio
              </Link>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                ADMIN
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard" className="text-xs sm:text-sm text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl">Admin Panel - User Management</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {message && (
                <div className={`mb-4 p-3 sm:p-4 rounded-md text-xs sm:text-sm ${message.includes('success') || message.includes('updated')
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                  {message}
                </div>
              )}

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">User</TableHead>
                          <TableHead className="text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                          <TableHead className="text-xs sm:text-sm">Role</TableHead>
                          <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Joined</TableHead>
                          <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((userData) => (
                          <TableRow key={userData.id}>
                            <TableCell className="text-xs sm:text-sm">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                  <AvatarFallback className="text-xs sm:text-sm">
                                    {(userData.name || userData.email)[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium truncate">
                                    {userData.name || 'No name'}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate md:hidden">
                                    {userData.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm hidden md:table-cell">{userData.email}</TableCell>
                            <TableCell>
                              <Badge variant={userData.role === 'ADMIN' ? 'destructive' : 'secondary'} className="text-xs">
                                {userData.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm text-muted-foreground hidden lg:table-cell">
                              {new Date(userData.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {userData.id !== user?.id && (
                                <Button
                                  onClick={() => updateUserRole(
                                    userData.id,
                                    userData.role === 'ADMIN' ? 'USER' : 'ADMIN'
                                  )}
                                  disabled={updating === userData.id}
                                  variant={userData.role === 'ADMIN' ? 'destructive' : 'default'}
                                  size="sm"
                                  className="text-xs"
                                >
                                  {updating === userData.id ? (
                                    <span className="hidden sm:inline">Updating...</span>
                                  ) : (
                                    userData.role === 'ADMIN' ? 'Demote' : 'Promote'
                                  )}
                                </Button>
                              )}
                              {userData.id === user?.id && (
                                <Badge variant="outline" className="text-xs">You</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {users.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-xs sm:text-sm text-muted-foreground">No users found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}