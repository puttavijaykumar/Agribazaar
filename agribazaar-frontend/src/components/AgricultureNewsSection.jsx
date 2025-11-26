import React, { useEffect, useRef, useState } from "react";

const AgricultureNewsSection = ({ newsItems, newsSectionStyle }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

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
  }, [newsItems]);

  return (
    <section style={{ ...newsSectionStyle, overflowX: "auto" }} ref={scrollRef}>
      {newsItems.length === 0
        ? <span>Loading latest news...</span>
        : newsItems
      }
    </section>
  );
};

export default AgricultureNewsSection;
