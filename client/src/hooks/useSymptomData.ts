// /hooks/useSymptomData.ts
import { useState, useEffect, useCallback } from 'react';
// 1. Import the IndexedDB storage service
import { SymptomStorage, SymptomLogEntry } from '../services/SymptomStorage';

/**
 * useSymptomData Hook
 * - Retrieves and processes raw symptom logs from iPad IndexedDB.
 * - Formats data specifically for the pdfMake Neurologist Summary.
 * - All processing is on-device (Zero-Knowledge).
 */
export const useSymptomData = () => {
  const [rawLogs, setRawLogs] = useState<SymptomLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load raw logs from IndexedDB (Self-contained function)
   */
  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 2. Query the storage service (Runs locally on iPad Safari)
      const logs = await SymptomStorage.getAllLogEntries();
      
      // Sort logs by date (newest first for standard medical view)
      const sortedLogs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setRawLogs(sortedLogs);
    } catch (err) {
      console.error('Failed to load symptom logs:', err);
      setError('Could not retrieve your local symptom history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load data automatically on hook initialization
   */
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  /**
   * Format Data for PDF Table (Process raw logs)
   * - pdfMake expecting a specific structure (e.g., table body array).
   * - MS sensory calibration: Use clean formatting, avoid tiny fonts.
   */
  const getFormattedSymptomTableData = useCallback(() => {
    // 3. Return an empty array if no logs exist (Safe check)
    if (rawLogs.length === 0) {
      return [[ 'Date', 'Symptom', 'Severity (1-10)', 'Notes' ], ['No symptoms logged yet.', '', '', '']];
    }

    // Define the Table Headers (for pdfMake)
    const headers = [
      { text: 'Date', style: 'tableHeader' },
      { text: 'Symptom', style: 'tableHeader' },
      { text: 'Severity (1-10)', style: 'tableHeader', alignment: 'center' },
      { text: 'Notes', style: 'tableHeader' },
    ];

    // Map raw logs into pdfMake table body rows
    const bodyRows = rawLogs.map((log) => {
      // Format the Date (e.g., Oct 26, 2023)
      const formattedDate = log.timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // Calibrate Severity Color (Optional MS optimization)
      // We can use Terracotta (Warning) for severe (7+) logs.
      const severityStyle = log.severityScore >= 7 ? { color: '#D98C58', bold: true } : {};

      // Return the row array (Order must match headers)
      return [
        { text: formattedDate, style: 'body' },
        { text: log.symptomType, style: 'body' },
        { text: log.severityScore.toString(), style: 'body', alignment: 'center', ...severityStyle },
        { text: log.notes || '', style: 'body' }, // Handle missing notes
      ];
    });

    // Final pdfMake table body (Headers + Data Rows)
    return [headers, ...bodyRows];
  }, [rawLogs]);

  /**
   * Get Summary Stats (E.g., for 'Stay Mindful' card)
   */
  const getSummaryStats = useCallback(() => {
    if (rawLogs.length === 0) return { totalLogs: 0, averageSeverity: 0, mostFrequent: 'N/A' };
    
    // Total number of logs
    const totalLogs = rawLogs.length;
    
    // Average Severity (Rounded to one decimal)
    const severitySum = rawLogs.reduce((sum, log) => sum + log.severityScore, 0);
    const averageSeverity = Math.round((severitySum / totalLogs) * 10) / 10;
    
    // Most Frequent Symptom Type
    const symptomCounts = rawLogs.reduce((acc, log) => {
      acc[log.symptomType] = (acc[log.symptomType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Find the max count (using simple logic)
    let mostFrequent = 'N/A';
    let maxCount = 0;
    for (const type in symptomCounts) {
      if (symptomCounts[type] > maxCount) {
        maxCount = symptomCounts[type];
        mostFrequent = type;
      }
    }

    return { totalLogs, averageSeverity, mostFrequent };
  }, [rawLogs]);

  // Return the hook's interface
  return { 
    rawLogs, 
    getFormattedSymptomTableData, 
    getSummaryStats,
    isLoading, 
    error, 
    refreshLogs: loadLogs 
  };
};
