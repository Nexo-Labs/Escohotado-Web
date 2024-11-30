import { COLLECTION_SLUG_ARTICLE_PDF, COLLECTION_SLUG_ARTICLE_WEB } from "@/collections/config";
import { getCurrentUser, getPayload } from "@/utils/payload";
import { ContentWrapper, H2, ArticleCard } from "gaudi/server";
import { ArticlePdf, ArticleWeb, Media, Taxonomy } from "payload-types";
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { AutorBarSSR } from "@/components/autor_bar_ssr";
import { TemaBarSSR } from "@/components/tema_bar_ssr";
import { PaginationBarNuqs } from "@/components/pagination_bar_nuqs";
import { ContentGridList } from "gaudi/server";

export const pageSize = 10;

export const searchContentParamsCache = createSearchParamsCache({
  page: parseAsString.withDefault(''),
	autor: parseAsString.withDefault(''),
	temas: parseAsString.withDefault('')
})
  
type CommonArticle = (ArticlePdf | ArticleWeb) & { 
  type: string;
  url?: string | null 
};
interface Props {
	searchParams: Record<string, string>;
}

const Page = async ({ searchParams }: Props) => {
  const payload = await getPayload();
  const { autor, temas, page } = await searchContentParamsCache.parse(searchParams)
  const [user, articlesPDF, articlesWeb] = await Promise.all([
    getCurrentUser(payload),
    payload.find({
      collection: COLLECTION_SLUG_ARTICLE_PDF,
      sort: "-publishedAt"
    }),
    payload.find({
      collection: COLLECTION_SLUG_ARTICLE_WEB,
      sort: "-publishedAt"
    })
  ]);
  const temasArray = temas.split(',').filter(Boolean)

  const startIndex = (parseInt(page ?? "1") - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const articlesPDFWithType = articlesPDF.docs.map(article => ({
    ...article,
    type: COLLECTION_SLUG_ARTICLE_PDF
  }));
  
  const articlesWebWithType = articlesWeb.docs.map(article => ({
    ...article,
    type: COLLECTION_SLUG_ARTICLE_WEB,
    url: `/articulos/${article.slug}`
  }));

  let articles = [...articlesPDFWithType, ...articlesWebWithType]
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    })
    .filter(article => {
      const evalAutorFilter = autor === null || article.seeds?.includes(autor)
      const evalTemaFilter = temasArray.length === 0 || temasArray.every(seed => article.seeds?.includes(seed))
      return evalAutorFilter && evalTemaFilter
    });
  const maxPage = Math.ceil(articles.length / pageSize);
  articles = articles.slice(startIndex, endIndex);

  return (
    <ContentWrapper
      className=""
      backgroundClassname="bg-white"
    >
      <H2 label="Artículos" />
      <div className="flex flex-row gap-x-2">
        <AutorBarSSR 
          selectedTags={autor ? autor.split(',').filter(Boolean) : []}
        />
        <TemaBarSSR 
          selectedTags={temas ? temas.split(',').filter(Boolean) : []}
        />
      </div>
      <div>
        <ContentGridList
          items={articles}
          renderBox={(article: CommonArticle, index) => (
            <ArticleCard
              key={index}
              title={article.title ?? "No title"}
              href={article.url ?? "#"}
              publishedAt={article.publishedAt as string}
              coverHref={(article.cover as Media | null)?.url ?? "#"}
              textLink={article.type === COLLECTION_SLUG_ARTICLE_PDF ? "Descargar" : "Leer más"}
              categories={article.categories as Taxonomy[]}
              hasPermission={true}
            />
          )}
        />
      </div>
      <PaginationBarNuqs maxPage={maxPage} />

    </ContentWrapper>
  );
};

export default Page;

