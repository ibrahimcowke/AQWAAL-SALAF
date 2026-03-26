import { collection, setDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { scholarsData, aqwaalData, qisasData } from '../data/seed';

export const migrateDataToFirestore = async () => {
  console.log('Starting migration/sync...');
  
  try {
    // 1. Sync Scholars
    console.log('Syncing scholars...');
    const scholarsCol = collection(db, 'scholars');
    for (const scholar of scholarsData) {
      await setDoc(doc(scholarsCol, scholar.id), scholar);
    }

    // 2. Sync Aqwaal
    console.log('Syncing aqwaal...');
    const aqwaalCol = collection(db, 'aqwaal');
    const aqwaalBatch = writeBatch(db);
    aqwaalData.forEach((qawl) => {
      const docRef = doc(aqwaalCol, qawl.id);
      aqwaalBatch.set(docRef, qawl);
    });
    await aqwaalBatch.commit();

    // 3. Sync Qisas
    console.log('Syncing qisas...');
    const qisasCol = collection(db, 'qisas');
    const qisasBatch = writeBatch(db);
    qisasData.forEach((qissa) => {
      const docRef = doc(qisasCol, qissa.id);
      qisasBatch.set(docRef, qissa);
    });
    await qisasBatch.commit();

    console.log('Migration/Sync completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};
