"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type GalleryImage = {
  _id: string;
  url: string;
  title?: string;
  caption?: string;
  alt?: string;
  tags?: string[];
  isPublished?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

type AdminListResponse = {
  success: boolean;
  data: GalleryImage[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const PAGE_SIZE = 30;

export default function GalleryAdminPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  // Upload dialog state
  const [openUpload, setOpenUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function load(pageArg = page) {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("page", String(pageArg));
      qs.set("limit", String(PAGE_SIZE));
      if (search.trim()) qs.set("search", search.trim());
      if (tag.trim()) qs.set("tag", tag.trim());

      const res = await fetch(`/api/gallery/admin?${qs.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const json = (await res.json()) as AdminListResponse;
      if (!res.ok || !json.success) throw new Error("Failed to load");

      setList(json.data || []);
      setPage(json.pagination?.page || 1);
      setTotalPages(json.pagination?.totalPages || 1);
    } catch {
      toast({
        title: "Failed to load gallery",
        description: "Check your admin login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, []);

  async function handleUploadFiles(files: FileList | null) {
    if (!files?.length) return;

    try {
      const created: string[] = [];

      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("image", file);

        const up = await fetch("/api/upload/image", {
          method: "POST",
          body: form,
        });
        const upJson = await up.json();
        if (!up.ok || !upJson?.url) throw new Error("Upload failed");

        const create = await fetch("/api/gallery", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            url: upJson.url,
            title: file.name.replace(/\.[^.]+$/, ""),
            alt: file.name,
            isPublished: true,
          }),
        });
        const createJson = await create.json();
        if (!create.ok || !createJson?.success)
          throw new Error("Create failed");

        created.push(createJson.data?._id);
      }

      toast({
        title: "Uploaded",
        description: `${created.length} image(s) added.`,
      });
      setOpenUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await load(1);
    } catch {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error("Delete failed");
      toast({ title: "Deleted", description: "Image removed." });
      await load(page);
    } catch {
      toast({
        title: "Delete failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gallery (Admin)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload, publish, and delete gallery images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => load(1)}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button onClick={() => setOpenUpload(true)}>Add Images</Button>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Title / caption / alt…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(1)}
          />
        </div>
        <div className="sm:w-64">
          <Label htmlFor="tag">Tag (optional)</Label>
          <Input
            id="tag"
            placeholder="e.g. room"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(1)}
          />
        </div>
        <div className="sm:w-36">
          <Label>&nbsp;</Label>
          <Button className="w-full" onClick={() => load(1)} disabled={loading}>
            Apply
          </Button>
        </div>
      </div> */}

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={`sk-${i}`} className="h-56 animate-pulse bg-muted" />
            ))}
          </>
        )}

        {!loading && list.length === 0 && (
          <Card className="col-span-full p-10 text-center">
            <div className="text-lg font-medium">No images</div>
            <div className="text-sm text-muted-foreground mt-1">
              Upload images to populate the gallery.
            </div>
          </Card>
        )}

        {!loading &&
          list.map((img) => (
            <Card key={img._id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt || img.title || "gallery"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div />
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-muted-foreground">
                      Published
                    </span>
                    <Switch
                      checked={!!img.isPublished}
                      onCheckedChange={async (v) => {
                        const prev = img.isPublished;
                        img.isPublished = v;
                        setList((old) =>
                          old.map((x) => (x._id === img._id ? { ...img } : x))
                        );
                        try {
                          await fetch(`/api/gallery/${img._id}`, {
                            method: "PATCH",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ isPublished: v }),
                          });
                        } catch {
                          img.isPublished = prev;
                          setList((old) =>
                            old.map((x) => (x._id === img._id ? { ...img } : x))
                          );
                          toast({
                            title: "Failed to update",
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground truncate">
                  {img.caption}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(img._id)}
                    className="h-8 px-3 text-xs ml-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => load(page - 1)}
          >
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => load(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input ref={fileInputRef} type="file" accept="image/*" multiple />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenUpload(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleUploadFiles(fileInputRef.current?.files ?? null)
                }
              >
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
