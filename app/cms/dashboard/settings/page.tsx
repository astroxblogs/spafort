"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthService } from "@/lib/auth";
import { apiService } from "@/lib/api";
import { Loader2, Save, Phone, Mail, MapPin, Clock, Upload } from "lucide-react";

interface Settings {
  [key: string]: string;
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AuthService.verifyToken();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        router.push("/cms");
        return;
      }

      await loadSettings();
    };

    checkAuth();
  }, [router]);

  const loadSettings = async () => {
    try {
      const response = await apiService.getSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Settings Management
              </h1>
              <p className="text-sm text-gray-600">
                Configure global settings and business information
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/cms/dashboard")}>
                Back to Dashboard
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Business contact details and communication information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone || ''}
                  onChange={(e) => updateSetting('contact_phone', e.target.value)}
                  placeholder="+1 (234) 567-890"
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Address</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                  placeholder="info@Velorathai.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram_username">Telegram Username</Label>
              <Input
                id="telegram_username"
                value={settings.telegram_username || ''}
                onChange={(e) => updateSetting('telegram_username', e.target.value)}
                placeholder="@yourusername or https://t.me/yourusername"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Location and operational details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={settings.address || ''}
                onChange={(e) => updateSetting('address', e.target.value)}
                placeholder="123 Wellness Street, Downtown District"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_hours">Business Hours</Label>
              <Textarea
                id="business_hours"
                value={settings.business_hours || ''}
                onChange={(e) => updateSetting('business_hours', e.target.value)}
                placeholder="Mon-Fri: 10AM-9PM, Sat-Sun: 9AM-10PM"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking & External Links */}
        {/* <Card>
          <CardHeader>
            <CardTitle>External Links & Booking</CardTitle>
            <CardDescription>
              Integration links and external service connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="booking_url">Zenoti Booking URL</Label>
              <Input
                id="booking_url"
                value={settings.booking_url || ''}
                onChange={(e) => updateSetting('booking_url', e.target.value)}
                placeholder="https://Velorathaispa.zenoti.com"
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Service Page Hero Image */}
        <Card>
          <CardHeader>
            <CardTitle>Service Page Hero Image</CardTitle>
            <CardDescription>
              Background image for the Our Services page hero section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service_page_hero_image">Hero Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="service_page_hero_image"
                  value={settings.service_page_hero_image || ''}
                  onChange={(e) => updateSetting('service_page_hero_image', e.target.value)}
                  placeholder="/assets/service-traditional.jpg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => document.getElementById('serviceHeroImageInput')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <input
                id="serviceHeroImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const { url } = await apiService.uploadImage(file); // ← normalized return
                    updateSetting('service_page_hero_image', url);
                  } catch (error: any) {
                    console.error('Upload failed:', error);
                    alert(error?.message || 'Failed to upload image');
                  }
                }}

              />
            </div>
          </CardContent>
        </Card>



{/* Gallery Page Hero Image */}
<Card>
  <CardHeader>
    <CardTitle>Gallery Page Hero Image</CardTitle>
    <CardDescription>
      Background image and text for the Gallery page hero section
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Image URL + Upload */}
    <div className="space-y-2">
      <Label htmlFor="gallery_page_hero_image">Hero Image URL</Label>
      <div className="flex gap-2">
        <Input
          id="gallery_page_hero_image"
          value={settings.gallery_page_hero_image || ""}
          onChange={(e) => updateSetting("gallery_page_hero_image", e.target.value)}
          placeholder="https://res.cloudinary.com/.../gallery-hero.jpg"
        />
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => document.getElementById("galleryHeroImageInput")?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
      <input
        id="galleryHeroImageInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const { url } = await apiService.uploadImage(file);
            updateSetting("gallery_page_hero_image", url);
          } catch (error: any) {
            console.error("Upload failed:", error);
            alert(error?.message || "Failed to upload image");
          } finally {
            // reset file input so choosing the same file again re-triggers change
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
    </div>

    {/* Optional Title/Sub-title (shown over the hero) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="gallery_page_hero_title">Hero Title</Label>
        <Input
          id="gallery_page_hero_title"
          value={settings.gallery_page_hero_title || ""}
          onChange={(e) => updateSetting("gallery_page_hero_title", e.target.value)}
          placeholder="Gallery"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gallery_page_hero_subtitle">Hero Subtitle</Label>
        <Input
          id="gallery_page_hero_subtitle"
          value={settings.gallery_page_hero_subtitle || ""}
          onChange={(e) => updateSetting("gallery_page_hero_subtitle", e.target.value)}
          placeholder="Explore our ambience, rooms, and wellness experience."
        />
      </div>
    </div>
  </CardContent>
</Card>





        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Links to social media profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url || ''}
                  onChange={(e) => updateSetting('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/Velorathaispa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url || ''}
                  onChange={(e) => updateSetting('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/Velorathaispa"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}