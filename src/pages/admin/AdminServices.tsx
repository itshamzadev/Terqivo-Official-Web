import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Eye, Upload, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/src/components/ui/dialog";
import { toast } from "sonner";
import { assetUrl } from "@/src/lib/utils";
import { ProgressiveImage } from "@/src/components/ui/progressive-image";

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  image?: string;
  category?: string;
  status: "published" | "draft";
  published?: boolean;
  featured: boolean;
  sortOrder?: number;
}

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageValue, setImageValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const { register, handleSubmit, reset, setValue } = useForm<any>();

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services/admin");
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to load services");
      setServices(result.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchServices(); }, []);

  const clearImageState = () => {
    setImageValue("");
    setSelectedImage(null);
    setImagePreview("");
    setRemoveImage(false);
    setImageError("");
  };

  const openEdit = (service: Service) => {
    setEditingId(service._id);
    Object.entries(service).forEach(([key, value]) => setValue(key, value));
    setImageValue(service.image || "");
    setImagePreview(service.image ? assetUrl(service.image) : "");
    setSelectedImage(null);
    setRemoveImage(false);
    setImageError("");
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    reset();
    clearImageState();
    setValue("status", "draft");
    setValue("published", false);
    setValue("featured", false);
    setIsOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) {
      setImageError("Only JPG, PNG, and WEBP images are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("The image must be 5MB or smaller.");
      return;
    }
    setImageError("");
    setRemoveImage(false);
    setSelectedImage(file);
    setImageValue("");
    setImagePreview(URL.createObjectURL(file));
  };

  const removeCurrentImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setImageValue("");
    setRemoveImage(true);
    setImageError("");
  };

  const handleImageUrlChange = (value: string | React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = typeof value === "string" ? value : value.target.value;
    setImageValue(nextValue);
    setSelectedImage(null);
    setImagePreview(nextValue ? assetUrl(nextValue, "services") : "");
    setRemoveImage(!nextValue);
    if (!nextValue || nextValue.startsWith("/uploads/") || nextValue.startsWith("uploads/")) {
      setImageError("");
      return;
    }
    try {
      const parsed = new URL(nextValue);
      setImageError(parsed.protocol === "http:" || parsed.protocol === "https:" ? "" : "Use an HTTP(S) image URL.");
    } catch {
      setImageError("Use a valid HTTP(S) image URL or an uploaded image.");
    }
  };

  const onSubmit = async (data: any) => {
    if (isSaving) return;
    setIsSaving(true);
    setImageError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, String(value));
    });
    if (selectedImage) formData.append("image", selectedImage);
    else if (removeImage) formData.append("removeImage", "true");
    else if (imageValue) formData.append("image", imageValue);
    try {
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const res = await fetch(url, { method: editingId ? "PUT" : "POST", body: formData });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Could not save service");
      setIsOpen(false);
      reset();
      clearImageState();
      setEditingId(null);
      await fetchServices();
      toast.success(editingId ? "Service updated" : "Service created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Could not delete service");
      await fetchServices();
      toast.success("Service deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-3xl font-heading font-bold tracking-tight">Services</h2><p className="text-muted-foreground">Manage your core company services.</p></div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}><DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Service</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingId ? "Edit Service" : "Add New Service"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Service Image</label><div className="flex flex-wrap items-center gap-4">{imagePreview ? <div className="relative"><ProgressiveImage src={imagePreview} alt="Service preview" frameClassName="h-24 w-36 rounded-md border" className="h-full w-full object-cover" /><button type="button" onClick={removeCurrentImage} className="absolute -right-2 -top-2 rounded-full bg-background border p-1" aria-label="Remove service image"><X className="h-3 w-3" /></button></div> : <div className="h-24 w-36 rounded-md border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">No image</div>}<label className="flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm"><Upload className="h-4 w-4" /> Choose image<input type="file" name="image" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageChange} className="hidden" disabled={isSaving} /></label>{(imageValue || imagePreview) && <Button type="button" variant="outline" size="sm" onClick={removeCurrentImage} disabled={isSaving}>Remove image</Button>}</div><Input value={imageValue} onChange={(event) => handleImageUrlChange(event)} placeholder="Or paste an external image URL" disabled={isSaving} />{imageError && <p className="text-sm text-destructive">{imageError}</p>}<p className="text-xs text-muted-foreground">JPG, PNG, or WEBP up to 5MB.</p></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-sm font-medium">Service Title</label><Input {...register("title", { required: true })} placeholder="e.g. Cloud Infrastructure" /></div><div className="space-y-2"><label className="text-sm font-medium">Slug</label><Input {...register("slug")} placeholder="Generated if empty" /></div></div>
              <div className="grid grid-cols-3 gap-4"><div className="space-y-2"><label className="text-sm font-medium">Category</label><Input {...register("category")} /></div><div className="space-y-2"><label className="text-sm font-medium">Icon (optional)</label><Input {...register("icon")} /></div><div className="space-y-2"><label className="text-sm font-medium">Sort order</label><Input type="number" {...register("sortOrder")} /></div></div>
              <div className="space-y-2"><label className="text-sm font-medium">Short Description</label><Input {...register("shortDescription", { required: true })} placeholder="Brief summary of the service" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Full Description</label><textarea {...register("fullDescription")} rows={5} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Detailed description" /></div>
              <div className="flex items-center gap-5"><label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("featured")} /> Feature on homepage</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("published")} /> Published</label></div>
              <DialogFooter><Button type="submit" disabled={isSaving || Boolean(imageError)}>{isSaving ? "Saving..." : "Save Service"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0"><div className="rounded-md border overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b"><tr><th className="px-6 py-4">Service</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={3} className="px-6 py-8 text-center">Loading services...</td></tr> : services.length === 0 ? <tr><td colSpan={3} className="px-6 py-8 text-center">No services found.</td></tr> : services.map((service) => <tr key={service._id} className="border-b last:border-0 hover:bg-muted/30"><td className="px-6 py-4"><div className="flex items-center gap-3">{service.image && <ProgressiveImage src={assetUrl(service.image)} alt="" frameClassName="h-10 w-14 rounded" className="h-full w-full object-cover" />}<div><p className="font-medium">{service.title}</p><p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">{service.shortDescription}</p></div>{service.featured && <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">Featured</span>}</div></td><td className="px-6 py-4"><span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{service.status}</span></td><td className="px-6 py-4 text-right whitespace-nowrap"><Button variant="ghost" size="icon" onClick={() => window.open(`/services/${service.slug}`, "_blank")}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => openEdit(service)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(service._id)}><Trash2 className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}
