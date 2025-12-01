"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AuthService } from "@/lib/auth";
import { apiService } from "@/lib/api";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Search,
  ArrowLeft
} from "lucide-react";

interface ArticleCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  // author: string;
  published: boolean;
  publishedAt?: string;
  category: ArticleCategory;
  createdAt: string;
}

export default function AddedArticlesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AuthService.verifyToken();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        router.push("/cms");
        return;
      }

      await loadArticles();
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      
      article.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [articles, searchTerm]);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles/admin', {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
        },
      });

      const data = await response.json();
      console.log('Articles data:', data); // Debug log
      if (data.success) {
        setArticles(data.data || []);
      } else {
        console.error('API returned error:', data);
        setArticles([]);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
      setArticles([]);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await apiService.deleteArticle(articleId);
      await loadArticles(); // Reload data
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article');
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
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  Manage Articles
                </h1>
                <p className="text-sm text-gray-600">
                  Full CRUD operations for all articles
                </p>
              </div>
            </div>
            <Button onClick={() => router.push("/cms/dashboard/articles/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No articles found' : 'No articles yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Create your first article to get started.'}
                </p>
                <Button onClick={() => router.push("/cms/dashboard/articles/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Article
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article) => (
              <Card key={article._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {article.title}
                        </h3>
                        <Badge variant={article.published ? "default" : "secondary"}>
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {/* <span>By {article.author}</span> */}
                        <span>{article.category?.name || 'No Category'}</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/articles/${article.category.slug}/${article.slug}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/cms/dashboard/articles/${article.slug}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.slug)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}