
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Calendar, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Extraction {
  id: string;
  file_name: string;
  file_size: number;
  extracted_text: string;
  created_at: string;
}

const ExtractionHistory = () => {
  const [extractions, setExtractions] = useState<Extraction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExtractions = async () => {
    try {
      const { data, error } = await supabase
        .from('image_extractions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExtractions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load extraction history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteExtraction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('image_extractions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExtractions(prev => prev.filter(ext => ext.id !== id));
      toast({
        title: "Success",
        description: "Extraction deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete extraction",
        variant: "destructive",
      });
    }
  };

  const downloadText = (extraction: Extraction) => {
    const blob = new Blob([extraction.extracted_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-${extraction.file_name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchExtractions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extraction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Extraction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {extractions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No extractions yet. Upload an image to get started!
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {extractions.map((extraction) => (
                <Card key={extraction.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{extraction.file_name}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(extraction.created_at).toLocaleDateString()}
                          </span>
                          <span>{Math.round(extraction.file_size / 1024)}KB</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadText(extraction)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteExtraction(extraction.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm max-h-32 overflow-y-auto">
                      {extraction.extracted_text.substring(0, 200)}
                      {extraction.extracted_text.length > 200 && '...'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtractionHistory;
