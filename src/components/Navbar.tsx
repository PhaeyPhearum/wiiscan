import { useState, useEffect } from 'react';
import { Menu, Leaf, Scan, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onModeChange: (mode: 'plant' | 'animal' | 'skin') => void;
  currentMode: 'plant' | 'animal' | 'skin';
}

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none" className="w-5 h-5">
    <path d="M7.11114 5.10659L11.455 0.161865H10.426L6.65264 4.45442L3.64108 0.161865H0.166748L4.7218 6.65359L0.166748 11.8383H1.19575L5.17797 7.3042L8.35908 11.8383H11.8334M1.56714 0.921754H3.14797L10.4252 11.1157H8.84403" fill="currentColor"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z" fill="currentColor"/>
  </svg>
);

const DexScreenerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 300" className="w-5 h-5" fill="currentColor">
    <path d="M151.818 106.866c9.177-4.576 20.854-11.312 32.545-20.541 2.465 5.119 2.735 9.586 1.465 13.193-.9 2.542-2.596 4.753-4.826 6.512-2.415 1.901-5.431 3.285-8.765 4.033-6.326 1.425-13.712.593-20.419-3.197m1.591 46.886l12.148 7.017c-24.804 13.902-31.547 39.716-39.557 64.859-8.009-25.143-14.753-50.957-39.556-64.859l12.148-7.017a5.95 5.95 0 003.84-5.845c-1.113-23.547 5.245-33.96 13.821-40.498 3.076-2.342 6.434-3.518 9.747-3.518s6.671 1.176 9.748 3.518c8.576 6.538 14.934 16.951 13.821 40.498a5.95 5.95 0 003.84 5.845zM126 0c14.042.377 28.119 3.103 40.336 8.406 8.46 3.677 16.354 8.534 23.502 14.342 3.228 2.622 5.886 5.155 8.814 8.071 7.897.273 19.438-8.5 24.796-16.709-9.221 30.23-51.299 65.929-80.43 79.589-.012-.005-.02-.012-.029-.018-5.228-3.992-11.108-5.988-16.989-5.988s-11.76 1.996-16.988 5.988c-.009.005-.017.014-.029.018-29.132-13.66-71.209-49.359-80.43-79.589 5.357 8.209 16.898 16.982 24.795 16.709 2.929-2.915 5.587-5.449 8.814-8.071C69.31 16.94 77.204 12.083 85.664 8.406 97.882 3.103 111.959.377 126 0m-25.818 106.866c-9.176-4.576-20.854-11.312-32.544-20.541-2.465 5.119-2.735 9.586-1.466 13.193.901 2.542 2.597 4.753 4.826 6.512 2.416 1.901 5.432 3.285 8.766 4.033 6.326 1.425 13.711.593 20.418-3.197" />
    <path d="M197.167 75.016c6.436-6.495 12.107-13.684 16.667-20.099l2.316 4.359c7.456 14.917 11.33 29.774 11.33 46.494l-.016 26.532.14 13.754c.54 33.766 7.846 67.929 24.396 99.193l-34.627-27.922-24.501 39.759-25.74-24.231L126 299.604l-41.132-66.748-25.739 24.231-24.501-39.759L0 245.25c16.55-31.264 23.856-65.427 24.397-99.193l.14-13.754-.016-26.532c0-16.721 3.873-31.578 11.331-46.494l2.315-4.359c4.56 6.415 10.23 13.603 16.667 20.099l-2.01 4.175c-3.905 8.109-5.198 17.176-2.156 25.799 1.961 5.554 5.54 10.317 10.154 13.953 4.48 3.531 9.782 5.911 15.333 7.161 3.616.814 7.3 1.149 10.96 1.035-.854 4.841-1.227 9.862-1.251 14.978L53.2 160.984l25.206 14.129a41.926 41.926 0 015.734 3.869c20.781 18.658 33.275 73.855 41.861 100.816 8.587-26.961 21.08-82.158 41.862-100.816a41.865 41.865 0 015.734-3.869l25.206-14.129-32.665-18.866c-.024-5.116-.397-10.137-1.251-14.978 3.66.114 7.344-.221 10.96-1.035 5.551-1.25 10.854-3.63 15.333-7.161 4.613-3.636 8.193-8.399 10.153-13.953 3.043-8.623 1.749-17.689-2.155-25.799l-2.01-4.175z" />
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12" fill="none" className="w-5 h-5">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.49 11.8675C11.6912 12.0043 11.9506 12.0385 12.1818 11.9545C12.4131 11.8699 12.5831 11.6803 12.6343 11.4505C13.1775 9.0001 14.4949 2.79789 14.9893 0.56889C15.0268 0.400889 14.9643 0.226289 14.8268 0.114089C14.6893 0.00188897 14.4987 -0.0305111 14.3287 0.0300889C11.7081 0.96129 3.63767 3.86829 0.338991 5.04009C0.129621 5.11449 -0.00662619 5.30769 0.000248653 5.5195C0.00774848 5.7319 0.156495 5.9161 0.370865 5.9779C1.85021 6.4027 3.79204 6.9937 3.79204 6.9937C3.79204 6.9937 4.69952 9.6247 5.17263 10.9627C5.232 11.1307 5.36888 11.2627 5.5495 11.3083C5.72949 11.3533 5.92199 11.3059 6.05636 11.1841C6.81634 10.4953 7.99132 9.4303 7.99132 9.4303C7.99132 9.4303 10.2238 11.0017 11.49 11.8675ZM4.60889 6.6613L5.65825 9.9841L5.89136 7.8799C5.89136 7.8799 9.94565 4.36929 12.2568 2.36829C12.3243 2.30949 12.3337 2.21109 12.2775 2.14209C12.2218 2.07309 12.1193 2.05689 12.0425 2.10369C9.36379 3.74589 4.60889 6.6613 4.60889 6.6613Z" fill="currentColor"/>
  </svg>
);

export function Navbar({ onModeChange, currentMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleModeChange = (mode: 'plant' | 'animal' | 'skin') => {
    onModeChange(mode);
    setIsOpen(false);
  };

  const socialLinks = [
    { icon: TwitterIcon, href: 'https://x.com/WiiScanApp', label: 'X (Twitter)' },
    { icon: GitHubIcon, href: 'https://github.com/wiiscan', label: 'GitHub' },
    { icon: DexScreenerIcon, href: 'https://dexscreener.com/', label: 'DexScreener' },
    { icon: TelegramIcon, href: 'https://t.me/wiiscan', label: 'Telegram' },
  ];

  const navigationItems = [
    { mode: 'skin', icon: Scan, label: 'Skin Analysis' },
    { mode: 'plant', icon: Leaf, label: 'Plant ID' },
    { mode: 'animal', icon: PawPrint, label: 'Animal ID' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-3">
              <div className="relative w-48 h-12">
                <img
                  src="/images/logo.png"
                  alt="WiiScan"
                  className="object-contain w-full h-full"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    height: 'auto',
                  }}
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1 px-4">
            <div className="flex space-x-2">
              {navigationItems.map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  onClick={() => handleModeChange(mode as 'plant' | 'animal' | 'skin')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    'flex items-center space-x-2',
                    currentMode === mode 
                      ? 'bg-primary/10 text-primary shadow-inner shadow-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-bold whitespace-nowrap">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center space-x-5 px-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-muted-foreground hover:text-primary transition-colors duration-300",
                  "hover:shadow-lg hover:shadow-primary/10"
                )}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                title={label}
              >
                <Icon />
                <span className="sr-only">{label}</span>
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors duration-300",
                "text-muted-foreground hover:text-primary focus:outline-none",
                isOpen && "bg-primary/10"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/10 bg-background/95 backdrop-blur-lg"
          >
            <div className="px-3 pt-3 pb-4 space-y-2">
              {navigationItems.map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  onClick={() => handleModeChange(mode as 'plant' | 'animal' | 'skin')}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium',
                    'transition-all duration-300',
                    currentMode === mode 
                      ? 'bg-primary/10 text-primary shadow-inner shadow-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-bold whitespace-nowrap">{label}</span>
                </motion.button>
              ))}
            </div>
            
            {/* Mobile Social Links */}
            <div className="px-6 py-4 border-t border-border/10">
              <div className="flex justify-center space-x-8">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon />
                    <span className="sr-only">{label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}