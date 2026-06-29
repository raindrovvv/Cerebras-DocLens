import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    if (file.type.startsWith("image/")) {
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        fileName: file.name,
        pageCount: 1,
        pages: [{
          pageNum: 1,
          text: `[IMAGE PAGE 1: ${file.name}. Analyze the attached visual document image together with any visible text, layout, signatures, stamps, tables, charts, and warning labels.]`
        }],
        visualPages: [{
          pageNum: 1,
          mimeType: file.type,
          dataUrl
        }],
        inputMode: "image",
        isLikelyScanned: false
      });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF or image files are supported" }, { status: 400 });
    }

    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();

    const pages = parsed.pages.map((page: any) => ({
      pageNum: page.num,
      text: page.text
    }));

    // Check if extracted text is meaningful (not a scanned image-only PDF)
    const totalTextLength = pages.reduce((acc, p) => acc + p.text.trim().length, 0);
    const isLikelyScanned = totalTextLength < 100 && parsed.total > 0;

    return NextResponse.json({
      fileName: file.name,
      pageCount: parsed.total,
      pages: pages,
      visualPages: [],
      inputMode: "pdf",
      isLikelyScanned
    });
  } catch (error) {
    console.error("PDF parsing endpoint error:", error);
    return NextResponse.json({ error: "Failed to parse PDF document" }, { status: 500 });
  }
}
