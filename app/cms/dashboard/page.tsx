"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AuthService } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Image,
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  Star
} from "lucide-react";

export default function CMSDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AuthService.verifyToken();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        router.push("/cms");
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/cms");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const admin = AuthService.getAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl shadow-xl">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  SpaFort massage & spa
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Welcome back, <span className="font-semibold text-purple-700">{admin?.email}</span>
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-9 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-purple-100">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Overview</TabsTrigger>
            <TabsTrigger value="homepage" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Homepage</TabsTrigger>
            <TabsTrigger value="services" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Services</TabsTrigger>
            <TabsTrigger value="articles" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Articles</TabsTrigger>
            <TabsTrigger value="memberships" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Memberships</TabsTrigger>
            <TabsTrigger value="testimonials" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Testimonials</TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Bookings</TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Gallery</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Services</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">4</div>
                  <p className="text-xs text-gray-600 mt-1">
                    Active services
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Memberships</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-pink-100 to-amber-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-5 w-5 text-pink-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">3</div>
                  <p className="text-xs text-gray-600 mt-1">
                    Available plans
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Testimonials</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-5 w-5 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">4</div>
                  <p className="text-xs text-gray-600 mt-1">
                    Customer reviews
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">System Status</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                    Online
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-serif bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Common management tasks for your spa sanctuary
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-3 border-2 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  onClick={() => router.push("/cms/dashboard/homepage")}
                >
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-7 w-7 text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-700">Edit Homepage</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-3 border-2 border-pink-200 hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-amber-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  onClick={() => router.push("/cms/dashboard/services")}
                >
                  <div className="p-3 bg-gradient-to-br from-pink-100 to-amber-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-pink-600" />
                  </div>
                  <span className="font-semibold text-gray-700">Manage Services</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-3 border-2 border-amber-200 hover:border-amber-400 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  onClick={() => router.push("/cms/dashboard/settings")}
                >
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Settings className="h-7 w-7 text-amber-600" />
                  </div>
                  <span className="font-semibold text-gray-700">Update Settings</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-3 border-2 border-green-200 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  onClick={() => router.push("/cms/dashboard/gallery")}
                >
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Image className="h-7 w-7 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-700">Media Library</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homepage">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Homepage Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage hero section, trust badges, and featured content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push("/cms/dashboard/homepage")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Open Homepage Editor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">Services Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Add, edit, and manage spa services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push("/cms/dashboard/services")}
                    className="bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Manage Services
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="memberships">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Membership Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage membership plans and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push("/cms/dashboard/memberships")}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Manage Memberships
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Articles Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Create and manage blog articles and categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push("/cms/dashboard/articles")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Manage Articles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Testimonials Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage customer reviews and ratings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push("/cms/dashboard/testimonials")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Manage Testimonials
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Bookings Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage customer booking requests and appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push("/cms/dashboard/bookings")}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Manage Bookings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Gallery Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Upload, publish, edit, and delete gallery images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push("/cms/dashboard/gallery")}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Open Gallery
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Settings</CardTitle>
                  <CardDescription className="text-gray-600">
                    Configure global settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push("/cms/dashboard/settings")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Open Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}