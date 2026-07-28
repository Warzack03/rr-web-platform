import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPublicNewsContentBlocks,
  validateNewsBodyContent,
} from "@/server/services/news-content-policy";

describe("news content policy", () => {
  it("builds structured blocks from restricted editorial syntax", () => {
    const blocks = buildPublicNewsContentBlocks(
      [
        "## Cronica del partido",
        "",
        "Primer parrafo de la noticia.",
        "",
        "> Una frase destacada.",
        "> -- Cuerpo tecnico",
        "",
        "[Acta oficial](https://example.com/acta) - Referencia externa",
      ].join("\n"),
      "https://youtube.com/watch?v=abc123",
    );

    assert.deepEqual(
      blocks.map((block) => block.type),
      ["heading", "paragraph", "quote", "link", "link"],
    );
    assert.equal(blocks[0]?.type === "heading" ? blocks[0].text : "", "Cronica del partido");
    assert.equal(blocks[2]?.type === "quote" ? blocks[2].attribution : "", "Cuerpo tecnico");
    assert.equal(blocks[3]?.type === "link" ? blocks[3].href : "", "https://example.com/acta");
  });

  it("rejects unsafe HTML, markdown images and non-http links", () => {
    const issues = validateNewsBodyContent(
      [
        "<script>alert(1)</script>",
        "",
        "![Foto](https://example.com/foto.webp)",
        "",
        "[Malo](javascript:alert(1))",
      ].join("\n"),
    );

    assert.equal(issues.length, 3);
    assert.equal(issues.some((issue) => issue.message.includes("HTML")), true);
    assert.equal(issues.some((issue) => issue.message.includes("imagenes")), true);
    assert.equal(issues.some((issue) => issue.message.includes("http o https")), true);
  });

  it("keeps empty body valid when an external video exists", () => {
    const blocks = buildPublicNewsContentBlocks("", "https://vimeo.com/123");

    assert.equal(blocks.length, 1);
    assert.equal(blocks[0]?.type, "link");
  });
});

