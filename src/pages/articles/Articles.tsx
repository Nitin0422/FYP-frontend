import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GET_ADD_ARTICLES, GET_DELETE_ARTICLES } from "@/constants/API";
import useAuth from "@/context/AuthContext";
import { ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

type ArticleLocal = {
    id: number;
    title: string;
    description: string;
    URL: string;
}

const ArticlesContent = () => {
  const [articleList, setArticleList] = useState<ArticleLocal[]>([]);
  const { role } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleLocal | null>(null);
  const [fetchData, setFetchData] = useState(true);

  useEffect(() => {
    if (fetchData) {
        client
      .get(GET_ADD_ARTICLES)
      .then((response) => {
        setArticleList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    setFetchData(false);
    
  }, [fetchData]);

  function GetArticle(url: string) {
    const convertedURL = ConvertURL(url);
    window.open(convertedURL, "_blank");
  }

  function ConvertURL(url: string | undefined) {
    return url?.replace("api", "www");
  }

  function CloseDialog() {
    setDialogOpen(false);
    setSelectedArticle(null);
  }
  function DeleteArticle() {
    if (selectedArticle) {
      client
        .delete(GET_DELETE_ARTICLES + selectedArticle.id)
        .then(() => {
          toast.success("Article deleted successfully");
          setDialogOpen(false);
          setFetchData(true);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to delete article");
        });
    }
  }

  return (
    <div className="m-3 flex flex-col gap-3">
      <span className="text-xl font-bold">Approved Articles:</span>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6 ">
        {articleList.map((article, index) => (
          <Card className="p-4 flex flex-col justify-between" key={index}>
            <div>
              <span className="text-lg font-medium">{article.title}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground text-justify ">
                {" "}
                {article.description}
              </span>
              <div className="flex  justify-between items-center gap-4">
                <Button
                  variant="outline"
                  className="w-2/3 h-10 flex gap-2 items-center"
                  onClick={() => {
                    GetArticle(article.URL);
                  }}
                >
                  Visit website
                  <ExternalLinkIcon size={14} />{" "}
                </Button>
                {role === "admin" && (
                  <Dialog open={dialogOpen} onOpenChange={() => CloseDialog()}>
                    <Button
                      variant="destructive"
                      className="w-1/3 h-9"
                      onClick={() => {
                        setDialogOpen(true);
                        setSelectedArticle(article);
                      }}
                    >
                      Delete{" "}
                    </Button>
                    <DialogContent>
                      <span className="font-semibold">
                        {" "}
                        Delete this Article?{" "}
                      </span>
                      <div className="flex flex-col gap-2 text-xs ">
                        <span>Title: {selectedArticle?.title}</span>
                        <span>Description: {selectedArticle?.description}</span>
                        <span>URL: {ConvertURL(selectedArticle?.URL)}</span>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          className="w-1/2 h-9"
                          onClick={() => DeleteArticle()}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Toaster position="top-right" richColors theme="system" />
    </div>
  );
};

export const ArticlesPage = () => {
  return <PageBuilder mainContent={<ArticlesContent />} />;
};
