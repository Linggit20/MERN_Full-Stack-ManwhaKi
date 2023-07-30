import { useState, useEffect } from "react";
import { IconButton } from "@material-tailwind/react";
import { BiChevronUp } from "react-icons/bi";

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const screenHeight = window.innerHeight
      setIsVisible(scrollY > screenHeight * .5)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsVisible(false)
  }


  return (
    <button
      onClick={handleScrollToTop}
      className={`scroll-to-top z-10 bg-blue-500 fixed bottom-16 right-4 h-8 w-8 rounded-full flex items-center justify-center text-white text-xl ${
        isVisible ? 'visible opacity-100' : 'invisible opacity-0'
      } transition-opacity duration-500`}
    >
      <BiChevronUp />
    </button>
  );
};

export default ScrollTopButton;
