import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Eye, Upload } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/src/components/ui/dialog";
import { toast } from "sonner";
import { assetUrl, formatPrice } from "@/src/lib/utils";

interface Course {
  _id: string; title: string; slug: string; category?: string; shortDescription?: string; summary?: string;
  fullDescription?: string; description?: string; image?: string; coverImage?: string; thumbnail?: string;
  price?: number; currencyId?: string; enrollmentStatus?: "open" | "closed"; limitedSeats?: boolean;
  totalSeats?: number; remainingSeats?: number; level?: string; format?: string; learningMode?: string;
  duration?: string; status?: string; published?: boolean; featured?: boolean;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [courseImage, setCourseImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<any>();

  const fetchData = async () => {
    try {
      const [courseRes, currencyRes] = await Promise.all([fetch("/api/courses/admin"), fetch("/api/currencies/active")]);
      const courseData = await courseRes.json();
      const currencyData = await currencyRes.json();
      if (!courseRes.ok) throw new Error(courseData.message || "Failed to load courses");
      setCourses(courseData.data || []);
      setCurrencies(currencyData.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load courses");
    } finally { setIsLoading(false); }
  };

  useEffect(() => { void fetchData(); }, []);

  const openEdit = (course: Course) => {
    setEditingId(course._id);
    Object.entries({ ...course, shortDescription: course.shortDescription || course.summary, fullDescription: course.fullDescription || course.description, format: course.format || course.learningMode, published: course.published ?? (course.status === "published" || course.status === "active") }).forEach(([key, value]) => setValue(key, value));
    setCourseImage(course.image || course.coverImage || course.thumbnail || "");
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null); reset(); setCourseImage("");
    setValue("enrollmentStatus", "open"); setValue("status", "draft"); setValue("published", false); setValue("featured", false); setValue("limitedSeats", false);
    setIsOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { toast.error("Use a JPG, PNG, or WEBP image up to 5MB."); return; }
    setIsUploading(true);
    try {
      const formData = new FormData(); formData.append("file", file);
      const res = await fetch("/api/upload?type=course", { method: "POST", body: formData });
      const result = await res.json(); if (!res.ok || !result.success) throw new Error(result.message || "Upload failed");
      setCourseImage(result.data.url); toast.success("Course image uploaded");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Upload failed"); }
    finally { setIsUploading(false); }
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data, image: courseImage, price: data.price === "" ? 0 : Number(data.price), totalSeats: data.totalSeats === "" ? undefined : Number(data.totalSeats), remainingSeats: data.remainingSeats === "" ? undefined : Number(data.remainingSeats),
      shortDescription: data.shortDescription || "", fullDescription: data.fullDescription || "", format: data.format || "",
      published: Boolean(data.published), featured: Boolean(data.featured), limitedSeats: Boolean(data.limitedSeats),
    };
    try {
      const res = await fetch(editingId ? `/api/courses/${editingId}` : "/api/courses", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await res.json(); if (!res.ok || !result.success) throw new Error(result.message || "Could not save course");
      setIsOpen(false); reset(); await fetchData(); toast.success(editingId ? "Course updated" : "Course created");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save course"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" }); const result = await res.json();
    if (res.ok && result.success) { await fetchData(); toast.success("Course deleted"); } else toast.error(result.message || "Could not delete course");
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><h2 className="text-3xl font-heading font-bold tracking-tight">Courses</h2><p className="text-muted-foreground">Manage educational courses and programs.</p></div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}><DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Course</Button></DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingId ? "Edit Course" : "Add New Course"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">Course Image</label><div className="flex gap-4 items-center">{courseImage && <img src={assetUrl(courseImage)} alt="Course preview" className="h-20 w-28 rounded-md object-cover border" />}<label className="flex items-center gap-2 cursor-pointer text-sm border rounded-md px-3 py-2"><Upload className="h-4 w-4" />{isUploading ? "Uploading..." : "Upload image"}<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} className="hidden" disabled={isUploading} /></label></div><Input value={courseImage} onChange={(e) => setCourseImage(e.target.value)} placeholder="Or paste an image URL" /></div>
            <div className="grid md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">Title</label><Input {...register("title", { required: true })} /></div><div><label className="text-sm font-medium">Slug</label><Input {...register("slug")} placeholder="Generated if empty" /></div></div>
            <div className="grid md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">Category</label><Input {...register("category")} /></div><div><label className="text-sm font-medium">Price</label><Input type="number" min="0" step="0.01" {...register("price")} /></div></div>
            <div className="grid md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">Currency</label><select {...register("currencyId")} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="">No currency / free</option>{currencies.map((currency) => <option key={currency._id} value={currency._id}>{currency.name} ({currency.code})</option>)}</select></div><div><label className="text-sm font-medium">Duration</label><Input {...register("duration")} placeholder="8 weeks" /></div></div>
            <div className="grid md:grid-cols-3 gap-4"><div><label className="text-sm font-medium">Level</label><Input {...register("level")} /></div><div><label className="text-sm font-medium">Format</label><Input {...register("format")} placeholder="Online, Offline, Hybrid" /></div><div><label className="text-sm font-medium">Enrollment</label><select {...register("enrollmentStatus")} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="open">Open</option><option value="closed">Closed</option></select></div></div>
            <div className="grid md:grid-cols-3 gap-4"><div className="flex items-center gap-2 pt-6"><input type="checkbox" {...register("limitedSeats")} /><label className="text-sm">Limit seats</label></div><div><label className="text-sm font-medium">Total seats</label><Input type="number" min="0" {...register("totalSeats")} /></div><div><label className="text-sm font-medium">Remaining seats</label><Input type="number" min="0" {...register("remainingSeats")} /></div></div>
            <div><label className="text-sm font-medium">Short Description</label><Input {...register("shortDescription")} /></div><div><label className="text-sm font-medium">Full Description</label><textarea {...register("fullDescription")} rows={6} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
            <div className="flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("published")} /> Published</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("featured")} /> Featured</label></div>
            <DialogFooter><Button type="submit">Save Course</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    <Card><CardContent className="p-0"><div className="rounded-md border overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b"><tr><th className="px-6 py-4">Course</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Visibility</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={4} className="px-6 py-8 text-center">Loading courses...</td></tr> : courses.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center">No courses found.</td></tr> : courses.map((course) => <tr key={course._id} className="border-b last:border-0 hover:bg-muted/30"><td className="px-6 py-4"><div className="flex items-center gap-3">{(course.image || course.coverImage || course.thumbnail) && <img src={assetUrl(course.image || course.coverImage || course.thumbnail)} alt="" className="h-10 w-14 object-cover rounded" />}<div><p className="font-medium">{course.title}</p><p className="text-xs text-muted-foreground">{course.shortDescription || course.summary}</p></div></div></td><td className="px-6 py-4">{course.price ? formatPrice(course.price, (course as any).currency) : "Free"}</td><td className="px-6 py-4"><span className="rounded-full bg-muted px-2 py-1 text-xs">{course.published || course.status === "active" || course.status === "published" ? "Published" : "Draft"}</span></td><td className="px-6 py-4 text-right whitespace-nowrap"><Button variant="ghost" size="icon" onClick={() => window.open(`/courses/${course.slug}`, "_blank")}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => openEdit(course)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(course._id)}><Trash2 className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div></CardContent></Card>
  </div>;
}
