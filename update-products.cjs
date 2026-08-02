const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminProducts.tsx', 'utf8');

// Add states
code = code.replace(
  "const { register, handleSubmit, reset, setValue } = useForm();",
  "const { register, handleSubmit, reset, setValue } = useForm();\n  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');\n  const [isUploading, setIsUploading] = useState(false);"
);

// update openEdit
code = code.replace(
  "setValue(key, (product as any)[key]);\n    });\n    setIsOpen(true);",
  "setValue(key, (product as any)[key]);\n    });\n    setThumbnailUrl(product.thumbnail || '');\n    setIsOpen(true);"
);

// update openCreate
code = code.replace(
  "setValue('featured', false);\n    setIsOpen(true);",
  "setValue('featured', false);\n    setThumbnailUrl('');\n    setIsOpen(true);"
);

// update onSubmit
code = code.replace(
  "if (!data.slug && data.name) {",
  "data.thumbnail = thumbnailUrl;\n      if (!data.slug && data.name) {"
);

// add handleUpload before return
const uploadFunc = `
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setThumbnailUrl(data.data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
`;
code = code.replace("return (\n    <div className=\"space-y-6\">", uploadFunc + "    <div className=\"space-y-6\">");

// update form UI
const formUI = `
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Image</label>
                <div className="flex items-center gap-4">
                  {thumbnailUrl && (
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-16 h-16 object-cover rounded-md border" />
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    {isUploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">`;

code = code.replace('<div className="grid grid-cols-2 gap-4">', formUI);

// add image to table
code = code.replace(
  "<p className=\"font-medium text-foreground\">{product.name}</p>",
  `{product.thumbnail ? (
                              <img src={product.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs">No img</div>
                            )}
                            <p className="font-medium text-foreground">{product.name}</p>`
);

fs.writeFileSync('src/pages/admin/AdminProducts.tsx', code);
