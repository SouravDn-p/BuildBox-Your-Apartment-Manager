import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import image1 from "../../assets/home/01.webp";
import image2 from "../../assets/home/02.webp";
import image3 from "../../assets/home/03.jpg";
import image4 from "../../assets/home/04.webp";
import image5 from "../../assets/home/05.webp";
import image6 from "../../assets/home/06.webp";
export default function Banner() {
  return (
    <section>
      <div>
        <Carousel autoPlay infiniteLoop interval={3000}>
          <div>
            <img src={image1} />
          </div>
          <div>
            <img src={image2} />
          </div>
          <div>
            <img src={image3} />
          </div>
          <div>
            <img src={image4} />
          </div>
          <div>
            <img src={image5} />
          </div>
          <div>
            <img src={image6} />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
