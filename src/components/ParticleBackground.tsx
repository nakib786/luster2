'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

// Removed unused interfaces

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particles = useRef<Particle[]>([]);
  const inputPos = useRef({ x: 0, y: 0 }); // Unified position for mouse/tilt
  const [isMobile, setIsMobile] = useState(false);
  const [tiltEnabled] = useState(true);
  const deviceOrientationSupported = useRef(false);
  const lastOrientationUpdate = useRef(Date.now());

  // Mobile detection and device orientation setup
  useEffect(() => {
    const detectMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             ('ontouchstart' in window) || 
             (window.innerWidth <= 768);
    };

    const checkDeviceOrientationSupport = () => {
      return 'DeviceOrientationEvent' in window && 'DeviceMotionEvent' in window;
    };

    const requestPermissionForIOS = async () => {
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> }).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<'granted' | 'denied'> }).requestPermission();
          return permission === 'granted';
        } catch (error) {
          console.warn('Device orientation permission denied:', error);
          return false;
        }
      }
      return true; // Non-iOS devices don't need explicit permission
    };

    const initializeDeviceOrientation = async () => {
      const mobile = detectMobile();
      setIsMobile(mobile);
      
      if (mobile && checkDeviceOrientationSupport()) {
        deviceOrientationSupported.current = true;
        await requestPermissionForIOS();
        // Keep tilt enabled by default, no need to set it based on permission
      }
    };

    initializeDeviceOrientation();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < 50; i++) {
        particles.current.push(createParticle());
      }
    };

    const updateParticles = () => {
      particles.current = particles.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Input interaction (mouse or device tilt)
        const dx = inputPos.current.x - particle.x;
        const dy = inputPos.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          const intensity = isMobile && tiltEnabled ? 0.02 : 0.01; // Slightly stronger for mobile tilt
          particle.vx += (dx / distance) * force * intensity;
          particle.vy += (dy / distance) * force * intensity;
        }

        // Fade out as life progresses
        particle.opacity = (1 - particle.life / particle.maxLife) * 0.7;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        return particle.life < particle.maxLife;
      });

      // Add new particles occasionally
      if (particles.current.length < 50 && Math.random() < 0.02) {
        particles.current.push(createParticle());
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, 'rgba(79, 172, 254, 0.8)');
        gradient.addColorStop(1, 'rgba(79, 172, 254, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw connections
      particles.current.forEach((particle, i) => {
        particles.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 100) * 0.1;
            ctx.strokeStyle = 'rgba(79, 172, 254, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile || !tiltEnabled) {
        inputPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (!tiltEnabled || !isMobile) return;

      // Throttle orientation updates for better performance
      const now = Date.now();
      if (now - lastOrientationUpdate.current < 16) return; // ~60fps

      // Convert device orientation to screen coordinates
      const { beta, gamma } = event; // beta: front-back tilt, gamma: left-right tilt
      
      if (beta !== null && gamma !== null) {
        // Clamp values to reasonable ranges (-45 to 45 degrees)
        const clampedBeta = Math.max(-45, Math.min(45, beta));
        const clampedGamma = Math.max(-45, Math.min(45, gamma));
        
        // Convert to screen coordinates with smooth interpolation
        // gamma: -45 to 45 -> 0 to screen width
        // beta: -45 to 45 -> 0 to screen height (inverted for natural feel)
        const targetX = ((clampedGamma + 45) / 90) * window.innerWidth;
        const targetY = ((-clampedBeta + 45) / 90) * window.innerHeight;
        
        // Smooth interpolation for natural movement
        const lerp = 0.1;
        inputPos.current = {
          x: inputPos.current.x + (targetX - inputPos.current.x) * lerp,
          y: inputPos.current.y + (targetY - inputPos.current.y) * lerp
        };
        
        lastOrientationUpdate.current = now;
      }
    };

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (!tiltEnabled || !isMobile) return;
      
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration && acceleration.x !== null && acceleration.y !== null) {
        // Use acceleration as backup if orientation is not available
        const now = Date.now();
        
        // Only update if orientation handler hasn't set a recent value
        if (now - lastOrientationUpdate.current > 100) {
          const sensitivity = 15; // Reduced sensitivity for smoother motion
          const targetX = window.innerWidth / 2 + (acceleration.x * sensitivity);
          const targetY = window.innerHeight / 2 + (acceleration.y * sensitivity);
          
          // Smooth interpolation for acceleration-based movement
          const lerp = 0.05;
          inputPos.current = {
            x: Math.max(0, Math.min(window.innerWidth, 
              inputPos.current.x + (targetX - inputPos.current.x) * lerp)),
            y: Math.max(0, Math.min(window.innerHeight, 
              inputPos.current.y + (targetY - inputPos.current.y) * lerp))
          };
        }
      }
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initialize
    resizeCanvas();
    initParticles();
    
    // Set initial input position to center of screen
    inputPos.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    };
    
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Add device orientation listeners for mobile
    if (isMobile && tiltEnabled && deviceOrientationSupported.current) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Clean up device orientation listeners
      if (isMobile && deviceOrientationSupported.current) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
    };
  }, [isMobile, tiltEnabled]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};

export default ParticleBackground;
