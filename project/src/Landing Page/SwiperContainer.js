import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import './App.css'; // Make sure this path is correct
import Autoplay from 'embla-carousel-autoplay'


const slides = [
  {
    imgPath: '/bg1.jpg',
    title: 'Stay Vigilant in the Digital World',
    description: 'Learn the essentials of cybersecurity to protect yourself online. Awareness is the first step towards a secure digital presence.',
    buttonText: 'Login/Register',
  },
  {
    imgPath: '/bg.jpg',
    title: 'Detect & Prevent Cyber Threats',
    description: 'Utilize advanced tools and techniques to identify potential cyber threats before they become a problem.',
    buttonText: 'Explore',
  },
  {
    imgPath: '/bg3.jpg',
    title: 'Adopt Secure Online Practices',
    description: 'Explore best practices to safeguard your data. Secure your digital footprint with smart, proactive strategies.',
    buttonText: 'Discover',
  },
  {
    imgPath: '/bg5.jpg',
    title: 'Gain Insights from Cybersecurity Experts',
    description: 'Stay ahead in cybersecurity with insights from leading experts. Learn about the latest trends and protective measures.',
    buttonText: 'Stay Updated',
  },
];


export function EmblaCarousel({ openModal }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [Autoplay()])

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <Box component="img" sx={{
                height: '650px', display: 'block', maxWidth: '100%', overflow: 'hidden', width: '100%'
              }} src={slide.imgPath} alt={slide.title} />
              <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                textAlign: 'center', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '60px', borderRadius: '15px', width: '25%', height: '25%',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              }}>
                <Typography variant="h5" component="h2" color="gold" sx={{ mb: 2 }}>
                  {slide.title}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {slide.description}
                </Typography>
                <Button variant="contained" className="login-button" onClick={() => openModal(slide.buttonText)}>
                  {slide.buttonText}
                </Button>
              </Box>
            </div>
          ))}
        </div>
      </div>
      <IconButton
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '10px', 
          transform: 'translateY(-50%)', 
          zIndex: 1, 
          color: '#1976d2', 
          '&:hover': { 
            backgroundColor: 'transparent', 
            transform: 'translateY(-50%)' 
          } 
        }} 
        onClick={() => emblaApi && emblaApi.scrollPrev()} 
        disabled={!emblaApi || !emblaApi.canScrollPrev()}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          right: '10px', 
          transform: 'translateY(-50%)', 
          zIndex: 1, 
          color: '#1976d2', 
          '&:hover': { 
            backgroundColor: 'transparent', 
            transform: 'translateY(-50%)' 
          } 
        }} 
        onClick={() => emblaApi && emblaApi.scrollNext()} 
        disabled={!emblaApi || !emblaApi.canScrollNext()}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}

export default EmblaCarousel;