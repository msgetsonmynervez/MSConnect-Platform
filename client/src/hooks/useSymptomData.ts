// /hooks/useSymptomData.ts
import { useState, useEffect, useCallback } from 'react';
import { SymptomStorage, SymptomLogEntry } from '../services/SymptomStorage';

/**
 * useSymptomData Hook
 * - Retrieves and processes raw symptom logs from iPad IndexedDB.
 * - Adheres to Zero-Knowledge Architecture (On-device processing).
 */
export const useSymptomData = () => {
  const [rawLogs, setRawLogs] = useState<SymptomLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Initialize 'error' with a strict Type.
  // We can use 'string | null' but also define a custom type if needed.
  const [error, setError] = useState<string | null>(null);

  /**
   * Load raw logs from IndexedDB
   * - NEW: Added robust error handling.
   */
  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    // 2. Clear any previous error on re-load
    setError(null);
    try {
      // 3. Query the storage service (Client-side only)
      // This call will fail if IndexedDB initialization fails.
      const logs = await SymptomStorage.getAllLogEntries();
      
      // Sort logs by date (newest first for standard medical view)
      const sortedLogs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setRawLogs(sortedLogs);
    } catch (err) {
      // 4. --- SAFEGUARD: Handling unexpected failures ---
      console.error('CRITICAL ERROR: Failed to load symptom logs (IndexedDB failure):', err);
      
      // Set a generic, user-friendly error message.
      // A bad a11y experience is a white screen. A 'good' one is a helpful message.
      setError('MSConnect encountered a critical on device data access error. Your private symptom logs cannot be loaded. Please ensure you have not blocked storage permissions for this app in iPad Safari settings.');
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
   * - Adheres to Zero-Knowledge Architecture (On-device processing).
   */
  const getFormattedSymptomTableData = useCallback(() => {
    // 5. --- SAFEGUARD: Return empty if error or loading ---
    // This is the most critical check for white screen prevention.
    // If we try to process an empty array as data, it can cause a crash down the chain.
    if (isLoading || error || rawLogs.length === 0) {
      return [
        [ { text: 'Date', style: 'tableHeader' }, { text: 'Symptom', style: 'tableHeader' }, { text: 'Severity (1-10)', style: 'tableHeader', alignment: 'center' }, { text: 'Notes', style: 'tableHeader' } ],
        [ { text: isLoading ? 'Loading...' : error ? 'Error!' : 'No data.', colSpan: 4, style: 'body' }, {}, {}, {} ]
      ];
    }

    // (The mapping logic is unchanged)
    const headers = [
      { text: 'Date', style: 'tableHeader' },
      { text: 'Symptom', style: 'tableHeader' },
      { text: 'Severity (1-10)', style: 'tableHeader', alignment: 'center' },
      { text: 'Notes', style: 'tableHeader' },
    ];

    const bodyRows = rawLogs.map((log) => {
      const formattedDate = log.timestamp.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
      const severityStyle = log.severityScore >= 7 ? { color: '#D98C58', bold: true } : {};

      return [
        { text: formattedDate, style: 'body' },
        { text: log.symptomType, style: 'body' },
        { text: log.severityScore.toString(), style: 'body', alignment: 'center', ...severityStyle },
        { text: log.notes || '', style: 'body' },
      ];
    });

    return [headers, ...bodyRows];
  }, [rawLogs, isLoading, error]); // Add dependencies

  // (getSummaryStats unchanged)
  const getSummaryStats = useCallback(() => {
    if (rawLogs.length === 0) return { totalLogs: 0, averageSeverity: 0, mostFrequent: 'N/A' };
    const totalLogs = rawLogs.length;
    const severitySum = rawLogs.reduce((sum, log) => sum + log.severityScore, 0);
    const averageSeverity = Math.round((severitySum / totalLogs) * 10) / 10;
    const symptomCounts = rawLogs.reduce((acc, log) => { acc[log.symptomType] = (acc[log.symptomType] || 0) + 1; return acc; }, {} as Record<string, number>);
    let mostFrequent = 'N/A';
    let maxCount = 0;
    for (const type in symptomCounts) { if (symptomCounts[type] > maxCount) { maxCount = symptomCounts[type]; mostFrequent = type; } }
    return { totalLogs, averageSeverity, mostFrequent };
  }, [rawLogs]);

  // Return the hook's interface (Must match previous API)
  return { 
    rawLogs, 
    getFormattedSymptomTableData, 
    getSummaryStats,
    isLoading, 
    error, 
    refreshLogs: loadLogs 
  };
};
