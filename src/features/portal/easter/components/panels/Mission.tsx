import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { Attempts } from "./Attempts";
import { getAttemptsLeft, isWithinRange } from "../../lib/Utils";
import { goHome } from "features/portal/lib/portalUtil";
import { PortalMachineState } from "../../lib/Machine";
import { Guide } from "./Guide";
import { PORTAL_NAME } from "../../Constants";
// import { hasFeatureAccess } from "lib/flags";
// import { Prize } from "./Prize";
// import { AchievementsList } from "./AchievementsList";
import { OuterPanel } from "../../../../../components/ui/Panel";
import { Controls } from "./Controls";

import key from "public/world/key.png";
import { decodeToken } from "features/auth/actions/login";
import { getUrl } from "features/portal/actions/loadPortal";

interface Props {
  mode: "introduction" | "success" | "failed";
  showScore: boolean;
  showExitButton: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
  trainingButtonText?: string;
  onTraining?: () => void;
}

const _isJoystickActive = (state: PortalMachineState) =>
  state.context.isJoystickActive;
const _minigame = (state: PortalMachineState) =>
  state.context.state?.minigames.games[PORTAL_NAME];
const _lastScore = (state: PortalMachineState) => state.context.lastScore;
const _jwt = (state: PortalMachineState) => state.context.jwt;
// const _state = (state: PortalMachineState) => state.context.state;

export const Mission: React.FC<Props> = ({
  mode,
  showScore,
  showExitButton,
  confirmButtonText,
  onConfirm,
  trainingButtonText,
  onTraining,
}) => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);

  const isJoystickActive = useSelector(portalService, _isJoystickActive);
  const minigame = useSelector(portalService, _minigame);
  const lastScore = useSelector(portalService, _lastScore);
  const jwt = useSelector(portalService, _jwt);
  // const state = useSelector(portalService, _state);

  const farmId = !getUrl() ? 0 : decodeToken(jwt as string).farmId;
  const attemptsLeft = getAttemptsLeft(minigame, farmId);

  const dateKey = new Date().toISOString().slice(0, 10);

  const [page, setPage] = React.useState<
    "main" | "achievements" | "guide" | "controls"
  >("main");

  // const hasBetaAccess = state
  //   ? hasFeatureAccess(state, "")
  //   : false;

  return (
    <>
      {page === "main" && (
        <>
          <div>
            <div className="w-full relative flex justify-between gap-1 items-center pt-1 px-1">
              <Attempts attemptsLeft={attemptsLeft} />
              <div className="gap-1">
                <Button
                  className="whitespace-nowrap capitalize w-32 p-0"
                  onClick={() => setPage("controls")}
                >
                  <div className="flex flex-row gap-1 justify-center items-center">
                    <img src={key} className="h-5 mt-1" />
                    {t(`${PORTAL_NAME}.controls`)}
                  </div>
                </Button>
              </div>
            </div>

            <div className="w-full px-1 mb-3">
              <div className="italic">{t(`${PORTAL_NAME}.description1`)}</div>
              <div>{t(`${PORTAL_NAME}.description2`)}</div>
              <div>{t(`${PORTAL_NAME}.description3`)}</div>
              <div>{t(`${PORTAL_NAME}.description4`)}</div>
              <div>{t(`${PORTAL_NAME}.description5`)}</div>
            </div>

            <div className="w-full flex flex-row gap-1 mb-3">
              {showScore && (
                <OuterPanel className="w-full flex flex-col items-center">
                  <Label type="info">{t(`leaderboard.score`)}</Label>
                  <div>{lastScore}</div>
                </OuterPanel>
              )}
              <OuterPanel className="w-full flex flex-col items-center">
                <Label type="default">{t(`${PORTAL_NAME}.bestToday`)}</Label>
                <div>{minigame?.history[dateKey]?.highscore || 0}</div>
              </OuterPanel>
              <OuterPanel className="w-full flex flex-col items-center">
                <Label type="default">{t(`${PORTAL_NAME}.bestAllTime`)}</Label>
                <div>
                  {Object.entries(minigame?.history ?? {}).reduce(
                    (acc, [date, entry]) => {
                      if (!isWithinRange(date)) return acc;
                      return Math.max(acc, entry.highscore);
                    },
                    0,
                  )}
                </div>
              </OuterPanel>
            </div>
          </div>

          {trainingButtonText ? (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex gap-1">
                <Button
                  className="whitespace-nowrap capitalize"
                  onClick={onTraining}
                >
                  {trainingButtonText}
                </Button>
                {confirmButtonText && (
                  <Button
                    className="whitespace-nowrap capitalize"
                    onClick={onConfirm}
                  >
                    {confirmButtonText}
                  </Button>
                )}
              </div>
              {showExitButton && (
                <Button
                  className="whitespace-nowrap capitalize"
                  onClick={goHome}
                >
                  {t("exit")}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex mt-1 space-x-1">
              {showExitButton && (
                <Button
                  className="whitespace-nowrap capitalize"
                  onClick={goHome}
                >
                  {t("exit")}
                </Button>
              )}
              {confirmButtonText && (
                <Button
                  className="whitespace-nowrap capitalize"
                  onClick={onConfirm}
                >
                  {confirmButtonText}
                </Button>
              )}
            </div>
          )}
        </>
      )}
      {/* {page === "achievements" && (
        <AchievementsList onBack={() => setPage("main")} />
      )} */}
      {page === "guide" && <Guide onBack={() => setPage("main")} />}
      {page === "controls" && <Controls onBack={() => setPage("main")} />}
    </>
  );
};
