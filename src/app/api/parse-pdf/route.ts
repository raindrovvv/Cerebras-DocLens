import { NextResponse } from "next/server";

export const runtime = "nodejs";

function ensurePdfRuntimePolyfills() {
  const globalScope = globalThis as any;

  if (!globalScope.DOMMatrix) {
    globalScope.DOMMatrix = class DOMMatrix {
      a = 1;
      b = 0;
      c = 0;
      d = 1;
      e = 0;
      f = 0;
      is2D = true;
      isIdentity = true;

      constructor(init?: number[] | string) {
        if (Array.isArray(init)) {
          this.a = Number(init[0] ?? 1);
          this.b = Number(init[1] ?? 0);
          this.c = Number(init[2] ?? 0);
          this.d = Number(init[3] ?? 1);
          this.e = Number(init[4] ?? 0);
          this.f = Number(init[5] ?? 0);
          this.isIdentity = this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
        }
      }

      multiplySelf() { return this; }
      preMultiplySelf() { return this; }
      translateSelf() { return this; }
      scaleSelf() { return this; }
      rotateSelf() { return this; }
      invertSelf() { return this; }
      transformPoint(point: any) { return point; }
    };
  }

  if (!globalScope.ImageData) {
    globalScope.ImageData = class ImageData {
      data: Uint8ClampedArray;
      width: number;
      height: number;

      constructor(dataOrWidth: Uint8ClampedArray | number, widthOrHeight: number, height?: number) {
        if (typeof dataOrWidth === "number") {
          this.width = dataOrWidth;
          this.height = widthOrHeight;
          this.data = new Uint8ClampedArray(this.width * this.height * 4);
        } else {
          this.data = dataOrWidth;
          this.width = widthOrHeight;
          this.height = height || 0;
        }
      }
    };
  }

  if (!globalScope.Path2D) {
    globalScope.Path2D = class Path2D {
      addPath() {}
      closePath() {}
      moveTo() {}
      lineTo() {}
      bezierCurveTo() {}
      quadraticCurveTo() {}
      rect() {}
      arc() {}
    };
  }
}

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

    ensurePdfRuntimePolyfills();
    const { PDFParse } = await import("pdf-parse");
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
    return NextResponse.json({
      error: "Failed to parse PDF document",
      detail: error instanceof Error ? error.message : String(error),
      code: "pdf_parse_failed"
    }, { status: 500 });
  }
}