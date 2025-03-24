import {
  Component,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
//import { AnimationItem } from 'lottie-web';
//import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private firestore: Firestore = inject(Firestore);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId); // ✅ Check if running in browser

  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('isBrowser:', this.isBrowser);

    this.translate.addLangs(['fr', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.getBrowserLang() || 'en');
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  consoleTest() {
    console.log('Button clicked!');
  }

  async submitForm() {
    if (!this.isBrowser) {
      alert('Submitting is not available in SSR mode. Please wait.');
      return;
    }

    if (this.contactForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    try {
      const dbRef = collection(this.firestore, 'contacts_my_portfolio');
      await addDoc(dbRef, this.contactForm.value);
      alert('Message sent successfully!');

      this.contactForm.reset(); // ✅ Clear form after submission
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Try again.');
    }
  }

  // options: AnimationOptions = {
  //   path: 'animation.json',
  // };
  // animationCreated(animationItem: AnimationItem): void {
  //   console.log(animationItem);
  // }
  toggleLanguage(): void {
    const newLang = this.translate.currentLang === 'en' ? 'fr' : 'en';
    this.translate.use(newLang);
  }
}
