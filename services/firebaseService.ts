
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  increment, 
  query, 
  where,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { ArduinoProject, UserProfile, WithdrawalRequest, EwalletInfo } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyD9q0oX-cYsMDmVVQeTq7c_vtDWG9xpcvw",
  authDomain: "altomedia-8f793.firebaseapp.com",
  projectId: "altomedia-8f793",
  storageBucket: "altomedia-8f793.firebasestorage.app",
  messagingSenderId: "327513974065",
  appId: "1:327513974065:web:0a31130b4d37855491bc10",
  measurementId: "G-EZ56YMFV1L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const ADMIN_EMAIL = "appsidhanie@gmail.com";

const generateReferralCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const ensureUserProfile = async (user: any, referredByCode?: string) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    let initialBalance = 0;
    let superiorUid = null;

    if (referredByCode && referredByCode.trim().length === 6) {
      const q = query(collection(db, "users"), where("referralCode", "==", referredByCode.trim()));
      const superiorSnap = await getDocs(q);
      
      if (!superiorSnap.empty) {
        const superiorDoc = superiorSnap.docs[0];
        superiorUid = superiorDoc.id;
        
        // Atasan bonus 500
        await updateDoc(doc(db, "users", superiorUid), {
          balance: increment(500),
          validFriendsCount: increment(1)
        });
        
        // Bawahan bonus 200
        initialBalance = 200;
      }
    }

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Operator",
      balance: initialBalance,
      lastCheckIn: null,
      referralCode: generateReferralCode(),
      referredBy: superiorUid,
      projectCount: 0,
      taskStartTime: Date.now(),
      validFriendsCount: 0,
      ewallet: null,
      isAdmin: user.email === ADMIN_EMAIL
    };
    await setDoc(userRef, profile);
    return profile;
  }
  return userSnap.data() as UserProfile;
};

export const dailyCheckIn = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;
  
  const data = snap.data() as UserProfile;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (!data.lastCheckIn || now - data.lastCheckIn >= oneDay) {
    await updateDoc(userRef, {
      balance: increment(10),
      lastCheckIn: now
    });
    return true;
  }
  return false;
};

export const incrementProjectCount = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;
  
  const data = snap.data() as UserProfile;
  const now = Date.now();
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  
  if (now - data.taskStartTime > threeDays) {
    await updateDoc(userRef, {
      projectCount: 1,
      taskStartTime: now
    });
  } else {
    const newCount = data.projectCount + 1;
    let bonus = 0;
    if (newCount === 50) bonus = 10000;
    if (newCount === 100) bonus = 25000;

    await updateDoc(userRef, {
      projectCount: increment(1),
      balance: increment(bonus)
    });
  }
};

export const bindEwallet = async (uid: string, info: EwalletInfo) => {
  await updateDoc(doc(db, "users", uid), { ewallet: info });
};

export const requestWithdrawal = async (uid: string, amount: number) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const data = snap.data() as UserProfile;

  if (data.balance < amount) throw new Error("Saldo tidak mencukupi.");
  if (amount < 100000) throw new Error("Minimal penarikan Rp. 100.000.");
  if (!data.ewallet) throw new Error("Harap ikat E-wallet terlebih dahulu.");

  const withdrawalId = `WD-${Date.now()}`;
  const request: WithdrawalRequest = {
    id: withdrawalId,
    uid,
    userEmail: data.email,
    amount,
    ewallet: data.ewallet,
    status: 'pending',
    createdAt: Date.now()
  };

  await setDoc(doc(db, "withdrawals", withdrawalId), request);
};

export const getAdminStats = async () => {
  const usersSnap = await getDocs(collection(db, "users"));
  const wdSnap = await getDocs(query(collection(db, "withdrawals"), where("status", "==", "pending")));
  return {
    totalUsers: usersSnap.size,
    pendingWithdrawals: wdSnap.size
  };
};

export const getAllPendingWithdrawals = async () => {
  const q = query(collection(db, "withdrawals"), where("status", "==", "pending"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as WithdrawalRequest);
};

export const approveWithdrawal = async (requestId: string) => {
  const wdRef = doc(db, "withdrawals", requestId);
  const wdSnap = await getDoc(wdRef);
  const wdData = wdSnap.data() as WithdrawalRequest;

  const userRef = doc(db, "users", wdData.uid);
  const batch = writeBatch(db);
  batch.update(userRef, { balance: increment(-wdData.amount) });
  batch.update(wdRef, { status: 'approved' });
  await batch.commit();
};

export const rejectWithdrawal = async (requestId: string) => {
  await updateDoc(doc(db, "withdrawals", requestId), { status: 'rejected' });
};

export const loginWithGoogle = async (referralCode?: string) => {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user, referralCode);
  return result.user;
};

export const registerWithEmail = async (email: string, pass: string, name: string, referralCode?: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(res.user, { displayName: name });
  await ensureUserProfile(res.user, referralCode);
  return res.user;
};

export const loginWithEmail = async (email: string, pass: string) => {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  await ensureUserProfile(res.user);
  return res.user;
};

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const logout = () => signOut(auth);

export const syncProjectToCloud = async (userId: string, project: ArduinoProject) => {
  const projectRef = doc(db, "users", userId, "projects", project.id);
  await setDoc(projectRef, { ...project, updatedAt: Date.now() }, { merge: true });
};

export const fetchCloudProjects = async (userId: string): Promise<ArduinoProject[]> => {
  const projectsCol = collection(db, "users", userId, "projects");
  const snapshot = await getDocs(projectsCol);
  return snapshot.docs.map(doc => doc.data() as ArduinoProject);
};

export const deleteProjectFromCloud = async (userId: string, projectId: string) => {
  await deleteDoc(doc(db, "users", userId, "projects", projectId));
};
