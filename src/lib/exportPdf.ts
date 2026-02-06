import jsPDF from "jspdf";

interface GeneratedContent {
  headlines: string[];
  ads: string[];
  emails: { subject: string; body: string }[];
  landingPage: { hero: string; features: string[]; cta: string };
}

export function exportMarketingPdf(
  content: GeneratedContent,
  productName: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const addTitle = (text: string) => {
    checkPage(16);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 10;
    // underline
    doc.setDrawColor(0, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + doc.getTextWidth(text), y);
    y += 8;
  };

  const addSubtitle = (text: string) => {
    checkPage(12);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 7;
  };

  const addBody = (text: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    for (const line of lines) {
      checkPage(6);
      doc.text(line, margin, y);
      y += 5;
    }
    y += 3;
  };

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`Marketing Content – ${productName || "Your Product"}`, margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
  doc.setTextColor(0, 0, 0);
  y += 12;

  // Headlines
  addTitle("Headlines");
  content.headlines.forEach((h, i) => {
    addBody(`${i + 1}. ${h}`);
  });
  y += 4;

  // Ad Variations
  addTitle("Ad Variations");
  content.ads.forEach((ad, i) => {
    addSubtitle(`Ad ${i + 1}`);
    addBody(ad);
  });
  y += 4;

  // Email Sequences
  addTitle("Email Sequences");
  content.emails.forEach((email, i) => {
    addSubtitle(`Email ${i + 1} – Subject: ${email.subject}`);
    addBody(email.body);
    y += 2;
  });
  y += 4;

  // Landing Page
  addTitle("Landing Page Content");
  addSubtitle("Hero");
  addBody(content.landingPage.hero);
  addSubtitle("Features");
  content.landingPage.features.forEach((f) => {
    addBody(`• ${f}`);
  });
  addSubtitle("Call to Action");
  addBody(content.landingPage.cta);

  doc.save(`${(productName || "marketing").replace(/\s+/g, "-").toLowerCase()}-content.pdf`);
}
