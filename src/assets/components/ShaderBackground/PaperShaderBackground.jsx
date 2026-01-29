"use client"

import { useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

export default function PaperShaderBackground() {
  // You can tweak these for feel - slightly slower on mobile for better performance
  const [speed] = useState(() => {
    // Reduce speed slightly on mobile devices for better performance
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 0.4;
    }
    return 0.6;
  });

  return (
    <div className="w-full h-full">
      <MeshGradient
        className="w-full h-full"
        colors={[
          "#000000",
          "#111111",
          "#2a2a2a",
          "#ffffff",
        ]}
        speed={speed}
      />
    </div>
  );
}
