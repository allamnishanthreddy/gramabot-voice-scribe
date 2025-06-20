
-- Create a table to store image processing history
CREATE TABLE public.image_extractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.image_extractions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage their own extractions
CREATE POLICY "Users can view their own extractions" 
  ON public.image_extractions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own extractions" 
  ON public.image_extractions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own extractions" 
  ON public.image_extractions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own extractions" 
  ON public.image_extractions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a storage bucket for uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('document-images', 'document-images', false);

-- Create storage policies for the bucket
CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'document-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'document-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'document-images' AND auth.uid()::text = (storage.foldername(name))[1]);
