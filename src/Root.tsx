import { MyComposition } from "./Composition";
import { MascotComps } from "./MascotComps";
import { VillainComps } from "./VillainComps";
import { CastComps } from "./CastComps";
import { Ep1Comp } from "./Ep1";
import { Ep2Comp } from "./Ep2";
import { Ep3Comp } from "./Ep3";
import { PfpComps } from "./PfpComps";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <MascotComps />
      <VillainComps />
      <CastComps />
      <Ep1Comp />
      <Ep2Comp />
      <Ep3Comp />
      <PfpComps />
    </>
  );
};
