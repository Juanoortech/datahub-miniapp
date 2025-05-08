import React from "react";
import { useSelector } from "react-redux";
import { clsx } from "clsx";

import { RootState } from "@/app/store";

import { Button } from "@/shared/ui";
import { LazyImage } from "@/shared/ui/LazyImage";
import { IconImage } from "@/shared/ui/IconImage";
import { toFormattedNumber } from "@/shared/lib/number";
import { PropsDefault, RouterPathes } from "@/shared/lib/types";

import { InfoModal } from "./InfoModal";
import styles from "./LeaderBoardHeader.module.scss";
import { useModal } from "@/shared/ui/BottomSheet";
import { useNavigate } from "react-router-dom";

export const LeaderBoardHeader: React.FC<PropsDefault> = ({ className }) => {
  const { avatar, name, place, points, bonus } = useSelector(
    (state: RootState) => ({
      avatar: state.viewer.data.photo,
      name: state.viewer.data.name,
      place: state.leaderboard.viewerPlace,
      points: state.leaderboard.viewerPoints,
      bonus: state.leaderboard.viewerBonus,
    })
  );
  const navigate = useNavigate();
  const { isOpen, close } = useModal();

  return (
    <>
      <div className={clsx(styles.root, className)}>
        <div className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          <Button size={"s"} onClick={() => navigate(RouterPathes.POINTS)}>
            How to use points?
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles["avatar-wrapper"]}>
            <LazyImage
              className={styles.avatar}
              src={avatar}
              alt={"avatar"}
              skeletonMinHeight={64}
            />
          </div>
          <div className={styles.body}>
            <div className={styles["row-between"]}>
              <div className={styles.row}>
                <p className={styles.name}>{name}</p>
                {place <= 5 && <IconImage name={"crown"} size={20} />}
              </div>
              {bonus > 0 && (
                <div className={styles.badge}>rewards x{bonus}</div>
              )}
            </div>
            <div className={styles["row-between"]}>
              <p className={styles["bottom-text"]}>
                {place} <span>place</span>
              </p>
              <p className={styles["bottom-text"]}>
                {toFormattedNumber(points)} <span>Pts</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <InfoModal isOpen={isOpen} setIsOpen={close} />
    </>
  );
};
