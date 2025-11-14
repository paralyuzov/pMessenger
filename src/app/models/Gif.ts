export interface Gif {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: GifImages;
  user?: GifUser;
}

export interface GifImages {
  original: GifImageFormat;
  downsized: GifImageFormat;
  downsized_large: GifImageFormat;
  downsized_medium: GifImageFormat;
  downsized_small: GifImageFormat;
  downsized_still: GifImageFormat;
  fixed_height: GifImageFormat;
  fixed_height_downsampled: GifImageFormat;
  fixed_height_small: GifImageFormat;
  fixed_height_small_still: GifImageFormat;
  fixed_height_still: GifImageFormat;
  fixed_width: GifImageFormat;
  fixed_width_downsampled: GifImageFormat;
  fixed_width_small: GifImageFormat;
  fixed_width_small_still: GifImageFormat;
  fixed_width_still: GifImageFormat;
  looping?: GifImageFormat;
  preview?: GifImageFormat;
  preview_gif?: GifImageFormat;
  preview_webp?: GifImageFormat;
}

export interface GifImageFormat {
  url: string;
  width: string;
  height: string;
  size?: string;
  mp4?: string;
  mp4_size?: string;
  webp?: string;
  webp_size?: string;
  frames?: string;
  hash?: string;
}

export interface GifUser {
  avatar_url: string;
  banner_image: string;
  banner_url: string;
  profile_url: string;
  username: string;
  display_name: string;
  description: string;
  instagram_url: string;
  website_url: string;
  is_verified: boolean;
}

export interface GifApiResponse {
  data: Gif[];
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}
