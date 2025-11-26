import React, { useEffect, useRef, useState } from "react";

const AgricultureNewsSection = ({ newsItems, newsSectionStyle }) => {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Disable auto-scroll on mobile devices
    if (isMobile) return;

    let scrollAmount = 0;
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const interval = setInterval(() => {
      if (scrollAmount >= maxScrollLeft) {
        scrollAmount = 0; // Reset scroll to start
      } else {
        scrollAmount += 1; // Scroll by 1px increments
      }
      scrollContainer.scrollTo(scrollAmount, 0);
    }, 20); // Adjust speed here (ms)

    return () => clearInterval(interval);
  }, [newsItems, isMobile]);

  const responsiveStyle = {
    ...newsSectionStyle,
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    scrollBehavior: "smooth",
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          section {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        section::-webkit-scrollbar {
          height: 8px;
        }
        
        section::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        section::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        section::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        /* Hide scrollbar for Firefox */
        section {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
      `}</style>
      
      <section style={responsiveStyle} ref={scrollRef}>
        {newsItems.length === 0
          ? <span>Loading latest news...</span>
          : newsItems
        }
      </section>
    </>
  );
};

export default AgricultureNewsSection;