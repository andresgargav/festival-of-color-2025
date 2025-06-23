import React, { useState } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Mission } from "./Mission";
import { PANEL_NPC_WEARABLES, PORTAL_NAME } from "../../Constants";

import cyanBalloon from "public/world/balloon-falling-cyan.png";
import page from "public/world/page.png";
import { Guide } from "./Guide";

interface Props {
  mode: "introduction" | "success" | "failed";
  showScore: boolean;
  showExitButton: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
}
export const RulesPanel: React.FC<Props> = ({
  mode,
  showScore,
  showExitButton,
  confirmButtonText,
  onConfirm,
}) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      className="overflow-y-hidden"
      bumpkinParts={PANEL_NPC_WEARABLES}
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          icon: cyanBalloon,
          name: t(`${PORTAL_NAME}.portal.title`),
        },
        {
          icon: page,
          name: t("guide"),
        },
      ]}
    >
      <>
        {tab === 0 && (
          <Mission
            mode={mode}
            showScore={showScore}
            showExitButton={showExitButton}
            confirmButtonText={confirmButtonText}
            onConfirm={onConfirm}
          />
        )}

        {tab === 1 && <Guide />}
      </>
    </CloseButtonPanel>
  );
};
