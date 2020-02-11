import MobileDetect from "mobile-detect";

export default function isMobile() {
  const md = new MobileDetect(window.navigator.userAgent);
  const res = md.mobile();
  return res != null;
} 
