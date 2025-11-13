export interface BlogRow {
  id: string;
  cast_id: string;
  title: string;
  content: string;
  created_at: string;
  blog_images?: { image_url: string }[];
  blog_tags?: { tag: string }[];
}