// /services/PdfService.ts
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';

// Initialize pdfMake with the virtual file system fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Define the MSConnect Brand Palette
 */
const BRAND_TERRACOTTA = '#D98C58'; // Warm Warning Color
const BRAND_SAGE_GREEN = '#3C5A51';  // Calming Brand Color
const BRAND_SLATE_GRAY = '#111827'; // Softer High Contrast Text
const BRAND_SOFT_GRAY = '#F9FAFB';  // Gentle Page Background (Optional)

/**
 * Define the MS Accessibility Styles Dictionary
 * - Priority: High contrast, large headers, clean lines.
 * - This entire object is optimized for neurological visual fatigue.
 */
const styles: StyleDictionary = {
  header: {
    fontSize: 24, // Massive main header for low vision
    bold: true,
    color: BRAND_SAGE_GREEN,
    margin: [0, 0, 0, 15] // [left, top, right, bottom]
  },
  subheader: {
    fontSize: 18,
    bold: true,
    color: BRAND_TERRACOTTA, // Warm brand accent
    margin: [0, 5, 0, 25]
  },
  sectionHeader: {
    fontSize: 18, // Clean header
    bold: true,
    color: BRAND_SLATE_GRAY,
    margin: [0, 20, 0, 10],
    borderBottom: `2px solid ${BRAND_TERRACOTTA}` // Visual structure
  },
  body: {
    fontSize: 12, // Stable, readable body font
    color: BRAND_SLATE_GRAY,
    lineHeight: 1.6, // Increased line height for focus
    margin: [0, 0, 0, 10]
  },
  // --- TABLE ACCESSIBILITY ---
  tableHeader: {
    bold: true,
    fontSize: 13, // Slightly smaller than body for clear labels
    color: 'white',
    fillColor: BRAND_SAGE_GREEN, // Sage Background
    alignment: 'center',
    margin: [0, 5, 0, 5] // Vertically center text
  },
  tableBody: {
    fontSize: 11, // Smaller body specifically for tables
    color: BRAND_SLATE_GRAY,
    margin: [0, 4, 0, 4] // Clean cell padding
  },
  severityWarning: {
    color: BRAND_TERRACOTTA,
    bold: true
  },
  legalDisclaimer: {
    fontSize: 10,
    italics: true,
    color: '#6B7280', // Softened text
    margin: [0, 40, 0, 0], // Significant top margin to separate
  }
};

/**
 * Configure the PDF document definition object.
 * - Accept the 'formattedSymptomTableBody' as an argument.
 */
const createDocDefinition = (formattedSymptomTableBody: any[]): TDocumentDefinitions => {
  return {
    // 1. Metadata (Non-visible)
    info: {
      title: 'MSConnect Neurologist Summary',
      author: 'MSConnect (On-Device Zero-Knowledge)',
      subject: 'Patient Symptom Trends Report',
    },
    
    // 2. Styling (Brand and Accessibility)
    styles,
    
    // 3. Page Layout and Margins
    pageSize: 'A4',
    pageMargins: [ 40, 60, 40, 60 ], // [left, top, right, bottom]
    
    // 4. Content (The actual PDF structure)
    content: [
      // --- Branded Header ---
      {
        text: 'MSConnect: Private. Accessible. Yours.',
        style: 'header',
        alignment: 'center',
      },
      {
        text: 'Neurologist Summary Report',
        style: 'subheader',
        alignment: 'center',
      },
      
      // --- Report & Visit Information ---
      {
        text: 'Visit and Report Information',
        style: 'sectionHeader'
      },
      {
        columns: [
          { text: `Date of Report: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, width: '50%' },
          { text: 'Neurologist: [Dr. Sarah Chen]', width: '50%' },
        ],
        style: 'body'
      },
      {
        text: 'Purpose: Provide a clean summary of symptom logs to focus the discussion during your upcoming visit.',
        style: 'body',
        italics: true,
        color: '#6B7280', // Soft gray
        margin: [0, 5, 0, 15]
      },
      
      // --- Symptom Trends Section (Real Data Integration) ---
      {
        text: 'Symptom Trends Summary (All Logs)',
        style: 'sectionHeader'
      },
      {
        text: 'This data is derived from daily logs processed strictly on the patient’s device. No data selling. No tracking.',
        style: 'body',
        italics: true,
        color: '#6B7280',
        margin: [0, 0, 0, 15]
      },
      
      // --- REAL DATA TABLE ---
      {
        // Define the Table Object
        table: {
          headerRows: 1, // Fix the top row (headers)
          widths: ['20%', '30%', '15%', '35%'], // Allocate width logically (e.g., plenty of space for notes)
          // 1. Insert the REAL, formatted body rows here.
          body: formattedSymptomTableBody // This array comes from our hook.
        },
        // 2. Table Accessibility Overrides
        layout: {
          fillColor: (rowIndex: number) => {
            // Apply a subtle background color to every second row (zebra striping)
            // This aids in visual tracking across the page for low-vision fatigue.
            return (rowIndex > 0 && rowIndex % 2 === 0) ? '#EEF2F4' : null;
          },
          hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 0.5 : 0.5,
          vLineWidth: (i: number, node: any) => 0.5,
          hLineColor: (i: number, node: any) => '#E5E7EB', // Soft gray line color
          vLineColor: (i: number, node: any) => '#E5E7EB',
        }
      },
      
      // --- LEGAL & MEDICAL DISCLAIMER ---
      {
        text: 'MEDICAL DISCLAIMER: MSConnect is an organization and self-tracking tool. It does not provide medical advice, diagnosis, or treatment. It does not replace the relationship with your healthcare provider. Report generated via MSConnect Zero-Knowledge Privacy Architecture.',
        style: 'legalDisclaimer',
        alignment: 'center',
      }
    ]
  };
};

/**
 * Generate and Download the PDF
 * - NEW: Accept the formatted data as an argument.
 */
export const generateNeurologistSummary = (formattedSymptomTableBody: any[]) => {
  // 1. Create the final, real document definition
  const docDefinition = createDocDefinition(formattedSymptomTableBody);
  
  // 2. Generate the PDF locally on the iPad (Safari/WebKit)
  const pdf = pdfMake.createPdf(docDefinition);
  
  // 3. Download the PDF locally to the iPad's "Files" app
  pdf.download(`MSConnect_Summary_${new Date().toISOString().slice(0, 10)}.pdf`);
  
  console.log('MSConnect PDF report generated privately on-device and saved to local Files.');
};
