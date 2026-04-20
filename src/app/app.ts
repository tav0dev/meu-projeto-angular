import { Component, signal, OnInit, OnDestroy, HostListener } from '@angular/core';

interface Particle {
  x: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly isScrolled = signal(false);
  protected readonly invisibilityLevel = signal(73);
  protected readonly particles = signal<Particle[]>([]);

  private blitzCounter = 0;
  private blitzInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Generate particles
    const pts: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      pts.push({
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
      });
    }
    this.particles.set(pts);

    // Animate blitz counter
    this.animateBlitzCounter();
  }

  ngOnDestroy(): void {
    if (this.blitzInterval) {
      clearInterval(this.blitzInterval);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu(): void {
    // Simple toggle for mobile (can expand later)
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (navLinks) {
      navLinks.style.display =
        navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
  }

  onSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.invisibilityLevel.set(Number(target.value));

    // Apply opacity to the image
    const img = document.querySelector('.showcase-image img') as HTMLElement;
    if (img) {
      const opacity = 1 - Number(target.value) / 100;
      img.style.opacity = String(Math.max(0.02, opacity));
    }
  }

  onSubmit(): void {
    const name = (document.getElementById('input-name') as HTMLInputElement)?.value;
    const phone = (document.getElementById('input-phone') as HTMLInputElement)?.value;

    if (!name || !phone) {
      alert('🦈 Preencha os campos, parceiro! O Gusttavo precisa saber pra onde ir!');
      return;
    }

    alert(
      `🤠 PARABÉNS, ${name.toUpperCase()}!\n\n` +
      `O Gusttavo Lima já está saindo de Goiânia na sua BYD Shark invisível!\n\n` +
      `Previsão de chegada: quando ninguém esperar (modo invisível ativado)\n\n` +
      `Ele vai ligar no ${phone} quando estiver perto... se o celular captar o sinal da Shark! 🦈🔥`
    );
  }

  private animateBlitzCounter(): void {
    const target = 12847;
    const duration = 3000;
    const startTime = Date.now();

    this.blitzInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      this.blitzCounter = Math.floor(eased * target);

      const el = document.getElementById('stat-blitz');
      if (el) {
        el.textContent = this.blitzCounter.toLocaleString('pt-BR');
      }

      if (progress >= 1 && this.blitzInterval) {
        clearInterval(this.blitzInterval);
        // Continue incrementing slowly
        this.blitzInterval = setInterval(() => {
          this.blitzCounter += Math.floor(Math.random() * 3) + 1;
          const element = document.getElementById('stat-blitz');
          if (element) {
            element.textContent = this.blitzCounter.toLocaleString('pt-BR');
          }
        }, 2000);
      }
    }, 16);
  }
}
