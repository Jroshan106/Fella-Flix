import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing rings */}
        <div className="absolute w-32 h-32 rounded-full border-4 border-primary/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-24 h-24 rounded-full border-4 border-primary/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
        
        {/* Center Logo */}
        <div className="relative w-20 h-20 animate-[pulse_2s_ease-in-out_infinite] z-10 drop-shadow-[0_0_15px_rgba(143,186,150,0.5)]">
          <Image 
            src="/icon.png" 
            alt="Loading..." 
            fill 
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
