import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { spoonSchema, logSchema } from './schema';

// Enable dev mode so RxDB gives us clear warnings if we make a mistake
addRxPlugin(RxDBDevModePlugin);

export async function initDatabase() {
    console.log('Booting up the Zero-Knowledge Database...');

    // Create the actual database using Dexie (browser local storage)
    const db = await createRxDatabase({
        name: 'trackmyms_database',
        storage: getRxStorageDexie()
    });

    // Tell the database to create our two "drawers" using the blueprints
    await db.addCollections({
        spoons: {
            schema: spoonSchema
        },
        logs: {
            schema: logSchema
        }
    });

    console.log('Database online and secure.');
    return db;
}
