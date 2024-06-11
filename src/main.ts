import "./style.css";
import { Carousel } from "./classes/curousel";

const carousel = new Carousel(
  "carousel",
  "carousel__image-wrapper",
  "carousel__image",
  "carousel__indicator",
  2, // interval time in ms
  4, // transition time in ms
  "carousel__control--prev",
  "carousel__control--next"
);
carousel.init();
