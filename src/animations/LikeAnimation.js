import React, { useRef, useState } from 'react';
import lottie from 'lottie-web';
import animationData from '../assets/money-like.json';
import moneyPhoto from "../assets/money-photo-for-like.png";

function LoadingAnimation() {
  const containerRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [animationInstance, setAnimationInstance] = useState(null);

  const handleLikeClick = () => {
    setIsLiked(true);

    const instance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      animationData: animationData,
      loop: false,
      autoplay: true,
    });

    instance.addEventListener('complete', () => {
      setIsLiked(false);
      setAnimationInstance(null);
    });

    setAnimationInstance(instance);
  };

  return (
    <div class="bg-blue-500 h-50 w-50 relative">
      <div class="text-sm object-contain absolute left-0 w-52 h-52 mr-3 bottom-2"
        style={{ display: isLiked ? 'block' : 'none' }}
        ref={containerRef}
      ></div>
      <button
        style={{ display: isLiked ? 'none' : 'block' }}
        onClick={handleLikeClick}
      >
        <img class="object-cover w-24 h-20" src={moneyPhoto} alt="Money" />
      </button>
    </div>
  );
}

export default LoadingAnimation;
