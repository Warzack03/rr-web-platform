import type { PublicNewsArticle } from "@/lib/contracts/public";
import { isSafeExternalHttpUrl } from "@/lib/url-safety";

const HTML_TAG_PATTERN = /<\/?[a-z][^>]*>/i;
const MARKDOWN_IMAGE_PATTERN = /!\[[^\]]*]\([^)]+\)/;
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)]\(([^)]+)\)/g;
const STANDALONE_MARKDOWN_LINK_PATTERN = /^\[([^\]]{1,120})]\(([^)\s]+)\)(?:\s+-\s+(.{1,240}))?$/;

export type NewsBodyValidationIssue = {
  message: string;
};

export function validateNewsBodyContent(body: string): NewsBodyValidationIssue[] {
  const issues: NewsBodyValidationIssue[] = [];
  const normalizedBody = body.trim();

  if (!normalizedBody) {
    return issues;
  }

  if (HTML_TAG_PATTERN.test(normalizedBody)) {
    issues.push({
      message: "No se admite HTML libre en el contenido.",
    });
  }

  if (MARKDOWN_IMAGE_PATTERN.test(normalizedBody)) {
    issues.push({
      message: "Las imagenes internas deben seleccionarse desde media, no escribirse como Markdown.",
    });
  }

  for (const match of normalizedBody.matchAll(MARKDOWN_LINK_PATTERN)) {
    const href = match[2]?.trim() ?? "";

    if (!isSafeExternalHttpUrl(href)) {
      issues.push({
        message: "Los enlaces del contenido deben usar URL http o https validas.",
      });
      break;
    }
  }

  return issues;
}

function parseQuoteBlock(block: string): PublicNewsArticle["content"][number] {
  const lines = block
    .split("\n")
    .map((line) => line.replace(/^>\s?/, "").trim())
    .filter(Boolean);
  const attributionLine = lines.at(-1);
  const hasAttribution = attributionLine?.startsWith("-- ") || attributionLine?.startsWith("— ");
  const quoteLines = hasAttribution ? lines.slice(0, -1) : lines;

  return {
    type: "quote",
    text: quoteLines.join(" "),
    attribution: hasAttribution
      ? attributionLine?.replace(/^(--|—)\s*/, "")
      : undefined,
  };
}

function parseStandaloneLinkBlock(block: string): PublicNewsArticle["content"][number] | null {
  const match = block.match(STANDALONE_MARKDOWN_LINK_PATTERN);

  if (!match) {
    return null;
  }

  const href = match[2]?.trim() ?? "";

  if (!isSafeExternalHttpUrl(href)) {
    return null;
  }

  return {
    type: "link",
    label: match[1]?.trim() ?? href,
    href,
    description: match[3]?.trim(),
    external: true,
  };
}

function parseTextBlock(block: string): PublicNewsArticle["content"][number] {
  if (block.startsWith("## ")) {
    return {
      type: "heading",
      text: block.replace(/^##\s+/, "").trim(),
    };
  }

  if (block.startsWith(">")) {
    return parseQuoteBlock(block);
  }

  const linkBlock = parseStandaloneLinkBlock(block);

  if (linkBlock) {
    return linkBlock;
  }

  return {
    type: "paragraph",
    text: block.replace(/\s*\n\s*/g, " ").trim(),
  };
}

export function buildPublicNewsContentBlocks(
  body: string,
  externalVideoUrl: string | null,
): PublicNewsArticle["content"] {
  const blocks: PublicNewsArticle["content"] = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseTextBlock);

  if (externalVideoUrl) {
    blocks.push({
      type: "link",
      label: "Ver video",
      href: externalVideoUrl,
      description: "Video externo asociado a la noticia.",
      external: true,
    });
  }

  return blocks.length > 0
    ? blocks
    : [
        {
          type: "paragraph",
          text: "Contenido pendiente de ampliar.",
        },
      ];
}

