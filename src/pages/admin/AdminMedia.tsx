import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Image as ImageIcon, FileText, Film, FolderOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  folder: string;
  created_at: string;
}

export function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('root');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${folder}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file);
      if (uploadError) { toast(`Failed to upload ${file.name}`, 'error'); continue; }
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      await supabase.from('media').insert({
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: isImage ? 'image' : isVideo ? 'video' : 'document',
        file_size: file.size,
        folder,
        mime_type: file.type,
      });
    }
    setUploading(false);
    toast('Upload complete', 'success');
    fetchMedia();
  };

  const remove = async (item: MediaItem) => {
    const path = item.file_url.split('/media/')[1];
    if (path) await supabase.storage.from('media').remove([path]);
    await supabase.from('media').delete().eq('id', item.id);
    toast('File deleted', 'success');
    fetchMedia();
  };

  const folders = ['root', ...new Set(items.map((i) => i.folder).filter((f) => f !== 'root'))];
  const filtered = items.filter((i) => i.folder === folder);

  const typeIcon = (type: string) => {
    if (type === 'image') return ImageIcon;
    if (type === 'video') return Film;
    return FileText;
  };

  return (
    <AdminLayout title="Media Library">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${folder === f ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700'}`}
            >
              <FolderOpen className="w-4 h-4" />
              {f}
            </button>
          ))}
        </div>
        <label className="btn-primary cursor-pointer ml-auto">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Files'}
          <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-ink-300 dark:text-ink-600" />
          <p className="text-ink-500 dark:text-ink-400 font-medium">No files in this folder</p>
          <p className="text-sm text-ink-400 mt-1">Upload images, videos, or documents</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((item, i) => {
            const Icon = typeIcon(item.file_type);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card p-3 group relative"
              >
                {item.file_type === 'image' ? (
                  <img src={item.file_url} alt={item.file_name} className="w-full aspect-square object-cover rounded-xl mb-2" />
                ) : (
                  <div className="w-full aspect-square rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-2">
                    <Icon className="w-10 h-10 text-ink-400" />
                  </div>
                )}
                <p className="text-xs text-ink-600 dark:text-ink-300 truncate font-medium">{item.file_name}</p>
                <p className="text-xs text-ink-400">{(item.file_size / 1024).toFixed(0)} KB</p>
                <button
                  onClick={() => remove(item)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
