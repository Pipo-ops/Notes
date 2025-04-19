import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"projekt-firebase-cbb8f","appId":"1:225694938777:web:b412cac68d056da396aa08","storageBucket":"projekt-firebase-cbb8f.firebasestorage.app","apiKey":"AIzaSyB8huy3iiOsPw9NYhInL6HcsdFoDzYeVH0","authDomain":"projekt-firebase-cbb8f.firebaseapp.com","messagingSenderId":"225694938777","measurementId":"G-0KWMX1V6Q4"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
