import { AuthService } from './auth';

class ApiService {
  private baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002'}/api`;

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Authentication
  async login(email: string, password: string) {
    return AuthService.login(email, password);
  }

  // Services
  async getServices() {
    return this.request('/services');
  }

  async getFeaturedServices() {
    return this.request('/services/featured');
  }

  async getService(slug: string) {
    return this.request(`/services/${slug}`);
  }

  async createService(serviceData: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, serviceData: any) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Memberships
  async getMemberships() {
    return this.request('/memberships');
  }

  async createMembership(membershipData: any) {
    return this.request('/memberships', {
      method: 'POST',
      body: JSON.stringify(membershipData),
    });
  }

  async updateMembership(id: string, membershipData: any) {
    return this.request(`/memberships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(membershipData),
    });
  }

  async deleteMembership(id: string) {
    return this.request(`/memberships/${id}`, {
      method: 'DELETE',
    });
  }

  // Testimonials
  async getTestimonials() {
    return this.request('/testimonials');
  }

  async createTestimonial(testimonialData: any) {
    return this.request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  }

  async updateTestimonial(id: string, testimonialData: any) {
    return this.request(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  }

  async deleteTestimonial(id: string) {
    return this.request(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings() {
    return this.request('/settings');
  }

  async updateSetting(key: string, value: string) {
    return this.request(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async updateSettings(settings: Record<string, string>) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Homepage Content
  async getHomepageContent() {
    return this.request('/homepage');
  }

  async updateHomepageContent(content: any) {
    return this.request('/homepage', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  // About Content
  async getAboutContent() {
    return this.request('/about');
  }

  async updateAboutContent(content: any) {
    return this.request('/about', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

// src/lib/api.ts
async uploadImage(file: File): Promise<{ url: string }> {
  const MAX_MB = 10; // match your UI copy
  if (!file) throw new Error('Please select an image file.');
  if (!file.type?.startsWith('image/')) throw new Error('Please select a valid image file.');
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`Image is too large. Max ${MAX_MB} MB.`);

  const formData = new FormData();
  formData.append('image', file);

  let res: Response;
  try {
    // ALWAYS hit the Next proxy on same origin
    res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        ...AuthService.getAuthHeaders(), // ok to include; backend may require admin token
        // DO NOT set Content-Type manually for FormData
      },
      body: formData,
    });
  } catch {
    throw new Error('Network error while uploading.');
  }

  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { message: text || res.statusText }; }

  if (!res.ok) {
    const status = res.status;
    let msg = data?.message || data?.error || 'Upload failed';
    if (status === 413) msg = 'Image too large.';
    else if (status === 415) msg = 'Unsupported media type.';
    else if (status === 400 || status === 422) msg = `Invalid image: ${msg}`;
    else if (status >= 500) msg = 'Server error during upload.';
    const e = new Error(msg) as Error & { status?: number };
    e.status = status;
    throw e;
  }

  // ✅ Only ever return { url }
  const url: string | undefined =
    data?.url ??
    data?.data?.url ??
    data?.secure_url ??
    data?.data?.secure_url;

  if (!url) {
    // surface the payload to make debugging obvious, but don't throw a vague message
    console.error('Upload response missing url:', data);
    throw new Error('Upload succeeded but no URL returned.');
  }

  return { url };
}


  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${this.baseURL}/upload/images`, {
      method: 'POST',
      headers: {
        ...AuthService.getAuthHeaders(),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  async deleteImage(publicId: string) {
    return this.request(`/upload/image/${publicId}`, {
      method: 'DELETE',
    });
  }

  async getCategoriesAdmin() {
    return this.request('/categories/admin');
  }

  // Articles
  async getArticles() {
    return this.request('/articles');
  }

  async getArticle(slug: string) {
    return this.request(`/articles/${slug}`);
  }

  async createArticle(articleData: any) {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id: string, articleData: any) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Article Categories
  async getArticleCategories() {
    return this.request('/article-categories');
  }

  async getArticleCategoriesAdmin() {
    return this.request('/article-categories/admin');
  }

  async createArticleCategory(categoryData: any) {
    return this.request('/article-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateArticleCategory(id: string, categoryData: any) {
    return this.request(`/article-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteArticleCategory(id: string) {
    return this.request(`/article-categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Member Registrations
  async getMemberRegistrations() {
    return this.request('/member-registrations');
  }

  async createMemberRegistration(registrationData: any) {
    return this.request('/member-registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  async updateMemberRegistrationStatus(id: string, status: string) {
    return this.request(`/member-registrations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteMemberRegistration(id: string) {
    return this.request(`/member-registrations/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async getBookings(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search
    });
    return this.request(`/bookings?${params}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();