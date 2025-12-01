"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AuthService } from "@/lib/auth";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  ArrowLeft,
  Loader2,
  Save,
  Upload
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";


interface ArticleCategory {
  _id: string;
  name: string;
  slug: string;
}

export default function NewArticlePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  // Upload success dialog state
const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string>('');
const [uploadedType, setUploadedType] = useState<'featured' | 'content' | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    published: false,
    tags: '',
    // seoTitle: '',
    // seoDescription: '',
    featuredImage: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AuthService.verifyToken();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        router.push("/cms");
        return;
      }

      await loadCategories();
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadCategories = async () => {
    try {
      const response = await apiService.getArticleCategories();
      if (response && response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Invalid categories response:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File, type: 'featured') => {
    const MAX_MB = 10;
    if (!file) { toast({ title: "No file selected", variant: "destructive" }); return; }
    if (!file.type?.startsWith('image/')) { toast({ title: "Invalid file", description: "Please select an image.", variant: "destructive" }); return; }
    if (file.size > MAX_MB * 1024 * 1024) { toast({ title: "Image too large", description: `Max ${MAX_MB} MB allowed.`, variant: "destructive" }); return; }

    try {
      toast({ title: "Uploading...", description: "Please wait while we upload your image." });

      const { url } = await apiService.uploadImage(file);

      setFormData(prev => ({ ...prev, featuredImage: url }));
      toast({ title: "Cover image uploaded" });

      setUploadedPreviewUrl(url);
      setUploadedType(type);
      setIsUploadDialogOpen(true);

    } catch (err: any) {
      console.error('Failed to upload image:', err);
      toast({
        title: "Upload failed",
        description: err?.message || 'Failed to upload image.',
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await apiService.createArticle(articleData);

      toast({
        title: "Success!",
        description: "Article created successfully.",
      });

      router.push("/cms/dashboard/articles");
    } catch (error) {
      console.error('Failed to create article:', error);
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/cms/dashboard/articles")}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  Create New Article
                </h1>
                <p className="text-sm text-gray-600">
                  Add a new article to your blog
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>
                Basic information about your article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief summary of the article"
                  rows={3}
                  required
                />
              </div>

              <RichTextEditor
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Write your article content here..."
              />

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleInputChange('published', checked)}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Upload featured image and content images for your article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Featured Image */}
              <div className="space-y-2">
                <Label>Featured Image (Cover)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.featuredImage ? (
                    <div className="relative">
                      <img
                            src={formData.featuredImage}
                            alt="Featured"
                            className="w-full h-48 object-cover rounded"
                          />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="featured-image" className="cursor-pointer">
                          <span className="text-sm text-primary hover:text-primary/80">Upload featured image</span>
                          <input
                            id="featured-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'featured');
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optional SEO optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="Custom SEO title (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Custom SEO description (optional)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card> */}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/cms/dashboard/articles")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Article
            </Button>
          </div>
        </form>


        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Image uploaded</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      {uploadedPreviewUrl ? (
        <img
          src={uploadedPreviewUrl}
          alt="Uploaded preview"
          className="w-full max-h-64 object-contain rounded border"
        />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="uploaded-url">Cloudinary URL</Label>
        <div className="flex gap-2">
          <Input
            id="uploaded-url"
            value={uploadedPreviewUrl}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
          />
          <Button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(uploadedPreviewUrl);
                toast({ title: "Copied URL to clipboard" });
              } catch {
                toast({ title: "Copy failed", variant: "destructive" });
              }
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    </div>

    <DialogFooter className="mt-4">
      <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
        Close
      </Button>
      {uploadedType === 'featured' ? (
        <Button onClick={() => setIsUploadDialogOpen(false)}>
          Use as Cover
        </Button>
      ) : (
        <Button onClick={() => setIsUploadDialogOpen(false)}>
          Use in Content
        </Button>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>



      </main>
    </div>
  );
}