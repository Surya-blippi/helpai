import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBu99KnrluVoBw5HMhbc4UkIzCqb0XVuig",
    authDomain: "doubtsolve-4b5b3.firebaseapp.com",
    projectId: "doubtsolve-4b5b3",
    storageBucket: "doubtsolve-4b5b3.appspot.com",
    messagingSenderId: "768069275350",
    appId: "1:768069275350:web:7c76894e12b76d1e9f8377"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);