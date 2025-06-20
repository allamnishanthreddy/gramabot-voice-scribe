import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const imageFile = formData.get('image') as File
    
    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Convert image to base64 for processing
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    
    // For now, we'll use a simple text extraction simulation
    // In production, you would integrate with services like:
    // - Google Vision API
    // - Azure Computer Vision
    // - AWS Textract
    // - Tesseract.js
    
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock extracted text based on image analysis
    const mockExtractedText = `Document Text Extracted Successfully

This is extracted text from your uploaded image.
The OCR service has processed the document and identified the following content:

[Actual text content would be extracted here using a real OCR service]

Image processed: ${imageFile.name}
File size: ${Math.round(imageFile.size / 1024)}KB
Processing completed at: ${new Date().toLocaleString()}

Note: This is a backend-processed result from Supabase Edge Function.`

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedText: mockExtractedText,
        fileName: imageFile.name,
        fileSize: imageFile.size
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process image' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
