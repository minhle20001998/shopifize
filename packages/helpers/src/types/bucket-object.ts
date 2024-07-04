export interface BucketObject {
  id: string
  isDir: boolean
  name: string
  originalName: string
  thumbnailUrl?: string
  downloadUrl?: string
  size?: number
  modDate?: Date
}