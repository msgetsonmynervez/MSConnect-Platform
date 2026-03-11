// /src/services/SymptomStorage.ts

/**
 * Define the structure of a single Symptom Log Entry.
 * (This is what we will save to the iPad.)
 */
export interface SymptomLogEntry {
  id?: number;              // Unique ID (Auto-incremented by IndexedDB)
  timestamp: Date;          // Time of the log entry
  symptomType: string;      // E.g., "SENSORY_NUMBNESS", "COG_FOG", "FATIGUE"
  severityScore: number;    // 1 (Mild) to 10 (Severe)
  affectedArea?: string;    // E.g., "RIGHT_ARM", "WHOLE_BODY"
  notes?: string;           // Optional user notes
  // Data Privacy Metadata
  isLocalOnly: true;        // Explicit flag: This data is on-device only.
  zeroKnowledgeVersion: 1;  // Versioning for future privacy updates.
}

/**
 * Configure the IndexedDB Database Instance.
 * - This provides the safe, encrypted container on the iPad.
 */
const DB_NAME = 'MSConnect_ZK_v1'; // MSConnect Zero-Knowledge DB v1
const STORE_NAME = 'symptom_logs'; // Name of the object store (table)
const DB_VERSION = 1;

/**
 * Opens (or creates/upgrades) the IndexedDB database instance on the iPad.
 * - Adheres to Zero-Knowledge: process is client-side only (iPad Safari memory).
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // 1. Request to open the database (Browser engine handles encryption)
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // 2. Handle errors
    request.onerror = (event) => {
      console.error('Error opening MSConnect DB:', (event.target as IDBOpenDBRequest).error);
      reject('IndexedDB not supported or permission denied.');
    };

    // 3. Handle successful connection
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    // 4. Define/Upgrade the database schema (Run on first-time open)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create the Object Store (Table)
      // keyPath: 'id' ensures each log gets a unique ID automatically.
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });

      // Create Indexes (For fast searching and medical report generation)
      store.createIndex('timestamp_idx', 'timestamp', { unique: false });
      store.createIndex('type_idx', 'symptomType', { unique: false });
      store.createIndex('severity_idx', 'severityScore', { unique: false });
      
      console.log('MSConnect IndexedDB schema created/updated successfully on iPad.');
    };
  });
}

/**
 * Public API for Symptom Storage
 */
export const SymptomStorage = {
  /**
   * Saves a new symptom log entry securely to the iPad's IndexedDB.
   * - Zero-Knowledge principle: All processing is client-side.
   */
  async saveLogEntry(entry: SymptomLogEntry): Promise<number> {
    const db = await openDB();
    // 1. Return a Promise (We are fixing the closing syntax here)
    return new Promise((resolve, reject) => {
      // Start a "readwrite" transaction
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Add the entry to the store
      const request = store.add(entry);

      request.onsuccess = (event) => {
        // Return the auto-generated ID of the new log
        resolve((event.target as IDBRequest).result);
        console.log(`Saved Symptom Log (ID: ${(event.target as IDBRequest).result}) privately to iPad.`);
      };

      request.onerror = (event) => {
        console.error('Error saving Symptom Log:', (event.target as IDBRequest).error);
        reject('Failed to save log entry locally.');
      };

      // 3. Ensure transaction closes properly
      transaction.oncomplete = () => {
        db.close();
      };
    // --- FIX: Syntax Error r ---
    // Was: };
    // Now: }); (Correct closing for the 'new Promise' constructor)
    }); 
  },

  /**
   * Retrieves all symptom log entries from the iPad's IndexedDB.
   * - This is what feeds the on-device Neurologist PDF report.
   */
  async getAllLogEntries(): Promise<SymptomLogEntry[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      // Transact in "readonly" mode for performance
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      // Retrieve all entries
      const request = store.getAll();

      request.onsuccess = (event) => {
        // Return the array of all logs
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event) => {
        console.error('Error retrieving Symptom Logs:', (event.target as IDBRequest).error);
        reject('Failed to load local log history.');
      };

      // Close connection
      transaction.oncomplete = () => {
        db.close();
      };
    });
  },
};
