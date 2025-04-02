 // Auto-slide banner
 const banners = ["banner1.png","banner2.png","banner3.png"];
 let bannerIndex = 0;
 setInterval(() => {
     bannerIndex = (bannerIndex + 1) % banners.length;
     document.getElementById("banner-img").src = banners[bannerIndex];
 }, 3000);