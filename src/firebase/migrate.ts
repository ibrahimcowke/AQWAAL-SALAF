import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './config';
import { scholarsData, aqwaalData, qisasData } from '../data/seed';

export const migrateDataToFirestore = async () => {
  console.log('Starting migration...');
  
  try {
    // 1. Migrate Scholars
    const scholarsCol = collection(db, 'scholars');
    const existingScholars = await getDocs(scholarsCol);
    if (existingScholars.empty) {
      console.log('Migrating scholars...');
      for (const scholar of scholarsData) {
        await addDoc(scholarsCol, scholar);
      }
    }

    // 2. Migrate Aqwaal
    const aqwaalCol = collection(db, 'aqwaal');
    const existingAqwaal = await getDocs(aqwaalCol);
    if (existingAqwaal.empty) {
      console.log('Migrating aqwaal...');
      const batch = writeBatch(db);
      aqwaalData.forEach((qawl) => {
        const newDoc = doc(aqwaalCol);
        batch.set(newDoc, qawl);
      });
      await batch.commit();
    }

    // 3. Migrate Qisas
    const qisasCol = collection(db, 'qisas');
    const existingQisas = await getDocs(qisasCol);
    if (existingQisas.empty) {
      console.log('Migrating qisas...');
      const batch = writeBatch(db);
      qisasData.forEach((qissa) => {
        const newDoc = doc(qisasCol);
        batch.set(newDoc, qissa);
      });
      await batch.commit();
    }

    console.log('Migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};
