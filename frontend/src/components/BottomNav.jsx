import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideTimeout, setHideTimeout] = useState(null);

  const navItems = [
    { icon: '', label: 'Home', path: '/home' },
    { icon: '', label: 'Posts', path: '/posts' },
    { icon: '', label: 'Create', path: '/create' },
    { icon: '', label: 'Messages', path: '/messenger' },
    { icon: '', label: 'Profile', path: '/profile' },
  ];

  // Auto-hide on all pages EXCEPT home
  const shouldAutoHide = location.pathname !== '/home';

  useEffect(() => {
    if (!shouldAutoHide) {
      setIsVisible(true);
      return;
    }

    // Initially hide on all pages except home
    setIsVisible(false);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolling up - show navbar
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);

        // Clear existing timeout
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }

        // Auto-hide after 3 seconds of no interaction
        const timeout = setTimeout(() => {
          setIsVisible(false);
        }, 3000);

        setHideTimeout(timeout);
      }
      // Scrolling down - hide navbar
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [lastScrollY, shouldAutoHide, hideTimeout]);

  // Show navbar on mouse movement (on auto-hide pages)
  useEffect(() => {
    if (!shouldAutoHide) return;

    const handleMouseMove = () => {
      setIsVisible(true);

      // Clear existing timeout
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      // Auto-hide after 3 seconds
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      setHideTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [shouldAutoHide, hideTimeout]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`bottom-nav ${!isVisible && shouldAutoHide ? 'hidden' : ''}`}>
      {navItems.map((item, idx) => (
        <button
          key={idx}
          className={'nav-item ' + (isActive(item.path) ? 'active' : '')}
          onClick={() => navigate(item.path)}
          title={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
