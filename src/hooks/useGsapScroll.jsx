import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapScroll(effect, dependencies = []) {
  useLayoutEffect(() => {
    let ctx = gsap.context(effect);
    
    return () => {
      ctx.revert();
    };
  }, dependencies);
}
