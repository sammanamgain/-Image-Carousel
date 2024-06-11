export class Carousel {
  private carousel: HTMLElement;
  private imageWrapper: HTMLElement;
  private images: NodeListOf<HTMLElement>;
  private leftControl: HTMLElement;
  private rightControl: HTMLElement;
  private carouselIndicators: NodeListOf<HTMLElement>;
  private interval: number; // image will stop at this time
  private transitionTime: number; // time to transition from one image to another
  private currentIndex: number = 0;
  private imageWidth: number;

  // to cancel the requestanimation
  private animationFrameId: number | null = null;

  private isForward: boolean = true;

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

    this.transitionTime = transitionTime;

    // Calculate image width based on the first image
    this.imageWidth = this.images[0].offsetWidth;
    this.interval = interval * 1000;
  }

  init() {
    this.addEventListeners();
    this.startAutoTransition(this.transitionTime);
  }
  //  adding event listeners to the button ---left ,right and indicator buttons
  private addEventListeners() {
    this.leftControl.addEventListener("click", () => {
      this.stopAutoTransition();

      this.moveLeft();
    });
    this.rightControl.addEventListener("click", () => {
      this.stopAutoTransition();
      this.moveRight();
    });
    this.carouselIndicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        console.log(`Indicator ${index} clicked`);
        this.stopAutoTransition();
        this.showSlide(index); // Pass false to skip animation
      });
    });
  }

  private showSlide(index: number) {
    const targetPosition = -index * this.imageWidth;

    this.imageWrapper.style.left = `${targetPosition}px`;
    this.currentIndex = index;
    this.updateActiveIndicator();
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
    this.animateToIndex(transitionTime);
  }

  private stopAutoTransition() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animateToIndex(transitionTime: number) {
    let nextIndex;
    // Track the direction of the carousel
    console.log("currentIndex", this.currentIndex);
    if (this.currentIndex === this.images.length - 1) {
      // Transition to the first image after the last image
      this.isForward = false; // Set the direction to backward
    } else if (this.currentIndex === 0) {
      // Transition to the second image after the first image
      this.isForward = true; // Set the direction to forward
    }

    nextIndex = this.isForward ? this.currentIndex + 1 : this.currentIndex - 1;
    console.log("nexindex", nextIndex);
    // converting string to decimal
    const startPosition = parseInt(this.imageWrapper.style.left || "0", 10);
    // endpostion is negative as we have to move to the left side
    const endPosition = -nextIndex * this.imageWidth;
    const distance = endPosition - startPosition;
    const duration = transitionTime * 1000;
    let startTime: number | null = null;
    // currenttime is arguement that is provided by requesetAniamtion Frame
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
        this.updateActiveIndicator();

        // Continue the loop after the pause
        setTimeout(() => {
          this.animateToIndex(transitionTime);
        }, this.interval);
      }
    };

    this.animationFrameId = requestAnimationFrame(step);
  }
  // triggers when clicked on left and right button
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
        this.updateActiveIndicator();
      }
    };

    requestAnimationFrame(step);
  }
}
