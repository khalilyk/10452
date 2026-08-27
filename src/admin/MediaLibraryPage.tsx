import { useEffect, useRef, useState } from 'react'
import { mergeContent, type BrandContent } from '../data/content.ts'
import {
  deleteMedia, fetchAdminContent, fetchMedia, saveAdminContentSections, uploadMedia,
  type MediaFile,
} from './adminApi.ts'
import { PageHeader } from './ui.tsx'

/**
 * Upload, browse, delete — and set a file directly as the logo or favicon,
 * which is really all "choosing a logo" ever was. Replaces the old
 * URL-text-field Logos page now that there's somewhere to upload to.
 */
export function MediaLibraryPage() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [files, setFiles] = useState<MediaFile[]>([])
  const [brand, setBrand] = useState<BrandContent | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = async () => {
    try {
      const [media, content] = await Promise.all([fetchMedia(), fetchAdminContent()])
      setConfigured(media.configured)
      setFiles(media.files)
      if (content.configured) setBrand(mergeContent(content.content as never).brand)
    } catch {
      setConfigured(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const onUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return
    setError(null)
    setUploading(true)
    for (const file of Array.from(fileList)) {
      const result = await uploadMedia(file)
      if (!result.ok) {
        setError(result.reason === 'not-configured'
          ? 'No storage bucket is attached, so this cannot be uploaded.'
          : `Upload failed for ${file.name}.`)
        break
      }
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
    refresh()
  }

  const onDelete = async (file: MediaFile) => {
    await deleteMedia(file.pathname)
    refresh()
  }

  const setAs = async (key: 'logoUrl' | 'faviconUrl', url: string) => {
    if (!brand) return
    const next = { ...brand, [key]: url }
    setBrand(next)
    await saveAdminContentSections({ brand: next })
  }

  if (configured === false) {
    return (
      <div>
        <PageHeader title="MEDIA LIBRARY" />
        <p className="max-w-md px-6 py-6 text-[12px] leading-relaxed text-ink/60">
          No storage bucket is attached. Create a public bucket named
          "10452-media" in the connected Supabase project (Storage tab), and
          this fills in automatically.
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="MEDIA LIBRARY" subtitle="PRODUCT PHOTOS, LOGOS, ARTWORK" />

      <div className="border-b-2 border-ink px-6 py-5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onUpload(e.target.files)}
          className="hidden"
          id="media-upload"
        />
        <label
          htmlFor="media-upload"
          className="inline-flex h-[44px] cursor-pointer items-center border-2 border-ink px-6 text-[11px] font-bold tracking-widest transition-colors hover:bg-ink/5"
        >
          {uploading ? 'UPLOADING…' : '+ UPLOAD IMAGES'}
        </label>
        {error && <p className="mt-3 text-[11.5px] text-liban-red">{error}</p>}
        {brand && (
          <p className="mt-3 text-[11px] leading-relaxed text-ink/50">
            Current logo: {shortName(brand.logoUrl)} · Current favicon: {shortName(brand.faviconUrl)}
          </p>
        )}
      </div>

      {configured === null ? (
        <p className="px-6 py-6 text-[11px] tracking-widest text-ink/50">LOADING…</p>
      ) : files.length === 0 ? (
        <p className="px-6 py-6 text-[12px] text-ink/50">Nothing uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((f) => (
            <div key={f.pathname} className="border-b-2 border-r-2 border-ink p-4">
              <div className="flex h-32 items-center justify-center border-2 border-ink bg-white">
                <img src={f.url} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="mt-2 truncate text-[10.5px] text-ink/60" title={f.pathname}>{f.pathname}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button type="button" onClick={() => setAs('logoUrl', f.url)} className="border border-ink px-2 py-1 text-[9.5px] tracking-widest hover:bg-ink/5">
                  SET LOGO
                </button>
                <button type="button" onClick={() => setAs('faviconUrl', f.url)} className="border border-ink px-2 py-1 text-[9.5px] tracking-widest hover:bg-ink/5">
                  SET FAVICON
                </button>
                <button type="button" onClick={() => onDelete(f)} className="border border-ink px-2 py-1 text-[9.5px] tracking-widest text-liban-red hover:bg-ink/5">
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function shortName(url: string) {
  if (!url) return 'none'
  return url.split('/').pop() || url
}
