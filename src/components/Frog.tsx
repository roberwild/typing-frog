"use client";

import React from "react";
import styles from "@/styles/Frog.module.css";

export type FrogState = "idle" | "jumping" | "shock" | "recovering" | "dead";

interface FrogProps {
  state: FrogState;
  onAnimationComplete?: () => void;
}

export const Frog: React.FC<FrogProps> = ({ state, onAnimationComplete }) => {
  const containerClass = `${styles.frogContainer} ${styles[state]}`;

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    const name = e.animationName || "";
    if (
      name.includes("frogJump") ||
      name.includes("frogShock") ||
      name.includes("frogRecover")
    ) {
      onAnimationComplete?.();
    }
  };

  return (
    <div className={containerClass} data-state={state}>
      <div className={styles.frog} onAnimationEnd={handleAnimationEnd}>
        
        {/* CUERPO DE LA RANA */}
        <div className={styles.body}>
          {/* Vientre */}
          <div className={styles.belly}></div>
          {/* Manchas del lomo */}
          <div className={styles.spots}></div>
        </div>

        {/* CABEZA */}
        <div className={styles.head}>
          {/* Ojo izquierdo (visible en perfil) */}
          <div className={styles.eye}>
            <div className={styles.pupil}></div>
            <div className={styles.highlight}></div>
          </div>
          {/* Boca */}
          <div className={styles.mouth}></div>
        </div>

        {/* PATAS TRASERAS (POTENTES) */}
        <div className={styles.backLegs}>
          <div className={styles.backLeg}>
            <div className={styles.thigh}></div>
            <div className={styles.shin}></div>
            <div className={styles.foot}></div>
          </div>
        </div>

        {/* PATAS DELANTERAS (PEQUEÑAS) */}
        <div className={styles.frontLegs}>
          <div className={styles.frontLeg}>
            <div className={styles.arm}></div>
            <div className={styles.hand}></div>
          </div>
        </div>

        {/* EFECTOS ESPECIALES */}
        {state === "jumping" && <div className={styles.splash}>💧</div>}
        {state === "shock" && (
          <>
            <div className={styles.electricSparks}>⚡</div>
            <div className={styles.shockwave}></div>
          </>
        )}
      </div>
    </div>
  );
};
