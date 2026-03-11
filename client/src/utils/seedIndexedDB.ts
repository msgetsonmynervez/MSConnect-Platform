// /src/utils/seedIndexedDB.ts
// Adhering to Zero-Knowledge Architecture: This script only runs on the user's iPad.
import { SymptomStorage, SymptomLogEntry } from '../services/SymptomStorage';

/**
 * Configure the Seeding Parameters
 */
const TOTAL_ENTRIES = 75; // A substantial set to test multi-page PDFs
const START_DATE = new Date(); // Today
START_DATE.setMonth(START_DATE.getMonth() - 4); // Seed data going back 4 months

/**
 * Generate a randomized SymptomLogEntry.
 * - This creates varied data to test reports without real patient logs.
 */
function generateRandomLogEntry(date: Date): SymptomLogEntry {
  // 1. Random Symptom Type (Common MS Symptoms)
  const symptomTypes = [ 'COG_FOG', 'FATIGUE', 'NUMBNESS_LEFT_HAND', 'NUMBNESS_RIGHT_FOOT', 'TRIGEMINAL_NEURALGIA', 'SPASTICITY_LEG', 'GAIT_INSTABILITY', 'OPTIC_NEURITIS' ];
  const symptomType = symptomTypes[Math.floor(Math.random() * symptomTypes.length)];

  // 2. Randomized Severity Score (1-10)
  // Realistically varied: some mild, some severe. We want plenty of 7+ logs.
  let severityScore = Math.floor(Math.random() * 6) + 1; // Default 1-6

  // Recent month gets a higher chance of severe logs (50% chance of 7+)
  // (Testing visual alarm '#D98C58')
  const isRecentMonth = (new Date().getTime() - date.getTime()) < (30 * 24 * 60 * 60 * 1000);
  if (isRecentMonth && Math.random() > 0.5) {
    severityScore = Math.floor(Math.random() * 4) + 7; // 7, 8, 9, or 10
  }

  // 3. Randomized Notes (Simulating user input)
  let notes = '';
  if (severityScore >= 7) {
    notes = `Severe event today. Impacted work/sleep. ${symptomType === 'COG_FOG' ? 'Difficulty focusing.' : ''} ${symptomType.includes('NUMBNESS') ? 'Numbness spreading.' : ''}`;
  } else if (severityScore <= 3) {
    notes = 'Mild symptoms today, managed with rest.';
  }

  // 4. Randomized Areas (Only for relevant symptoms)
  let affectedArea: string | undefined = undefined;
  if (symptomType.includes('NUMBNESS') || symptomType.includes('SPASTICITY')) {
    affectedArea = symptomType.split('_')[1] || symptomType;
  }

  // Return the completed entry
  return {
    timestamp: date,
    symptomType,
    severityScore,
    affectedArea,
    notes,
    isLocalOnly: true, // Crucial for ZK constraint
    zeroKnowledgeVersion: 1,
  };
}

/**
 * Seed IndexedDB with Mock Data.
 * - This function is exposed to Home.tsx and invoked via the dev button.
 * - Adheres to Zero-Knowledge: runs 100% locally on the iPad Safari memory.
 */
export const seedSymptomDatabase = async () => {
  // Acknowledge the developer action on the iPad console.
  console.log(`🚧 DEVELOPER: Starting IndexedDB seed on iPad. Generating ${TOTAL_ENTRIES} mock entries (Zero-Knowledge)...`);

  // Calculate the time step between entries (spreading 75 entries over 4 months)
  const totalDurationMs = new Date().getTime() - START_DATE.getTime();
  const timeStepMs = Math.floor(totalDurationMs / TOTAL_ENTRIES);

  let currentDate = new Date(START_DATE);
  const generationPromises: Promise<number>[] = [];

  for (let i = 0; i < TOTAL_ENTRIES; i++) {
    // Generate the log for the specific date
    const mockEntry = generateRandomLogEntry(new Date(currentDate));
    
    // Save it privately to the iPad's IndexedDB container.
    // This is the functional validation of our storage service.
    generationPromises.push(SymptomStorage.saveLogEntry(mockEntry));
    
    // Advance the date for the next entry
    currentDate.setTime(currentDate.getTime() + timeStepMs);
  }

  try {
    // Wait for all saves to complete (IndexedDB is asynchronous)
    await Promise.all(generationPromises);
    console.log(`✅ SUCCESS: Seeded ${TOTAL_ENTRIES} symptom logs privately into MSConnect DB on this iPad.`);
  } catch (err) {
    console.error('❌ SEED ERROR: Failed to seed IndexedDB:', err);
  }
};
