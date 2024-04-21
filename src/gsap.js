import { gsap } from "gsap";
import SplitType from 'split-type'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";


gsap.registerPlugin(ScrollTrigger,TextPlugin);
document.addEventListener("DOMContentLoaded", () => {
  // title
  const titleChars = new SplitType("#title", {
    types: "words,chars",
    tagName: "span",
  })
  gsap.to('.char', {
    y: 0,
    stagger: 0.05,
    delay: 0.1,
    duration: .1,
    ease: "power2.out",
  })

  // underline scroll span
  const underline = document.querySelector('.underline')
  underline.style.width = '100%';

  // h3, scroll trigger
  gsap.from('h3, #paragraph',{
    scrollTrigger: {
      trigger: 'h3',
      start: 'top 80%',
      end: 'top 50%',
    },
    opacity: 0,
    y: 30,
    ease: 'power2.out',
  })
  // h2
  gsap.from('h2',{
    scrollTrigger: {
      trigger: 'h2',
      start: 'top 70%',
      end: 'top 30%',
    },
    opacity: 0,
    y: 20,
    ease: 'power2.inOut',
  })
});7