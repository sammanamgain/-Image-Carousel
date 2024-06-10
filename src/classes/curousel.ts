export class Carousel {
  private carousel: HTMLElement;
  private imageWrapper: HTMLElement;
  private images: NodeListOf<HTMLElement>;
  private leftControl: HTMLElement;
  private rightControl: HTMLElement;
  private carouselIndicators: NodeListOf<HTMLElement>;
  private interval: number;
  private transitionTime: number;
  private currentIndex: number = 0;
  private imageWidth: number;
  private intervalId: number | null = null;
  private animationFrameId: number | null = null;
  private pauseDuration: number = 1;

  constructor(
    carouselClass: string,
    carouselImageWrapperClass: string,
    carouselImageClass: string,
    carouselIndicatorClass: string,
    interval: number,
    transitionTime: number,
    carouselControlPrev: string,
    carouselControlNext: string
  ) {
    console.log(
      carouselClass,
      carouselImageWrapperClass,
      carouselImageClass,
      carouselIndicatorClass,
      interval,
      transitionTime,
      carouselControlPrev,
      carouselControlNext
    );

    this.carousel = document.querySelector(`.${carouselClass}`) as HTMLElement;
    this.imageWrapper = this.carousel.querySelector(
      `.${carouselImageWrapperClass}`
    ) as HTMLElement;
    this.images = this.carousel.querySelectorAll(
      `.${carouselImageClass}`
    ) as NodeListOf<HTMLElement>;
    this.carouselIndicators = this.carousel.querySelectorAll(
      `.${carouselIndicatorClass}`
    ) as NodeListOf<HTMLElement>;
    this.leftControl = this.carousel.querySelector(
      `.${carouselControlPrev}`
    ) as HTMLElement;
    this.rightControl = this.carousel.querySelector(
      `.${carouselControlNext}`
    ) as HTMLElement;
    this.interval = interval;
    this.transitionTime = transitionTime;

    // Calculate image width based on the first image
    this.imageWidth = this.images[0].offsetWidth;
    this.pauseDuration = this.pauseDuration * 1000;

    this.addEventListeners();
    this.startAutoTransition(this.transitionTime);
  }

  private addEventListeners() {
    this.leftControl.addEventListener("click", () => {
      console.log("left button clicked");
      this.stopAutoTransition();
      console.log(this.imageWrapper);
      this.moveLeft();
    });
    this.rightControl.addEventListener("click", () => {
      console.log("right button clicked");
      this.stopAutoTransition();
      this.moveRight();
    });
    this.carouselIndicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        console.log(`Indicator ${index} clicked`);
        this.stopAutoTransition();
        this.showSlide(index, false); // Pass false to skip animation
      });
    });
  }
  private showSlide(index: number, animate: boolean = true) {
    const targetPosition = -index * this.imageWidth;

    if (animate) {
      const startPosition = parseInt(this.imageWrapper.style.left || "0", 10);
      const distance = targetPosition - startPosition;
      const duration = this.transitionTime * 1000;
      let startTime: number | null = null;

      const step = (currentTime: number) => {
        if (!startTime) {
          startTime = currentTime;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newPosition = startPosition + distance * progress;

        this.imageWrapper.style.left = `${newPosition}px`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          this.currentIndex = index;
          this.updateActiveIndicator();
        }
      };

      requestAnimationFrame(step);
    } else {
      this.imageWrapper.style.left = `${targetPosition}px`;
      this.currentIndex = index;
      this.updateActiveIndicator();
    }
  }

  private updateActiveIndicator() {
    Array.from(this.carouselIndicators).forEach((indicator, i) => {
      if (i === this.currentIndex) {
        indicator.classList.add("carousel__indicator--active");
      } else {
        indicator.classList.remove("carousel__indicator--active");
      }
    });
  }
  private moveLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
    this.moveToIndex();
  }

  private moveRight() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.moveToIndex();
  }

  private startAutoTransition(transitionTime: number) {
    this.intervalId = window.setInterval(() => {
      this.animateToIndex(transitionTime);
    }, this.pauseDuration + transitionTime * 1000);
  }

  private stopAutoTransition() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animateToIndex(transitionTime: number) {
    let nextIndex;
    let isForward = true; // Track the direction of the carousel

    if (this.currentIndex === this.images.length - 1) {
      nextIndex = 0; // Transition to the first image after the last image
      isForward = false; // Set the direction to backward
    } else if (this.currentIndex === 0) {
      nextIndex = 1; // Transition to the second image after the first image
      isForward = true; // Set the direction to forward
    } else {
      nextIndex = isForward ? this.currentIndex + 1 : this.currentIndex - 1;
    }

    const startPosition = parseInt(this.imageWrapper.style.left || "0", 10);
    const endPosition = -nextIndex * this.imageWidth;
    const distance = endPosition - startPosition;
    const duration = transitionTime * 1000;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newPosition = startPosition + distance * progress;

      this.imageWrapper.style.left = `${newPosition}px`;

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(step);
      } else {
        this.currentIndex = nextIndex; // Update currentIndex after animation completes

        // Update active indicator
        Array.from(this.carouselIndicators).forEach((indicator, index) => {
          if (index === this.currentIndex) {
            indicator.classList.add("carousel__indicator--active");
          } else {
            indicator.classList.remove("carousel__indicator--active");
          }
        });

        // Continue the loop after the pause
        setTimeout(() => {
          this.animateToIndex(transitionTime);
        }, this.pauseDuration);
      }
    };

    this.animationFrameId = requestAnimationFrame(step);
  }
  private moveToIndex() {
    console.log("move to index reached");
    const startPosition = parseInt(this.imageWrapper.style.left || "0", 10);
    const endPosition = -this.currentIndex * this.imageWidth;
    const distance = endPosition - startPosition;
    const duration = 500; // Animation duration in milliseconds
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newPosition = startPosition + distance * progress;

      this.imageWrapper.style.left = `${newPosition}px`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Update active indicator
        Array.from(this.carouselIndicators).forEach((indicator, index) => {
          if (index === this.currentIndex) {
            indicator.classList.add("carousel__indicator--active");
          } else {
            indicator.classList.remove("carousel__indicator--active");
          }
        });
      }
    };

    requestAnimationFrame(step);
  }

  private animateScroll(targetPosition: number) {
    const startTime = performance.now();
    const startPosition = this.imageWrapper.scrollLeft;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / this.transitionTime, 1);
      const newPosition =
        startPosition + (targetPosition - startPosition) * progress;
      this.imageWrapper.scrollLeft = newPosition;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
