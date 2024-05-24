import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { GET_ADD_ARTICLES } from "@/constants/API";

import axios from "axios";
import { ExternalLinkIcon, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

const AllArticlesContent = () => {
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [alphabet, setAlphabet] = useState("A");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  async function fetchArticle() {
    if (articleList.length === 0) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.nhs.uk/conditions/?category=${alphabet}`,
          {
            withCredentials: false,
            headers: {
              "subscription-key": "408df23460624fc6806a8069c087e7c0",
            },
          }
        );
        const articles = response.data.significantLink;
        setArticleList(articles);
        console.log(articles);
        await shuffleArticles(articles); // Pass the fetched articles to shuffle
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      await shuffleArticles(articleList);
      setLoading(false);
    }
  }

async function shuffleArticles(articles: Article[]) {
    const shuffledArticles = [...articles]; // Create a copy of the original array
    for (let i = shuffledArticles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate random index
        // Swap elements at i and j
        const temp = shuffledArticles[i];
        shuffledArticles[i] = shuffledArticles[j];
        shuffledArticles[j] = temp;
    }
    setArticleList(shuffledArticles);
}

  function GetArticle(url: string) {
    const convertedURL = ConvertURL(url)
    window.open(convertedURL, "_blank");
  }

  function ConvertURL(url:string | undefined){
    return url?.replace("api", "www");
  }

  useEffect(() => {
    setArticleList([]);
  }, [alphabet]);

  const generateAlphabet = () => {
    const letters = [];
    for (let i = 65; i <= 90; i++) {
      letters.push(String.fromCharCode(i));
    }
    return letters;
  };

  function ApproveArticle (article: Article | null) {
    client.post(GET_ADD_ARTICLES, {
        'title': article?.name,
        'description': article?.description,
        'URL': ConvertURL(article?.url)
    }).then(() => {
        setDialogOpen(false);
        toast.success("Article Approved Successfully");
    }).catch((err) => {
        console.log(err);
        toast.error("Article has been already approved");
    })
  }

  function CloseDialog() {
    setDialogOpen(false);
    setSelectedArticle(null);
  }

  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="flex gap-4 items-center">
        <span className="text-xl font-bold">Articles From NHS:</span>
        <Select value={alphabet} onValueChange={setAlphabet}>
          <SelectTrigger className="w-2/12">
            {alphabet || "Select Alphabet"}
          </SelectTrigger>
          <SelectContent>
            {generateAlphabet().map((letter) => (
              <SelectItem key={letter} value={letter} className="py-2">
                {letter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <RefreshCcw
          size={20}
          className="cursor-pointer"
          onClick={fetchArticle}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6 ">
          {articleList.map((article, index) => (
            <Card className="p-4 flex flex-col justify-between" key={index}>
              <div>
                <span className="text-lg font-medium">{article.name}</span>
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
                      GetArticle(article.url);
                    }}
                  >
                    Visit website
                    <ExternalLinkIcon size={14} />{" "}
                  </Button>
                  <Dialog open={dialogOpen} onOpenChange={() => CloseDialog()} >
                    <Button className="w-1/3 h-9" onClick={() => {setDialogOpen(true); setSelectedArticle(article)}}>Approve </Button>
                    <DialogContent>
                        <span className="font-semibold"> Approve this Article? </span>
                        <div className="flex flex-col gap-2 text-xs ">
                            <span>Title: {selectedArticle?.name}</span>
                            <span>Description: {selectedArticle?.description}</span>
                            <span>URL: {ConvertURL(selectedArticle?.url)}</span>
                        </div> 
                        <div className="flex justify-end">
                            <Button className="w-1/2 h-9" onClick={() => ApproveArticle(selectedArticle)}>Approve</Button>
                        </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Toaster position="top-right" theme="system" richColors />
    </div>
  );
};

export const AllArticlesPage = () => {
  return <PageBuilder mainContent={<AllArticlesContent />} />;
};
