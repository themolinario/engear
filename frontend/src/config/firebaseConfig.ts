import { initializeApp } from "firebase/app";

const firebaseConfig = {
    storageBucket: 'gs://engear-3654a.appspot.com'
}

export const app = initializeApp(firebaseConfig);

