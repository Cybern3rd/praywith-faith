import jsPDF from 'jspdf';

interface Prayer {
  id: number;
  title: string;
  content: string;
  reflection: string;
  affirmation: string;
  date: string;
  language: string;
}

interface JournalEntry {
  id: number;
  content: string;
  createdAt: Date;
}

export function exportPrayersToPDF(prayers: Prayer[], userName?: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PrayWith.Faith', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Saved Prayers', pageWidth / 2, yPosition, { align: 'center' });
  
  if (userName) {
    yPosition += 8;
    doc.setFontSize(10);
    doc.text(`For: ${userName}`, pageWidth / 2, yPosition, { align: 'center' });
  }
  
  yPosition += 15;

  // Add each prayer
  prayers.forEach((prayer, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Prayer date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date(prayer.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), margin, yPosition);
    yPosition += 8;

    // Prayer title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const titleLines = doc.splitTextToSize(prayer.title, maxWidth);
    doc.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 7 + 5;

    // Reflection
    if (prayer.reflection) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(80, 80, 80);
      const reflectionLines = doc.splitTextToSize(prayer.reflection, maxWidth);
      doc.text(reflectionLines, margin, yPosition);
      yPosition += reflectionLines.length * 5 + 8;
    }

    // Prayer content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const contentLines = doc.splitTextToSize(prayer.content, maxWidth);
    
    contentLines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 5;

    // Affirmation
    if (prayer.affirmation) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Daily Affirmation:', margin, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'italic');
      const affirmationLines = doc.splitTextToSize(prayer.affirmation, maxWidth);
      doc.text(affirmationLines, margin, yPosition);
      yPosition += affirmationLines.length * 5 + 15;
    }

    // Separator line if not last prayer
    if (index < prayers.length - 1) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
    }
  });

  // Footer on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} • Generated from PrayWith.Faith`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `prayers-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export function exportJournalToPDF(entries: JournalEntry[], userName?: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PrayWith.Faith', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Prayer Journal', pageWidth / 2, yPosition, { align: 'center' });
  
  if (userName) {
    yPosition += 8;
    doc.setFontSize(10);
    doc.text(`For: ${userName}`, pageWidth / 2, yPosition, { align: 'center' });
  }
  
  yPosition += 15;

  // Add each journal entry
  entries.forEach((entry, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Entry date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date(entry.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), margin, yPosition);
    yPosition += 10;

    // Entry content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const contentLines = doc.splitTextToSize(entry.content, maxWidth);
    
    contentLines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 10;

    // Separator line if not last entry
    if (index < entries.length - 1) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
    }
  });

  // Footer on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} • Generated from PrayWith.Faith`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `journal-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
